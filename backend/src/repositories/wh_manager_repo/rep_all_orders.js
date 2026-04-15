import pool from "../../config/db.js";

export async function getOrdersDataQ() {
  const { rows } = await pool.query(
    `
    SELECT jsonb_agg(jsonb_build_object(
          'orderId', 'ORD-' || o.order_id,
          'institutionName', h.name,
          'destination', (SELECT z.zone_name || ', ' || c.name 
                          FROM cfg_zones z 
                          JOIN cfg_counties c ON z.county_id = c.id 
                          WHERE z.id = h.zone_id),
          'creationDate', TO_CHAR(r.created_at, 'YYYY-MM-DD'),
          'paymentDate', TO_CHAR(o.created_at, 'YYYY-MM-DD'),
          'delivered', CASE WHEN EXISTS (SELECT 1 FROM order_packages op 
                        WHERE op.order_id = o.order_id 
                        AND op.status_id != 10) 
                    THEN 'No' ELSE 'Yes' END,
          'packages', (
              SELECT jsonb_agg(
                  jsonb_build_object(
                      'packageId', 'PKG' || '-' || op.package_id || '-' || op.storage_temp_code,
                      'itemCount', (SELECT SUM(quantity_requested) 
                                    FROM package_items pi 
                                    JOIN request_items ri ON pi.request_item_id = ri.request_item_id 
                                    WHERE pi.package_id = op.package_id),

                      'processing', CASE WHEN op.status_id > 3 THEN 'Yes' ELSE 'No' END,
                      
                      'ready', CASE WHEN op.status_id > 4 THEN 'Yes' ELSE 'No' END,
                      
                      'inTransit', CASE WHEN EXISTS (
                          SELECT 1 FROM deliveries d WHERE d.package_id = op.package_id
                      ) THEN 'Yes' ELSE 'No' END,
                      
                      'completed', CASE WHEN EXISTS (
                          SELECT 1 FROM deliveries d 
                          WHERE d.package_id = op.package_id 
                          AND d.inspected = 'yes' 
                          AND d.delivery_id NOT IN (SELECT delivery_id FROM delivery_issues)
                      ) THEN 'Yes' ELSE 'No' END
                  )
              )
              FROM order_packages op
              WHERE op.order_id = o.order_id
          )
      )) AS order_summary
      FROM orders o
      JOIN requests r ON o.request_id = r.request_id
      JOIN hospitals h ON r.hospital_id = h.hospital_id;
    `
  )

  return rows[0]
}