import pool from "../../config/db.js";

export async function getPackagesDriversDataQ() {
  const { rows } = await pool.query(
    `
    WITH driver_payload AS (
    SELECT 
        jsonb_agg(
            jsonb_build_object(
                'driverId', d.driver_id,
                'name', d.full_name,
                'homeCounty', (SELECT c.name 
									FROM cfg_zones z 
									JOIN cfg_counties c ON z.county_id = c.id 
									WHERE d.preferred_zone_id = z.id), 
                'primaryZone', (SELECT zone_name FROM cfg_zones WHERE id = d.preferred_zone_id),
                'vehicle', jsonb_build_object(
                    'type', vt.display_name,
                    'category', vc.name,
                    'maxTons', v.max_tons,
                    'currentLoad', v.current_load_tons,
                    'tempCaps', (
                        SELECT jsonb_agg(LOWER(s.description)) 
                        FROM cfg_storage_options s 
                        WHERE s.code = ANY(v.temp_cap_codes)
                    )
                )
            )
        ) AS driver_list
    FROM vehicle_assignments va
    JOIN drivers d ON va.driver_id = d.driver_id
    JOIN vehicles v ON va.vehicle_id = v.vehicle_id
    JOIN cfg_vehicle_types vt ON v.type_code = vt.type_code
    JOIN cfg_vehicle_categories vc ON v.category_id = vc.category_id
    ),
    dispatch_payload AS (
        SELECT 
            jsonb_agg(
                jsonb_build_object(
                    'orderId', 'ORD-' || o.order_id,
                    'institutionName', h.name,
                    'subCounty', (SELECT zone_name FROM cfg_zones WHERE id = h.zone_id),
                    'county', (SELECT c.name 
                      FROM cfg_zones z 
                      JOIN cfg_counties c ON z.county_id = c.id 
                      WHERE h.zone_id = z.id),
                    'packages', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'packageId', 'PKG' || '-' || op.package_id || '-' || op.storage_temp_code,
                                'storageTemp', LOWER(cso.description),
                                'weightTonnes', op.weight_tonnes,
                                'items', (
                                    SELECT jsonb_agg(
                                        jsonb_build_object(
                                            'itemName', i.name,
                                            'qty', (ri.quantity_requested || ' ' || uom.name)
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
                        JOIN cfg_storage_options cso ON op.storage_temp_code = cso.code
                        WHERE op.order_id = o.order_id 
                          AND op.status_id = 5
                          AND op.assigned_driver_id IS NULL
                    )
                )
            ) AS queue_list
        FROM orders o
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        WHERE EXISTS (
            SELECT 1 FROM order_packages op
            WHERE op.order_id = o.order_id
              AND op.status_id = 5
              AND op.assigned_driver_id IS NULL
        )
    )

    SELECT 
        jsonb_build_object(
            'dispatchQueue', COALESCE(dp.queue_list, '[]'::jsonb),
            'drivers', COALESCE(dr.driver_list, '[]'::jsonb)
        ) AS packages_drivers_data
    FROM dispatch_payload dp, driver_payload dr;
    `
  )

  return rows[0]
}

export async function assignPackageDriverQ({drivId, packId}) {
  await pool.query(
    `
    UPDATE order_packages
    SET assigned_driver_id = $1, assigned_at = CURRENT_TIMESTAMP
    WHERE package_id = $2
    `, [drivId, packId]
  )
}