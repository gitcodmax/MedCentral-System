import pool from "../../config/db.js";

export async function getOrdReqQ(){
  const {rows} = await pool.query(`
    SELECT json_agg(result_json) AS ordersRequests FROM
    (SELECT json_build_object(
      'requestId', 'REQ-' || r.request_id,
      'orderId', 'ORD-' || o.order_id,
      'hospitalName', h.name,
      'requestDate', r.created_at::date,
      'paymentDate', r.paid_at::date, -- Assuming payment is confirmed via request status or separate column
      'totalItems', (SELECT COUNT(*) FROM request_items ri WHERE ri.request_id = r.request_id),
      'isRejected', (CASE WHEN r.status_id = 2 THEN true ELSE false END),
      'packages', (
          SELECT json_agg(
              json_build_object(
                  'packageId', 'PKG-' || o.order_id || '-' || op.storage_temp_code,
                  'storageCode', op.storage_temp_code,
                  'status', s.status_name,
                  'assignedClerk', u.full_name,
                  'assignedDriver', d.full_name,
                  'items', (
                      SELECT json_agg(
                          json_build_object(
                              'name', i.name,
                              'qty', ri_inner.quantity_requested,
                              'uom', i.selling_uom_id
                          )
                      )
                      FROM package_items pi
                      JOIN request_items ri_inner ON pi.request_item_id = ri_inner.request_item_id
                      JOIN items i ON ri_inner.item_id = i.item_id
                      WHERE pi.package_id = op.package_id
                  )
              )
          )
          FROM order_packages op
          JOIN cfg_statuses s ON op.status_id = s.id
          LEFT JOIN users u ON op.assigned_clerk_id = u.user_id
          LEFT JOIN drivers d ON op.assigned_driver_id = d.driver_id
          WHERE op.order_id = o.order_id
      )
  ) AS result_json
  FROM requests r
  JOIN hospitals h ON r.hospital_id = h.hospital_id
  JOIN orders o ON r.request_id = o.request_id)
  `)

  return rows[0]
}