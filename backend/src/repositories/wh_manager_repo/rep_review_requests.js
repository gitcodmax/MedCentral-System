import pool from "../../config/db.js";

export async function getAllRequestsQ() {
  const { rows } = await pool.query(
    `
      WITH request_items_details AS (
          SELECT 
              ri.request_id,
              jsonb_agg(
                  jsonb_build_object(
                      'name', i.name,
                      'unitPrice', ri.unit_price_at_request,
                      'quantity', ri.quantity_requested,
                      'uom', u.name,
                      'subtotal', (ri.quantity_requested * ri.unit_price_at_request),
                      'warehouseStock', i.total_selling_units
                  )
              ) AS items_list
          FROM request_items ri
          JOIN items i ON ri.item_id = i.item_id
          JOIN cfg_uoms u ON i.selling_uom_id = u.id
          GROUP BY ri.request_id
      )

      SELECT jsonb_agg(request_payload) AS all_requests 
      FROM(
        SELECT 
            jsonb_build_object(
                'requestId', r.request_id,
                'orgName', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
                'location', z.zone_name || ', ' || (SELECT name FROM cfg_counties WHERE id = z.county_id), 
                'createdAt', TO_CHAR(r.created_at, 'Mon DD, HH12:MI AM'),
                'totalAmount', r.total_estimated_value,
                'items', COALESCE(rid.items_list, '[]'::jsonb)
            ) AS request_payload
        FROM requests r
        JOIN hospitals h ON r.hospital_id = h.hospital_id 
        JOIN cfg_zones z ON h.zone_id = z.id
        LEFT JOIN request_items_details rid ON r.request_id = rid.request_id
        WHERE r.status_id = 1
      );
    `
  )

  return rows[0]
}

export async function denyRequestQ({ reqId, rejectionReason }) {
  await pool.query(
    `
    UPDATE requests
    SET status_id = 2, rejection_reason = $1
    WHERE request_id = $2
    `, [rejectionReason, reqId]
  )
}

export async function approveReqQ(reqId) {
  await pool.query(
    `
    UPDATE requests
    SET status_id = 3, approved_at = CURRENT_TIMESTAMP
    WHERE request_id = $1
    `, [reqId]
  )
}