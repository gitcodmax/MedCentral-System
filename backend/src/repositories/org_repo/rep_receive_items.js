import pool from "../../config/db.js";

export async function getAllDeliveredPackagesQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH package_items_cte AS (
    SELECT 
        pi.package_id,
        json_agg(
            jsonb_build_object(
                'requestItemId', ri.request_item_id,
                'name', i.name,
                'quantity', ri.quantity_requested,
                'uom', u.name,
                'sku', i.sku_code
            )
        ) AS items_list
    FROM package_items pi 
      JOIN request_items ri ON ri.request_item_id = pi.request_item_id
        JOIN items i ON ri.item_id = i.item_id
        JOIN cfg_uoms u ON i.selling_uom_id = u.id
        GROUP BY pi.package_id
    ),
    sibling_packages_cte AS (
        SELECT 
            op.order_id,
            op.package_id,
            json_agg(
                jsonb_build_object(
                    'packageId', 'PKG-' || sibling.package_id || '-' || sibling.storage_temp_code,
                    'status', ds.status_name
                )
            ) FILTER (WHERE sibling.package_id <> op.package_id) AS siblings
        FROM order_packages op
        JOIN order_packages sibling ON op.order_id = sibling.order_id
        JOIN deliveries d ON sibling.package_id = d.package_id 
        JOIN cfg_statuses ds ON op.status_id = ds.id
        GROUP BY op.order_id, op.package_id
    )

    SELECT json_agg(delivery_payload) AS deliveries_made 
    FROM (
    SELECT 
        jsonb_build_object(
            'deliveryId', d.delivery_id,
            'orderId', 'ORD' || '-' || o.order_id,
            'packageId', 'PKG' || '-' || d.package_id || '-' || st.code,
            'deliveryDateTime', to_char(d.delivered_at, 'Mon DD, YYYY | HH12:MI AM'),
            'storageTemp', st.description,
            'items', COALESCE(pi.items_list, '[]'::json),
            'siblingPackages', COALESCE(sp.siblings, '[]'::json)
        ) AS delivery_payload
    FROM deliveries d
    JOIN order_packages op ON d.package_id = op.package_id
    JOIN orders o ON op.order_id = o.order_id
    JOIN requests r ON o.request_id = r.request_id
    JOIN hospitals h ON r.hospital_id = h.hospital_id
    JOIN cfg_storage_options st ON op.storage_temp_code = st.code
    LEFT JOIN package_items_cte pi ON d.package_id = pi.package_id
    LEFT JOIN sibling_packages_cte sp ON op.order_id = sp.order_id AND op.package_id = sp.package_id
    WHERE h.hospital_id = $1 AND d.inspected = 'no'
    ORDER BY d.delivered_at DESC);
    `, [hosId]
  )

  return rows[0]
}

export async function getCommonDamageTypesQ() {
  const { rows } = await pool.query(
    `SELECT * FROM cfg_damage_types`
  )
  return rows
}

export async function getReceivedItemsStatusQ() {
  const { rows } = await pool.query(
    `SELECT * FROM cfg_receive_item_status`
  )
  return rows
}

// Save items delivered with issues in delivery_issues table 
// and update the ispected column in deliveries table
export async function saveDeliveredItemsWithIssuesQ(deliveryIssuesArr) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const deliveryId = await saveToDeliveryIssues(deliveryIssuesArr, client)

    if (deliveryId) {
      await client.query(
        `UPDATE deliveries
          SET inspected = 'yes' 
          WHERE delivery_id = $1`
        , [deliveryId]
      )
    }

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

// Save items delivered with issues in delivery_issues table and return delivery id
async function saveToDeliveryIssues(deliveryIssuesArr, client) {
  if (!deliveryIssuesArr || deliveryIssuesArr.length === 0) {
    throw new Error('deliveryIssuesArr is empty');
  }

  const delivIdSet = new Set();

  for (const issue of deliveryIssuesArr) {
    const { 
      deliveryId, 
      requestItemId, 
      damageStatus, 
      quantityAffected, 
      damageType, 
      otherDamageType 
    } = issue;

    delivIdSet.add(deliveryId);

    const { rows } = await client.query(
      `INSERT INTO delivery_issues (
         delivery_id, 
         request_item_id, 
         item_damage_status, 
         quantity_affected,
         type_of_damage, 
         additional_info
       )
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING issue_id`,
      [deliveryId, requestItemId, damageStatus, quantityAffected, damageType, otherDamageType]
    );

    if (!rows[0]?.issue_id) {
      throw new Error('Issue not saved in the database');
    }
  }

  const delivIdArr = [...delivIdSet];
  return delivIdArr[0];
}

// UPdate the status of a package to completed if there is no issue in the items received
export async function updatePackageStatusQ({ packageId, deliveryId }) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    
    const { rows } = await client.query(
      `UPDATE order_packages 
        SET status_id = 10 
        WHERE package_id = $1 RETURNING status_id`
      , [packageId]
    )

    if (rows[0].status_id === 10) {
      await client.query(
        `UPDATE deliveries
          SET inspected = 'yes' 
          WHERE delivery_id = $1`
        , [deliveryId]
      )
    } else {
      throw Error({message: `Package ${packageId} status not updated`})
    }

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}