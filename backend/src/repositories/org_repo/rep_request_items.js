import pool from "../../config/db.js";

export async function getProductCatalogDataQ(){
  const {rows} = await pool.query(
    `
      SELECT json_build_object(
        'departments', (
            SELECT json_agg(dept) 
            FROM (SELECT * FROM cfg_hospital_departments) dept
        ),
        'catalog', (
            SELECT json_agg(item_list) 
            FROM (
                SELECT i.item_id AS id, i.name AS name, i.sku_code AS sku, u.name AS uom, 
                      LOWER(s.description) AS tempZone, i.price_per_selling AS price
                FROM items i 
                JOIN cfg_uoms u ON i.selling_uom_id = u.id
                JOIN cfg_storage_options s ON i.storage_temp_code = s.code
            ) item_list
        )
    ) AS product_catalog;
    `
  )

  return rows[0]
}

// Order Summary / Cart
export const getAllDeptQ = async () => {
  const {rows} = await pool.query(`
    SELECT json_agg(jsonb_build_object('id', id, 'name', name)) 
    AS departments FROM cfg_hospital_departments 
  `)

  return rows[0]
}

export const getHospCartItemsQ = async (hospId) => {
  const {rows} = await pool.query(`
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
  const {rows} = await pool.query(`
    SELECT COUNT(*) FROM cart_items WHERE hospital_id = $1
  `, [hosId])

  return rows[0]
}