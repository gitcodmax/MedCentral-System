import pool from "../../config/db.js";

export async function createNewShelfQ({ shelfLabel, storageZone, bulkUom, binCapacity }) {
  await pool.query(
    `
    INSERT INTO cfg_warehouse_shelves (shelf_label, storage_type_code,
      bulk_uom_id, max_uom_capacity)
    VALUES ($1, $2, $3, $4)
    `,[shelfLabel, storageZone, bulkUom, binCapacity]
  )
}