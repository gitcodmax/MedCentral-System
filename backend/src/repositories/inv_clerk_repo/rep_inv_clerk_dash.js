import pool from "../../config/db.js"; 

export async function getKpiTblsDataQ(clerkId) {
  const { rows } = await pool.query(
    `
    WITH kpi_data AS (
    SELECT 
        jsonb_build_object(
            'awaiting_packing', COUNT(*) FILTER (WHERE op.status_id = 4),
            'active_in_transit', COUNT(*) FILTER (WHERE op.status_id = 6)
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
                    'destination', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
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
        WHERE op.status_id = 5 AND op.assigned_clerk_id = $1 AND op.assigned_driver_id IS NOT NULL
    ),
    monitoring_data AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'delivery_id', 'DLV-' || dl.delivery_id,
                    'package_id', 'PKG' || '-' || op.package_id,
                    'destination', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
                    'driver', d.full_name,
                    'driver_phone', d.phone_number,
                    'vehicle_plate', v.plate_number,
                    'dispatch_date', TO_CHAR(dl.dispatched_at, 'YYYY-MM-DD'),
                    'status', CASE 
                                WHEN op.status_id = 7 THEN 'Delayed'
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
    `, [clerkId]
  )

  return rows[0]
}

export async function getOrdersDataQ(clerkId) {
  const { rows } = await pool.query(
    `
    SELECT jsonb_agg(
        jsonb_build_object(
            'orderId', 'ORD-' || o.order_id,
            'customerName', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
            'orderCreatedDate', TO_CHAR(o.created_at, 'YYYY-MM-DD'),
            'packages', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'packageId', 'PKG-' || op.package_id,
                        'storageRequirement', cso_pkg.description,
                        'items', (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'itemName', i.name,
                                    'sku', i.sku_code,
                                    'shelfId', cws.shelf_label,
                                    'storageTemp', cso_item.description,
                                    'batchNumber', 'A0OWE',
                                    'quantityToPack', ri.quantity_requested,
                                    'unitOfMeasure', uom.name
                                )
                            )
                            FROM package_items pi 
                            JOIN request_items ri ON pi.request_item_id = ri.request_item_id 
                            JOIN items i ON ri.item_id = i.item_id
                            JOIN cfg_storage_options cso_item ON i.storage_temp_code = cso_item.code
                            JOIN cfg_uoms uom ON i.bulk_uom_id = uom.id
                            JOIN cfg_warehouse_shelves cws ON i.shelf_id = cws.shelf_id
                            WHERE pi.package_id = op.package_id
                        )
                    )
                )
                FROM order_packages op
                JOIN cfg_storage_options cso_pkg ON op.storage_temp_code = cso_pkg.code
                WHERE op.order_id = o.order_id
                  AND op.status_id = 4 
                  AND op.assigned_clerk_id = $1
            )
        )
    ) AS orders_data
    FROM orders o
    JOIN requests r ON o.request_id = r.request_id
    JOIN hospitals h ON r.hospital_id = h.hospital_id 
    WHERE EXISTS (
      SELECT 1 
      FROM order_packages op 
      WHERE op.order_id = o.order_id
        AND op.status_id = 4 
        AND op.assigned_clerk_id = $1
    )
    `, [clerkId]
  )

  return rows[0]
}

// UPDATES
export async function packedOrderPkgsQ({ packageId, packageWeight }) {
  await pool.query(
    `
    UPDATE order_packages 
    SET status_id = 5, weight_tonnes = $1 
    WHERE package_id = $2
    `, [packageWeight, packageId]
  )
}

export async function dispatchOrderPkgsQ(pkgId) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const updatePkgStatus = await client.query(
      `
      UPDATE order_packages 
      SET status_id = 6 
      WHERE package_id = $1
      RETURNING package_id 
      `, [pkgId]
    )

    const retPkgId = updatePkgStatus.rows[0].package_id
    if (!retPkgId) throw new Error('Package status not updated!')
    
    const insertDeliveries = await client.query(
      `
      INSERT INTO deliveries (package_id, dispatched_at) 
      VALUES ($1, CURRENT_TIMESTAMP) 
      RETURNING delivery_id
      `, [pkgId]
    )

    const retDeliveryId = insertDeliveries.rows[0].delivery_id
    if (!retDeliveryId) throw new Error('Delivery record not created!')
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function delayOrderPkgsQ(pkgId) {
  await pool.query(
    `
    UPDATE order_packages 
    SET status_id = 7 
    WHERE package_id = $1
    `, [pkgId]
  )
}

export async function fixDelayPkgQ(pkgId) {
  await pool.query(
    `
    UPDATE order_packages 
    SET status_id = 6 
    WHERE package_id = $1
    `,[pkgId]
  )
}

export async function deliveredOrderPkgsQ(pkgId) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const updateStatus = await client.query(
      `
      UPDATE order_packages 
      SET status_id = 8 
      WHERE package_id = $1
      RETURNING package_id
      `, [pkgId]
    )

    const packageId = updateStatus.rows[0].package_id
    if (!packageId) throw new Error('Package Status not updated!')
    
    const deliveryTime = await client.query(
      `
      UPDATE deliveries
      SET delivered_at = CURRENT_TIMESTAMP
      WHERE package_id = $1 
      RETURNING delivery_id
      `, [pkgId]
    )

    const deliveryId = deliveryTime.rows[0].delivery_id
    if (!deliveryId) throw new Error('Delivery Time not set!!')
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}