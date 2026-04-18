import pool from "../../config/db.js";

export async function getCompletedOrdersQ() {
  const { rows } = await pool.query(
    `
    SELECT 
    jsonb_object_agg(
        'ORD-' || o.order_id, 
        jsonb_build_object(
            'customerName', h.name,
            'creationDate', TO_CHAR(o.created_at, 'YYYY-MM-DD'),
            'totalOrderItems', (
                SELECT SUM(ri.quantity_requested)::TEXT
                FROM order_packages op
                JOIN package_items pi ON op.package_id = pi.package_id
                JOIN request_items ri ON pi.request_item_id = ri.request_item_id
                WHERE op.order_id = o.order_id
            ),
            'completionDate', (
				SELECT TO_CHAR(MAX(d.delivered_at), 'YYYY-MM-DD')
				FROM order_packages op 
				JOIN deliveries d ON op.package_id = d.package_id
				WHERE op.order_id = o.order_id AND op.status_id = 10 AND d.inspected = 'yes' 
					AND NOT EXISTS (SELECT 1 FROM delivery_issues WHERE delivery_id = d.delivery_id)
            ),
            'packages', (
                SELECT jsonb_agg(DISTINCT op.storage_temp_code)
                FROM order_packages op
                WHERE op.order_id = o.order_id
            )
        )
    ) AS completed_orders
    FROM orders o
    JOIN requests r ON o.request_id = r.request_id
    JOIN hospitals h ON r.hospital_id = h.hospital_id
    WHERE EXISTS (
        SELECT 1 
        FROM order_packages op 
      JOIN deliveries d ON op.package_id = d.package_id
        WHERE op.order_id = o.order_id AND op.status_id = 10 AND d.inspected = 'yes' 
        AND NOT EXISTS (SELECT 1 FROM delivery_issues WHERE delivery_id = d.delivery_id)
    );
    `
  )

  return rows[0]
}