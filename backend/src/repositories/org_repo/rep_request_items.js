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