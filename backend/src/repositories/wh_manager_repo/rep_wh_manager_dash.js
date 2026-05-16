import pool from "../../config/db.js";

export async function getWhManagerDashDataQ() {
  const { rows } = await pool.query(
    `
    SELECT jsonb_build_object(
      'summaryStats', (SELECT jsonb_build_object(
              'totalPendingReview', (SELECT COUNT(*) FROM requests WHERE status_id = 1),
              'totalToAssignClerk', (SELECT COUNT(*) FROM order_packages WHERE status_id = 4 AND assigned_clerk_id IS NULL),
              'totalToAssignDriver', (SELECT COUNT(*) FROM order_packages WHERE status_id = 5 AND assigned_driver_id IS NULL)
              )  AS summary_stats), 
      'inventory', (SELECT 
              jsonb_object_agg(
                sku_code, jsonb_build_object(
                  'itemDetails', name || '(' || current_stock || ' ' || bulk_uom || ')', 
                  'stockLevel', stock_level
                )
              ) AS inventory
              FROM (
                SELECT name, sku_code, current_stock,  
                (SELECT name FROM cfg_item_categories WHERE id = bulk_uom_id) AS bulk_uom,
                (CASE 
                  WHEN current_stock < ROUND(0.25 * min_stock_level) THEN 'critical'
                  WHEN current_stock < ROUND(0.6 * min_stock_level) THEN 'warning'
                  WHEN current_stock < min_stock_level THEN 'low' 
                END) AS stock_level
                FROM items 
              )t 
              WHERE stock_level IS NOT NULL ),
      'recentlyDeliveredOrders', (SELECT 
                      jsonb_agg(
                        jsonb_build_object(
                          'orderId', 'ORD' || '-' || op.order_id,
                          'hospitalName', (SELECT full_name FROM users WHERE hospital_id = r.hospital_id),
                          'creationDate', TO_CHAR(o.created_at, 'Mon DD, YYYY'),
                          'deliveredOn', TO_CHAR(d.delivered_at, 'Mon DD, YYYY')
                        )
                      ) AS recently_delivered_orders
                      FROM deliveries d 
                      JOIN order_packages op ON d.package_id = op.package_id 
                      JOIN orders o ON op.order_id = o.order_id 
                      JOIN requests r ON o.request_id = r.request_id 
                      LIMIT 5)
              
    ) AS wh_dash_data
    `
  )

  return rows[0]
}