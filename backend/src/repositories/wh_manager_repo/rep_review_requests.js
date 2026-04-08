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
                      'warehouseStock', i.current_stock
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
                'orgName', h.name,
                'location', z.zone_name || ', ' || (SELECT name FROM cfg_counties WHERE id = z.county_id), 
                'createdAt', TO_CHAR(r.created_at, 'Mon DD, HH12:MI AM'),
                'totalAmount', (SELECT SUM(quantity_requested * unit_price_at_request) 
                                FROM request_items 
                                WHERE request_id = r.request_id),
                'items', COALESCE(rid.items_list, '[]'::jsonb)
            ) AS request_payload
        FROM requests r
        JOIN hospitals h ON r.hospital_id = h.hospital_id 
        JOIN cfg_zones z ON h.zone_id = z.id
        LEFT JOIN request_items_details rid ON r.request_id = rid.request_id
      );
    `
  )

  return rows[0]
}