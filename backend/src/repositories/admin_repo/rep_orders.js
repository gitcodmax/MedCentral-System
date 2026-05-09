import pool from "../../config/db.js";

// Get admin dash data
export async function getAdminDashDataQ(){
  const {rows} = await pool.query(`
    WITH kpi_stats AS (
        SELECT 
            (SELECT COUNT(hospital_id) FROM hospitals) AS total_hospitals,
            (SELECT COUNT(item_id) FROM items) AS total_inventory_items,
            (SELECT COUNT(item_id) FROM items WHERE current_stock <= min_stock_level) AS low_stock_items,
            (SELECT COUNT(request_id) FROM requests WHERE status_id = 1) AS pending_orders,
            (SELECT COUNT(package_id) FROM order_packages WHERE status_id = 6) AS packages_in_transit,
            (SELECT COUNT(DISTINCT order_id) 
            FROM order_packages op1 
            WHERE NOT EXISTS (
                SELECT 1 FROM order_packages op2 
                WHERE op2.order_id = op1.order_id 
                AND op2.status_id != 10
            )) AS completed_orders
    ),
    recent_orders_list AS (
        SELECT 
            'ORD-' || o.order_id AS order_id,
            h.name AS hospital_name,
            TO_CHAR(o.created_at, 'YYYY-MM-DD') AS order_date
        FROM orders o
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        ORDER BY o.created_at DESC
        LIMIT 5
    ),
    low_stock_list AS (
        SELECT 
            i.name AS item_name,
            i.current_stock,
            i.min_stock_level AS min_required,
            u.name AS unit
        FROM items i
        JOIN cfg_uoms u ON i.bulk_uom_id = u.id
        WHERE i.current_stock <= i.min_stock_level
        ORDER BY i.current_stock ASC
    )
    SELECT jsonb_build_object(
        'stats', (SELECT row_to_json(kpi_stats) FROM kpi_stats),
        'recentOrders', (SELECT json_agg(recent_orders_list) FROM recent_orders_list),
        'lowStockAlerts', (SELECT json_agg(low_stock_list) FROM low_stock_list)
    ) AS admin_dash_data;
  `)

  return rows[0]
}

// Get orders page data
export async function getOrdReqQ(){
  const {rows} = await pool.query(`
    SELECT json_agg(result_json) AS ordersRequests FROM
    (SELECT json_build_object(
      'requestId', 'REQ-' || r.request_id,
      'orderId', 'ORD-' || o.order_id,
      'hospitalName', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
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