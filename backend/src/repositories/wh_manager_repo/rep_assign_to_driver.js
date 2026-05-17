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
                    'institutionName', (SELECT full_name FROM users WHERE hospital_id = h.hospital_id),
                    'zoneId', h.zone_id,
                    'countyId', (SELECT c.id 
                      FROM cfg_zones z 
                      JOIN cfg_counties c ON z.county_id = c.id 
                      WHERE h.zone_id = z.id),
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

// Update driver id in order packages and 
// current vehicle load in vehicles table
export async function assignPackageDriverQ({ drivId, packId }) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const upOrdPkgs = await client.query(
      `
      UPDATE order_packages
      SET assigned_driver_id = $1, assigned_at = CURRENT_TIMESTAMP
      WHERE package_id = $2 RETURNING assigned_driver_id
      `, [drivId, packId]
    )

    const drvId = upOrdPkgs.rows[0].assigned_driver_id
    if (!drvId) throw new Error('Order packages not updated!')
    
    const upVehicles = await client.query(
      `
      WITH weight_to_add AS (
        SELECT weight_tonnes 
        FROM order_packages 
        WHERE package_id = $1
      )

      UPDATE vehicles 
      SET current_load_tons = current_load_tons + (SELECT weight_tonnes FROM weight_to_add)
      WHERE vehicle_id = (SELECT va.vehicle_id
      FROM vehicle_assignments va
      JOIN drivers d ON va.driver_id = d.driver_id
      JOIN vehicles v ON va.vehicle_id = v.vehicle_id
      WHERE d.driver_id = $2)
      RETURNING vehicle_id
      `, [packId, drvId]
    )

    const vehId = upVehicles.rows[0].vehicle_id
    if (!vehId) throw new Error(`Vehicle's current load not updated!`)
    
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}