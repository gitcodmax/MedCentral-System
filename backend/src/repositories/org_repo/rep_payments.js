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