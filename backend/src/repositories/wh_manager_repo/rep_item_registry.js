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