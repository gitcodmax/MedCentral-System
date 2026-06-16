import pool from "../../config/db.js";


export async function getProductCatalogDataQ() {
  const { rows } = await pool.query(
    `
      SELECT json_agg(item_list) AS product_catalog
      FROM (
          SELECT i.item_id AS id, i.name AS name, i.sku_code AS sku, u.name AS uom, 
                LOWER(s.description) AS tempZone, i.price_per_selling AS price
          FROM items i 
          JOIN cfg_uoms u ON i.selling_uom_id = u.id
          JOIN cfg_storage_options s ON i.storage_temp_code = s.code
          WHERE current_stock IS NOT NULL OR current_stock != 0
      ) item_list
    `
  )

  return rows[0]
}

// Order Summary / Cart
export const getAllDeptQ = async (hosId) => {
  const { rows } = await pool.query(`
    SELECT json_agg(jsonb_build_object('id', hd.id, 'name', hd.name)) AS hosDepts
    FROM hospital_department_mapping hdm
    JOIN cfg_hospital_departments hd ON hdm.department_id = hd.id
    WHERE hospital_id = $1
  `, [hosId])

  return rows[0]
}

export const getHospCartItemsQ = async (hospId) => {
  const { rows } = await pool.query(`
    WITH grand_total AS (
        SELECT 
            SUM(c.quantity * i.price_per_selling) AS total
        FROM cart_items c
        JOIN items i ON c.item_id = i.item_id
        WHERE c.hospital_id = $1
    ), 
    items AS (
        SELECT 
            json_agg(
                jsonb_build_object(
                    'cart_item_id', c.cart_id,
                    'item_id', c.item_id,
                    'sku', i.sku_code,
                    'name', i.name,
                    'uom', u.name,
                    'storage_temp', t.description,
                    'quantity', c.quantity,
                    'unit_price', i.price_per_selling,
                    'department', c.department_id,
                    'subtotal', (c.quantity * i.price_per_selling)
                )
            ) AS list
        FROM cart_items c
        JOIN items i ON c.item_id = i.item_id
        JOIN cfg_uoms u ON i.selling_uom_id = u.id
        JOIN cfg_storage_options t ON i.storage_temp_code = t.code
        WHERE c.hospital_id = $1
    )
    SELECT jsonb_build_object(
        'totalOfAllItems', (SELECT total FROM grand_total),
        'items', (SELECT list FROM items)
    ) AS hospital_cart;
  `, [hospId])

  return rows[0]
}

export const getNoHospCartItemsQ = async (hosId) => {
  const { rows } = await pool.query(`
    SELECT COUNT(*) FROM cart_items WHERE hospital_id = $1
  `, [hosId])

  return rows[0]
}

export const updateCartItemsQ = async (updatedCartItems) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    for (let item of updatedCartItems.changeItemsArr) {
      await client.query(`
        UPDATE cart_items 
        SET quantity = $1, department_id = $2, 
        updated_at = CURRENT_TIMESTAMP
        WHERE cart_id = $3 AND item_id = $4 RETURNING *
      `, [item.quantity, item.department, item.cart_item_id, item.item_id])
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK')
  } finally {
    client.release()
  }
}

export const deleteCartItemQ = async ({ cartItemId, hosId }) => {
  await pool.query(
    `DELETE FROM cart_items 
     WHERE cart_id = $1 AND hospital_id = $2`
    , [cartItemId, hosId])
}

export const updateCartItemsToRequestQ = async ({ hosId, totalItemsValue }) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Create a request in requests table
    const { rows } = await client.query(`
      INSERT INTO requests (hospital_id, status_id, total_estimated_value, created_at) 
      VALUES ($1, 1, $2, CURRENT_TIMESTAMP) RETURNING request_id;
    `, [hosId, totalItemsValue])
    const requestId = rows[0].request_id

    if (!requestId) {
      throw new Error('Request id not returned')
    }

    // Insert the cart items in the request_items table 
    const insReqItms = await client.query(`
      INSERT INTO request_items(request_id, item_id, department_id, quantity_requested, 
      unit_price_at_request) 
      SELECT $1, c.item_id, c.department_id, c.quantity, i.price_per_selling 
      FROM cart_items c 
      JOIN items i ON c.item_id = i.item_id 
      WHERE c.hospital_id = $2 
      RETURNING request_item_id
    `, [requestId, hosId])

    const reqItmId = insReqItms.rows[0].request_item_id
    if(!reqItmId) throw new Error('Items not inserted in request items table')

    // Clear all the items in the cart
    await client.query(`
      DELETE FROM cart_items WHERE hospital_id = $1
    `, [hosId])

    await client.query('COMMIT')

  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

// Product Catalog Page
export async function saveItemToCartQ({ hosId, itemId, deptId, qty }) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { rows } = await client.query(`
      SELECT * FROM cart_items 
      WHERE hospital_id = $1 AND item_id = $2 
    `, [hosId, itemId])

    if (rows.length !== 0) {
      const dbHosId = rows[0].hospital_id
      const dbItemId = rows[0].item_id
      const dbItemQty = rows[0].quantity
      const totalItemQty = dbItemQty + Number(qty)

      await client.query(
        `UPDATE cart_items 
          SET quantity = $1
          WHERE hospital_id = $2 AND item_id = $3
        `, [totalItemQty, dbHosId, dbItemId]
      )
    } else {
      await client.query(
        `INSERT INTO cart_items (hospital_id, item_id, department_id, quantity)
          VALUES 
        ($1, $2, $3, $4)`
        , [hosId, itemId, deptId, qty]
      )
    }

    await client.query('COMMIT')
  } catch (e) {
    throw e
  } finally {
    client.release()
  }
}