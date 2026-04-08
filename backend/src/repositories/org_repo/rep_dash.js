import pool from "../../config/db.js";

export async function getOrgDashDataQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH order_base AS (
    SELECT 
        o.order_id,
        o.created_at,
        ds.status_name,
        op.status_id
    FROM orders o
    JOIN requests r ON o.request_id = r.request_id
    JOIN order_packages op ON o.order_id = op.order_id
    JOIN cfg_statuses ds ON op.status_id = ds.id
    WHERE r.hospital_id = $1
    ),
    metrics_cte AS (
        SELECT 
            COUNT(DISTINCT order_id) AS total_orders,
            COUNT(DISTINCT order_id) FILTER (WHERE status_name = 'Pending') AS pending,
            COUNT(DISTINCT order_id) FILTER (WHERE status_name = 'Dispatched') AS in_transit,
            COUNT(DISTINCT order_id) FILTER (WHERE status_name = 'Completed') AS delivered
        FROM order_base
    ),
    distro_cte AS (
        SELECT jsonb_build_array(
            COUNT(DISTINCT order_id) FILTER (WHERE status_name = 'Rejected'), 
            COUNT(DISTINCT order_id) FILTER (WHERE status_id > 2), 
            COUNT(DISTINCT order_id) FILTER (WHERE status_name = 'Completed')
        ) AS distro_array
        FROM order_base
    ),
    recent_orders_cte AS (
        SELECT jsonb_agg(recent_row) AS recent_list
        FROM (
            SELECT 
                order_id AS "orderId",
                to_char(created_at, 'Mon DD, HH12:MI AM') AS "creationDate",
                status_name AS status
            FROM order_base
            ORDER BY created_at DESC
            LIMIT 5
        ) recent_row
    )

    SELECT jsonb_build_object(
        'metrics', (SELECT row_to_json(metrics_cte) FROM metrics_cte),
        'ordersStatusDistroData', (SELECT distro_array FROM distro_cte),
        'recentOrders', (SELECT COALESCE(recent_list, '[]'::jsonb) FROM recent_orders_cte)
    ) AS dashboard_data;
    `, [hosId]
  )

  return rows[0]
}