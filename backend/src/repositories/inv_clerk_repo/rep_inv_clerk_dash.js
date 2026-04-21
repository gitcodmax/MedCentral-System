import pool from "../../config/db.js"; 

export async function getKpiTblsDataQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH kpi_data AS (
    SELECT 
        jsonb_build_object(
            'awaiting_packing', COUNT(*) FILTER (WHERE op.status_id = 4),
            'ready_for_dispatch', COUNT(*) FILTER (WHERE op.status_id = 5),
            'active_in_transit', COUNT(*) FILTER (WHERE op.status_id = 6),
            'reported_delays', (SELECT COUNT(*) FROM delivery_issues),
            'delivered_today', (SELECT COUNT(*) FROM deliveries WHERE delivered_at::DATE = CURRENT_DATE)
        ) AS metrics
    FROM order_packages op 
      WHERE op.assigned_clerk_id = $1
    ),
    queue_data AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'package_id', 'PKG' || '-' || op.package_id,
                    'order_id', 'ORD-' || o.order_id,
                    'destination', h.name,
                    'driver_assigned', d.full_name,
                    'vehicle_plate', v.plate_number,
                    'storage_req', cso.description
                )
            ) AS queue_list
        FROM order_packages op
        JOIN orders o ON op.order_id = o.order_id 
      JOIN requests r ON o.request_id = r.request_id 
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        JOIN cfg_storage_options cso ON op.storage_temp_code = cso.code
        
        LEFT JOIN vehicle_assignments va ON op.assigned_driver_id = va.driver_id 
        LEFT JOIN drivers d ON va.driver_id = d.driver_id
        LEFT JOIN vehicles v ON va.vehicle_id = v.vehicle_id
        WHERE op.status_id = 5 AND op.assigned_clerk_id = $1
    ),
    monitoring_data AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'delivery_id', 'DLV-' || dl.delivery_id,
                    'package_id', 'PKG' || '-' || op.package_id,
                    'destination', h.name,
                    'driver', d.full_name,
                    'driver_phone', d.phone_number,
                    'vehicle_plate', v.plate_number,
                    'dispatch_date', TO_CHAR(dl.dispatched_at, 'YYYY-MM-DD'),
                    'status', CASE 
                                WHEN EXISTS (SELECT 1 FROM delivery_issues di WHERE di.delivery_id = dl.delivery_id) THEN 'Delayed'
                                ELSE 'Dispatched'
                              END
                )
            ) AS monitoring_list
        FROM deliveries dl
        JOIN order_packages op ON dl.package_id = op.package_id
        JOIN orders o ON op.order_id = o.order_id
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        JOIN drivers d ON op.assigned_driver_id = d.driver_id
        JOIN vehicle_assignments va ON d.assignment_id = va.assignment_id 
      JOIN vehicles v ON va.vehicle_id = v.vehicle_id
        WHERE op.status_id IN (6, 7) AND op.assigned_clerk_id = $1
    )

    SELECT 
        jsonb_build_object(
            'kpi_metrics', (SELECT metrics FROM kpi_data),
            'dispatch_queue', COALESCE((SELECT queue_list FROM queue_data), '[]'::jsonb),
            'in_transit_monitoring', COALESCE((SELECT monitoring_list FROM monitoring_data), '[]'::jsonb)
        ) AS kpi_tables_data;
    `, [hosId]
  )

  return rows[0]
}