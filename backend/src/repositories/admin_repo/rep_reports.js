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