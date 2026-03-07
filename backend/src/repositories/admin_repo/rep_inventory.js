import pool from "../../config/db.js";

export async function getAllItemsQ() {
  const { rows } = await pool.query(`
    SELECT item_id, name, sku_code, category_id, storage_temp_code, bulk_uom_id,
     selling_uom_id, units_per_bulk, price_per_selling, current_stock, min_stock_level
    FROM items`)

  return rows
}

export async function getCatStorageUomQ() {
  const client = await pool.connect();

  try {
    await pool.query('BEGIN')

    const allCategories = await pool.query(
      `SELECT * FROM cfg_item_categories`
    )
    const allStorageOptions = await pool.query(
      `SELECT * FROM cfg_storage_options`
    )
    const allUoms = await pool.query(
      `SELECT * FROM cfg_uoms`
    )

    if (allCategories.rowCount === 0 ||
      allStorageOptions.rowCount === 0 || allUoms.rowCount === 0) {
      throw new Error('System config missing')
    }

    await client.query('COMMIT')

    const SystemConfig = {
      categories: allCategories.rows,
      storageOptions: allStorageOptions.rows,
      units: allUoms.rows
    }
    return (SystemConfig)
  } catch (err) {
    await client.query('ROLLBACK')
  } finally {
    client.release()
  }
}

export async function updateItemsDetailsQ({ itemId, name, cat, storageTemp,
  bulkUom, sellingUom, unitsPerBulk, pricePerSelling, minStockLevel
}) {
  const { rows } = await pool.query(`
    UPDATE items
    SET 
        name = $1,
        category_id = $2,
        storage_temp_code = $3,
        bulk_uom_id = $4,
        selling_uom_id = $5,
        units_per_bulk = $6,
        price_per_selling = $7,
        min_stock_level = $8
    WHERE item_id = $9 RETURNING *;
   `, [name, cat, storageTemp, bulkUom, sellingUom, 
    unitsPerBulk, pricePerSelling, minStockLevel, itemId]
  )

  return rows
}

export async function updateCurrentStockQ({itemId, newStockQty, adjustReason}){
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const res = await client.query(`
      SELECT current_stock FROM items WHERE item_id = $1
    `, [itemId])

    if (res.rows.length === 0) throw new Error("Item does not exist!");

    const currentStock = res.rows[0].current_stock;
    const qtyChange = currentStock - newStockQty;

    if(qtyChange === 0) throw new Error("The item quantity was not changed!")

    await client.query(`
      INSERT INTO stock_log(item_id, quantity_change, new_stock_level, adjustment_reason)
      VALUES ($1, $2, $3, $4)
    `, [itemId, -qtyChange, newStockQty, adjustReason]);

    const updated = await client.query(`
      UPDATE items SET current_stock = $1 WHERE item_id = $2 RETURNING *
    `, [newStockQty, itemId]);

    await client.query('COMMIT')

    return updated.rows[0]; 

  } catch(err) {
    await client.query('ROLLBACK')
    throw err;
  } finally {
    client.release()
  }
}

export async function deleteItemQ(itemId){
  await pool.query(`DELETE FROM items WHERE item_id = $1`, [itemId])
}