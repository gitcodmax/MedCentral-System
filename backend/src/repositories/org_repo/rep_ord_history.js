import pool from "../../config/db.js";

export async function getAllRequestsInfoQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH package_contents_cte AS (
    -- Aggregate items within each package
    SELECT 
        pi.package_id,
        jsonb_agg(
            jsonb_build_object(
                'name', i.name,
                'quantity', ri.quantity_requested,
                'uom', LOWER(u.name)
            )
        ) AS items_array
    FROM package_items pi
    JOIN request_items ri ON pi.request_item_id = ri.request_item_id
    JOIN items i ON ri.item_id = i.item_id
    JOIN cfg_uoms u ON i.selling_uom_id = u.id
    GROUP BY pi.package_id
    ),
    order_packages_cte AS (
        -- Aggregate packages within each order
        SELECT 
            op.order_id,
            jsonb_agg(
                jsonb_build_object(
                    'packageId', 'PKG' || '-' || op.package_id || '-' || st.code,
                    'storageTemp', LOWER(st.description),
                    'status', LOWER(ds.status_name),
                    'items', COALESCE(pc.items_array, '[]'::jsonb)
                )
            ) AS packages_array
        FROM order_packages op
        JOIN cfg_storage_options st ON op.storage_temp_code = st.code
        JOIN cfg_statuses ds ON op.status_id = ds.id
        LEFT JOIN package_contents_cte pc ON op.package_id = pc.package_id
        GROUP BY op.order_id
    )

    SELECT jsonb_agg(final_request_payload) AS hosRequests
    FROM (
    SELECT 
        jsonb_build_object(
            'requestId', 'REQ' || '-' || r.request_id,
            'orderId', 'ORD' || '-' || COALESCE(o.order_id),
            'dateInitiated', to_char(r.created_at, 'Mon DD, YYYY'),
            'paymentDate', COALESCE(to_char(o.created_at, 'Mon DD, YYYY')),
            'deliveryDate', COALESCE((SELECT to_char(MAX(delivered_at), 'Mon DD, YYYY') 
                            FROM deliveries d 
                            JOIN order_packages op2 ON d.package_id = op2.package_id 
                            WHERE op2.order_id = o.order_id)),
            'totalValue', r.total_estimated_value,
            'packages', COALESCE(op_cte.packages_array, '[]'::jsonb)
        ) AS final_request_payload
    FROM requests r
    LEFT JOIN orders o ON r.request_id = o.request_id
    LEFT JOIN order_packages_cte op_cte ON o.order_id = op_cte.order_id
    WHERE r.hospital_id = $1
    );
    `, [hosId]
  )

  return rows[0]
}