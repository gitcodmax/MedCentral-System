import pool from "../../config/db.js";

export async function saveNewItemQ({ itemName, sku, categoryId, storageTempCode, 
  bulkUom, sellingUom, unitsPerBulk, pricePerUnit, minStockLevel
}) {
  await pool.query(
    `
    INSERT INTO items 
      (name, sku_code, category_id, storage_temp_code, 
      bulk_uom_id, selling_uom_id, units_per_bulk, 
      price_per_selling, min_stock_level) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [itemName, sku, categoryId, storageTempCode, bulkUom, sellingUom,
      unitsPerBulk, pricePerUnit, minStockLevel
    ]
  )
}

export async function getCatalogItemsQ() {
  const { rows } = await pool.query(
    `
    SELECT jsonb_agg(
      jsonb_build_object(
        'name', name, 
        'sku', sku_code, 
        'category', (SELECT name FROM cfg_item_categories WHERE id = category_id), 
        'temp', (SELECT description FROM cfg_storage_options WHERE code = storage_temp_code), 
        'uom',(SELECT name FROM cfg_uoms WHERE id = bulk_uom_id), 
        'sellingUnit', (SELECT name FROM cfg_uoms WHERE id = selling_uom_id), 
        'price', price_per_selling
      ))AS catalog_items
    FROM items;
    `
  )

  return rows[0]
}