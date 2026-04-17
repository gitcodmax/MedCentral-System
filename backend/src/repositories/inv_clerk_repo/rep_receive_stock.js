import pool from "../../config/db.js";

// Get items data for the receive_stock_function.js file 
// to populate in the input textboxes
export async function getItemsDataQ() {
  const { rows } = await pool.query(
    `
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'itemName', i.name, 
          'sku', i.sku_code, 
          'category', (SELECT name FROM cfg_item_categories ic WHERE ic.id = i.category_id),
          'bulkUom',(SELECT name FROM cfg_uoms u WHERE u.id = i.bulk_uom_id) || '(' ||
          i.units_per_bulk || ' ' || (SELECT name FROM cfg_uoms u WHERE u.id = i.selling_uom_id) || ')',
          'storageTemp', (SELECT description FROM cfg_storage_options s WHERE s.code = i.storage_temp_code), 
          'shelfId', COALESCE(
            (SELECT shelf_label FROM cfg_warehouse_shelves ws 
              WHERE ws.shelf_id = i.shelf_id), 'Not Assigned'), 
          'storageCode', i.storage_temp_code
        )
      ) AS master_inv_items
    FROM items i
    `
  )

  return rows[0]
}

// Save the incoming stock data from the stock_receipt.js file
export async function saveNewStockDataQ({ deliveryDetails, items }) {
  const client = await pool.connect()
  const { supplierName, deliveryDateTime, userId } = deliveryDetails

  try {
    await client.query('BEGIN')

    const { rows } = await client.query(
      `
      INSERT INTO inbound_stock(supplier_name, delivery_date, received_by_user_id) 
      VALUES ($1, $2, $3) RETURNING stock_batch_id
      `, [supplierName, deliveryDateTime, userId]
    )

    const batchId = rows[0].stock_batch_id
    if (!batchId) throw new Error('Batch delivery details not saved!')

    for (const item of items) {
      const skuCode = item.itemCode
      const qtyReceived = item.qtyDelivered
      const { expiryDate } = item
      const { batchNo } = item
      
      // Save in inbound stock items table
      const batchItems = await client.query(
      `
      INSERT INTO inbound_stock_items (stock_batch_id, sku_code, quantity_received, 
      expiry_date, batch_number) 
      VALUES ($1, $2, $3, $4, $5) RETURNING inbound_item_id
      `, [batchId, skuCode, qtyReceived, expiryDate, batchNo]
      )

      const inItemId = batchItems.rows[0].inbound_item_id
      if (!inItemId) throw new Error('Inbound item not saved!')
      
      // Update current stock
      const itemsUpdate = await client.query(
        `
        UPDATE items 
        SET current_stock = (current_stock + $1) 
        WHERE sku_code = $2 
        RETURNING name
        `, [qtyReceived, skuCode]
      )

      const itemName = itemsUpdate.rows[0].name
      if(!itemName) throw new Error(`Item current stock not updated!`)
    }
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}