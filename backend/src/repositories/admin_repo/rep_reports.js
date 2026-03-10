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