import pool from "../../config/db.js";

export async function getApprovedRequestsQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH request_items_agg AS (
    SELECT 
        ri.request_id,
        jsonb_agg(
            jsonb_build_object(
                'name', i.name,
                'quantityRequested', ri.quantity_requested,
                'subtotal', (ri.quantity_requested * ri.unit_price_at_request)
            )
        ) AS items_list,
        COUNT(ri.request_item_id) AS item_count
    FROM request_items ri
    JOIN items i ON ri.item_id = i.item_id
    GROUP BY ri.request_id
    )

    SELECT jsonb_agg(approved_request_payload) AS approved_requests
    FROM 
    (
    SELECT 
        jsonb_build_object(
            'requestId', 'REQ' || '-' || r.request_id,
            'hospital', h.name,
            'location', (z.zone_name || ', ' || (SELECT name FROM cfg_counties WHERE id = z.county_id)),
            'itemCount', ria.item_count,
            'totalAmount', r.total_estimated_value,
            'requestedAt', TO_CHAR(r.created_at, 'Mon DD, HH12:MI AM'),
            'approvedAt', TO_CHAR(r.approved_at, 'Mon DD, HH12:MI AM'),
            'items', COALESCE(ria.items_list, '[]'::jsonb)
        ) AS approved_request_payload
    FROM requests r
    JOIN hospitals h ON r.hospital_id = h.hospital_id
    JOIN cfg_zones z ON h.zone_id = z.id 
    JOIN request_items_agg ria ON r.request_id = ria.request_id
    WHERE r.hospital_id = $1 
      AND r.status_id = 3
    )approved_req;
    `, [hosId]
  )

  return rows[0]
}

export async function createOrderQ(reqId) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { rows } = await client.query(
      `
      INSERT INTO orders (request_id)
      VALUES ($1) RETURNING order_id
      `, [reqId]
    )

    const ordId = rows[0].order_id
    if (!ordId) throw new Error('Order not created')

    const orderPackagesRes = await client.query(
      `
      INSERT INTO order_packages(order_id, storage_temp_code, status_id)
      SELECT $1::integer AS order_id, i.storage_temp_code, 4 AS status_id
      FROM request_items ri 
      JOIN items i ON ri.item_id = i.item_id 
      WHERE ri.request_id = $2
      GROUP BY 2, 1
      RETURNING package_id 
      `, [ordId, reqId]
    )

    const orderPackages = orderPackagesRes.rows
    if (orderPackages.length === 0) throw new Error('Package not created')

    for (const pkg of orderPackages) {
      const packageId = pkg.package_id
      const pkgItemRow = await client.query(
        `
        INSERT INTO package_items(package_id, request_item_id)
        SELECT op.package_id, ri.request_item_id  
        FROM order_packages op 
        JOIN orders o ON op.order_id = o.order_id 
        JOIN request_items ri ON o.request_id = ri.request_id 
        JOIN items i ON ri.item_id = i.item_id AND op.storage_temp_code = i.storage_temp_code 
        WHERE op.package_id = $1
        RETURNING package_item_id
        `, [packageId]
      )

      if (!pkgItemRow.rows[0].package_item_id) throw new Error('Package item not created')
    }
    
    await client.query(
      `UPDATE requests SET status_id = 4 WHERE request_id = $1`
      , [reqId]
    )

    await client.query(
      `
      WITH new_stock_calc AS (
        SELECT i.item_id, (i.total_selling_units - ri.quantity_requested) AS new_stock
        FROM request_items ri 
        JOIN items i ON ri.item_id = i.item_id 
        WHERE request_id = $1
      )
      
      UPDATE items i
      SET total_selling_units = ns.new_stock
      FROM new_stock_calc ns
      WHERE i.item_id = ns.item_id
      `, [reqId]
    )

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

