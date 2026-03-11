import pool from "../../config/db.js";

export async function invReportDataQ(){
  const {rows} = await pool.query(
    `
      WITH category_data AS (
          SELECT 
              c.name AS category_name, 
              SUM(i.current_stock) AS total_stock
          FROM items i
          JOIN cfg_item_categories c ON i.category_id = c.id
          GROUP BY c.name
      ),stock_status_data AS (
        SELECT COUNT(current_stock) AS stock_count, 
        (CASE WHEN current_stock = 0 THEN 'Out of Stock' 
            WHEN current_stock <= min_stock_level THEN 'Low' 
            WHEN current_stock > min_stock_level THEN 'Healthy' END) AS status FROM items 
        GROUP BY status
      )

      SELECT jsonb_build_object(
          'kpi_metrics', (
              SELECT jsonb_build_object(
                  'total_unique_items', COUNT(item_id),
                  'total_stock_units', SUM(current_stock),
                  'total_inventory_value', ROUND(SUM(current_stock * price_per_selling)::numeric, 2),
                  'low_stock_alerts', COUNT(CASE WHEN current_stock < min_stock_level THEN 1 END)
              ) FROM items
          ), 
          'inventory_table', (
              SELECT json_agg(
                  jsonb_build_object(
                      'item_name', i.name, 
                      'category', c.name, 
                      'storage_temp', i.storage_temp_code, 
                      'current_stock', i.current_stock, 
                      'min_level', i.min_stock_level,
                      'stock_status', (CASE 
                          WHEN i.current_stock = 0 THEN 'Out of Stock' 
                          WHEN i.current_stock <= i.min_stock_level THEN 'Low' 
                          ELSE 'Healthy' 
                      END),
                      'unit_price', i.price_per_selling, 
                      'total_value', (i.current_stock * i.price_per_selling)
                  )
              )
              FROM items i
              JOIN cfg_item_categories c ON i.category_id = c.id
          ), 
          'category_distribution_bar_chart', (
              SELECT json_agg(
                  jsonb_build_object(
                      'category', category_name, 
                      'current_stock', total_stock
                  )
              )
              FROM category_data
          ), 
        'stock_status_pie_chart', (
          SELECT json_agg(
            jsonb_build_object(
              'status', status, 
              'count', stock_count
            )
          )
          FROM stock_status_data
        )
      ) AS inv_report_data;
    `
  )

  return rows[0]
}

export async function lowStockReportDataQ(){
  const {rows} = await pool.query(`
    SELECT jsonb_build_object(
      'kpi_metrics', (
          SELECT jsonb_build_object(
              'out_of_stock_items', COUNT(CASE WHEN current_stock = 0 THEN 1 END),
              'total_low_stock_items', COUNT(CASE WHEN current_stock > 0 AND current_stock <= min_stock_level THEN 1 END),
              'affected_categories', COUNT(DISTINCT CASE WHEN current_stock <= min_stock_level THEN category_id END)
          ) 
          FROM items
      ),

      'inventory_table', (
          SELECT json_agg(
              jsonb_build_object(
                  'item_name', i.name,
                  'category', c.name,
                  'current_stock', i.current_stock,
                  'min_level', i.min_stock_level,
                  'deficit', (i.current_stock - i.min_stock_level),
                  'last_restocked', i.last_restocked,
                  'stock_status', (
                      CASE 
                          WHEN i.current_stock = 0 THEN 'Out of Stock'
                          WHEN i.current_stock <= i.min_stock_level THEN 'Low Stock'
                          ELSE 'Healthy'
                      END
                  )
              )
          )
          FROM items i
          JOIN cfg_item_categories c ON i.category_id = c.id
      ),

      'low_stock_by_category_bar_chart', (
          SELECT json_agg(
              jsonb_build_object(
                  'category', category_summary.name,
                  'low_stock_count', category_summary.low_count
              )
          )
          FROM (
              SELECT c.name, COUNT(i.item_id) as low_count
              FROM cfg_item_categories c
              JOIN items i ON c.id = i.category_id
              WHERE i.current_stock <= i.min_stock_level
              GROUP BY c.name
              ORDER BY low_count DESC
          ) AS category_summary
      )
  ) AS low_stock_data;
  `)

  return rows[0]
}

export async function distroReportDataQ(){
  const {rows} = await pool.query(`
    WITH kpi_data AS (
        SELECT 
            COUNT(d.delivery_id) AS total_deliveries,
            COUNT(CASE WHEN p.status_id IN (8, 9, 10) THEN 1 END) AS delivered_count,
            COUNT(CASE WHEN p.status_id = 10 THEN 1 END) AS completed_count,
            COUNT(CASE WHEN p.status_id = 7 THEN 1 END) AS delayed_deliveries
        FROM deliveries d
        JOIN order_packages p ON d.package_id = p.package_id
    ),
    table_data AS (
        SELECT 
            'DLV-' || d.delivery_id AS delivery_id,
            'PKG-' || d.package_id || '-' || (
          SELECT op.storage_temp_code 
          FROM package_items pi 
          JOIN order_packages op ON pi.package_id = op.package_id 
          WHERE pi.package_id = d.package_id
          LIMIT 1
        ) AS package_id,
            'ORD-' || p.order_id AS order_id,
            d.dispatched_at AS dispatch_date,
            h.name AS destination,
            u.full_name AS driver,
            (SELECT SUM(ri.quantity_requested) 
            FROM package_items pi
            JOIN request_items ri ON pi.request_item_id = ri.request_item_id
            WHERE pi.package_id = d.package_id) AS total_units,
            s.status_name AS status,
            d.delivered_at AS delivery_date
        FROM deliveries d
        JOIN order_packages p ON d.package_id = p.package_id
        JOIN orders o ON p.order_id = o.order_id
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        LEFT JOIN drivers u ON p.assigned_driver_id = u.driver_id
        JOIN cfg_statuses s ON p.status_id = s.id
    ),
    time_chart AS (
        SELECT 
            delivered_at::DATE AS date,
            COUNT(delivery_id) AS deliveries
        FROM deliveries
        WHERE delivered_at IS NOT NULL
        GROUP BY delivered_at::DATE
        ORDER BY date DESC
    ),
    dist_chart AS (
        SELECT 
            h.name AS destination,
            COUNT(d.delivery_id) AS count
        FROM deliveries d
        JOIN order_packages p ON d.package_id = p.package_id
        JOIN orders o ON p.order_id = o.order_id
        JOIN requests r ON o.request_id = r.request_id
        JOIN hospitals h ON r.hospital_id = h.hospital_id
        GROUP BY h.name
        ORDER BY count DESC
    )
    SELECT jsonb_build_object(
        'kpi_metrics', (SELECT row_to_json(kpi_data) FROM kpi_data),
        'deliveries_table', (SELECT json_agg(table_data) FROM table_data),
        'volume_over_time_line_chart', (SELECT json_agg(time_chart) FROM time_chart),
        'destination_distribution_bar_chart', (SELECT json_agg(dist_chart) FROM dist_chart)
    ) AS distro_report;
  `)

  return rows[0]
}