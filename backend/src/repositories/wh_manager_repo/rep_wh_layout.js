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

export async function getWhInvMapQ() {
  const { rows } = await pool.query(
    `
    SELECT 
      jsonb_agg(
      jsonb_build_object(
        'shelfId', ws.shelf_id,
        'shelfLabel', ws.shelf_label,
        'itemSku', COALESCE(i.sku_code, '--'), 
        'itemName', COALESCE(i.name, 'UNALLOCATED'), 
        'tempZone', ws.storage_type_code, 
        'bulkUOM', (SELECT name FROM cfg_uoms WHERE id = ws.bulk_uom_id), 
        'totalCapacity', ws.max_uom_capacity, 
        'remainingUnits', COALESCE(i.current_stock, 0), 
        'spaceFilledPercent', ROUND(
                    ((COALESCE(i.current_stock, 0)::NUMERIC / ws.max_uom_capacity) * 100)
                    , 2), 
        'eligibleItems', CASE WHEN i.sku_code IS NOT NULL THEN '[]'::jsonb 
                  ELSE (SELECT COALESCE(
                        jsonb_agg(
                          jsonb_build_object('sku', sku_code, 'name', name, 'currentStock', current_stock)
                        ), '[]'::jsonb)
                      FROM items 
                      WHERE shelf_id IS NULL 
                        AND storage_temp_code = ws.storage_type_code 
                        AND bulk_uom_id = ws.bulk_uom_id 
                        AND is_active = TRUE 
                        AND current_stock < (ws.max_uom_capacity + 1)
                    ) END
      )) AS wh_inventory_map
    FROM cfg_warehouse_shelves ws 
    LEFT JOIN (SELECT * FROM items WHERE is_active = TRUE) i ON ws.shelf_id = i.shelf_id
    `
  )

  return rows[0]
}

export async function deleteShelfQ(shelfId) {
  await pool.query(
    `
    DELETE FROM cfg_warehouse_shelves
    WHERE shelf_id = $1
    `, [shelfId]
  )
}

export async function assignShelfItemQ({ shelfId, itemSku }) {
  await pool.query(
    `
    UPDATE items 
    SET shelf_id = $1 
    WHERE sku_code = $2
    `, [shelfId, itemSku]
  )
}