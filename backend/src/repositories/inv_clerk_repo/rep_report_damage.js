import pool from "../../config/db.js";

export async function getItemsDamagesQ() {
  const { rows } = await pool.query(
    `
    SELECT 
		jsonb_build_object(
			'items', (SELECT 
						jsonb_agg(
							jsonb_build_object(
								'itemId', item_id, 
								'itemName', name 
							)
						)
					FROM items
			), 
			'damageTypes', (SELECT 
								jsonb_agg(
									jsonb_build_object(
										'damageId', id, 
										'damageLabel', label
									)
								)
							FROM cfg_damage_types
							)
		)AS items_damages
    `
  )

  return rows[0]
}