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

export async function saveItemDamageQ({ itemId, damageTypeId, qtyAffected,
  discoveryDate, detailedDesc, photo, actionTaken, userId
}) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const damagedItem = await client.query(
      `
      INSERT INTO wh_items_damages (item_id, damage_id, quantity_affected, discovered_at, 
        detailed_description, photo_url, action_taken, reported_by_user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING item_damage_id
      `, [itemId, damageTypeId, qtyAffected, discoveryDate, detailedDesc,
      photo, actionTaken, userId]
    )

    const itemDamageId = damagedItem.rows[0].item_damage_id
    if (!itemDamageId) throw new Error('Item damage info not saved!')
    
    const itemUpdate = await client.query(
      `
      UPDATE items 
      SET total_selling_units = (total_selling_units - $1)
      WHERE item_id = $2 
      RETURNING current_stock
      `, [qtyAffected, itemId]
    )

    const currentStock = itemUpdate.rows[0].current_stock
    if (!currentStock) throw new Error('Item current stock not updated!')
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}