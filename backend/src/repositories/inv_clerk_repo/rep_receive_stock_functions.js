import pool from "../../config/db.js";

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