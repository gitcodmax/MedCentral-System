import pool from "../../config/db.js";

export async function getOrderPackagesQ() {
  const { rows } = await pool.query(
    `
    WITH warehouse_clerks AS (
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'clerkId', user_id,
                'name', full_name,
                'activeTasks', COALESCE(
                    (SELECT COUNT(*) FROM order_packages 
                        WHERE assigned_clerk_id = user_id AND status_id < 5), 0)
            )
        ) AS clerk_list
    FROM users 
    WHERE role_id = 1
    ),
    orders_payload AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'orderId', 'ORD' || '-' || o.order_id,
                    'institutionName', h.name,
                    'paymentDate', TO_CHAR(o.created_at, 'Mon DD, HH:MI AM'),
                    'packages', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'packageId', 'PKG' || '-' || op.package_id || '-' || op.storage_temp_code,
                                'items', (
                                    SELECT jsonb_agg(
                                        jsonb_build_object(
                                            'name', i.name,
                                            'location', i.shelf_id,
                                            'batchNo', 'AO0976',
                                            'quantity', (ri.quantity_requested || ' ' || uom.name)
                                        )
                                    )
                                    FROM package_items pi
                                    JOIN request_items ri ON pi.request_item_id = ri.request_item_id
                                    JOIN items i ON ri.item_id = i.item_id
                                    JOIN cfg_uoms uom ON i.selling_uom_id = uom.id
                                    WHERE pi.package_id = op.package_id
                                )
                            )
                        )
                        FROM order_packages op
                        WHERE op.order_id = o.order_id 
                            AND op.status_id = 4 AND op.assigned_clerk_id IS NULL
                    )
                )
            ) AS order_list
        FROM orders o
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        WHERE EXISTS (
            SELECT 1 
            FROM order_packages op 
            WHERE op.order_id = o.order_id 
              AND op.status_id = 4
        )
    )

    SELECT 
        jsonb_build_object(
            'paidOrders', COALESCE(op.order_list, '[]'::jsonb),
            'clerks', COALESCE(wc.clerk_list, '[]'::jsonb)
        ) AS orders_clerk_data
    FROM warehouse_clerks wc, orders_payload op;
    `
  )

  return rows[0]
}

export async function assignClerkQ({ pkgId, clerkId }) {
  await pool.query(
    `
    UPDATE order_packages
    SET assigned_clerk_id = $1
    WHERE package_id = $2
    `, [clerkId, pkgId]
  )
}