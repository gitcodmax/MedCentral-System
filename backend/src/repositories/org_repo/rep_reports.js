import pool from "../../config/db.js";

export async function getItemConsumptionReportDataQ(hosId) {
  const { rows } = await pool.query(
    `
      WITH summary_cte AS (
          SELECT 
              TO_CHAR(SUM(ri.quantity_requested), 'FM99,999') as total_items,
              COUNT(DISTINCT i.category_id)::text as total_categories,
              (SELECT name FROM items WHERE item_id = (
                  SELECT item_id FROM request_items 
                  GROUP BY item_id ORDER BY SUM(quantity_requested) DESC LIMIT 1
              )) as most_consumed,
              TO_CHAR(SUM(ri.quantity_requested) / 6, 'FM99,999') as avg_monthly
          FROM request_items ri
          JOIN items i ON ri.item_id = i.item_id
        LEFT JOIN requests r ON r.request_id = ri.request_id
          WHERE r.hospital_id = $1 
          AND r.created_at >= CURRENT_DATE - INTERVAL '6 months'
      ),
      trends_cte AS (
          SELECT 
              jsonb_agg(to_char(month_series, 'Mon YYYY') ORDER BY month_series) as labels,
              jsonb_agg(COALESCE(monthly_sum, 0) ORDER BY month_series) as values
          FROM generate_series(
              CURRENT_DATE - INTERVAL '5 months', 
              CURRENT_DATE, 
              '1 month'::interval
          ) month_series
          LEFT JOIN (
              SELECT date_trunc('month', r.created_at) as m, SUM(ri.quantity_requested) as monthly_sum
              FROM request_items ri
          LEFT JOIN requests r ON r.request_id = ri.request_id
          WHERE r.hospital_id = $1 
              GROUP BY 1
          ) actual_data ON date_trunc('month', month_series) = actual_data.m
      ),
      categories_cte AS (
          SELECT 
              jsonb_agg(category_name ORDER BY total_qty DESC) AS labels,
              jsonb_agg(total_qty ORDER BY total_qty DESC) AS values
          FROM (
              SELECT 
                  c.name AS category_name, 
                  COALESCE(SUM(ri.quantity_requested), 0) AS total_qty
              FROM request_items ri
              JOIN items i ON ri.item_id = i.item_id
              RIGHT JOIN cfg_item_categories c ON i.category_id = c.id 
          JOIN requests r on ri.request_id = r.request_id
          WHERE r.hospital_id = $1 
              GROUP BY c.name
              ORDER BY total_qty DESC
              LIMIT 10
          ) AS aggregated_categories
      ),
      table_data_cte AS (
          SELECT 
              jsonb_agg(
                  jsonb_build_object(
                      'name', item_name,
                      'cat', category_name,
                      'qty', total_qty,
                      'unit', uom_name,
                      'orders', total_orders,
                      'last', last_order_date
                  )
              ) as rows
          FROM (
              SELECT 
                  i.name AS item_name,
                  c.name AS category_name,
                  SUM(ri.quantity_requested) AS total_qty,
                  u.name AS uom_name,
                  COUNT(DISTINCT ri.request_id) AS total_orders,
                  TO_CHAR(MAX(r.created_at), 'Mon DD, YYYY') AS last_order_date
              FROM request_items ri
              JOIN items i ON ri.item_id = i.item_id
              JOIN cfg_item_categories c ON i.category_id = c.id
              JOIN cfg_uoms u ON i.selling_uom_id = u.id
          LEFT JOIN requests r ON r.request_id = ri.request_id 
          WHERE r.hospital_id = $1 
              GROUP BY i.name, c.name, u.name
              ORDER BY total_qty DESC
              LIMIT 7
          ) AS item_summaries
      )

      SELECT 
          jsonb_build_object(
              'summary', (SELECT jsonb_build_object(
                  'totalItems', total_items,
                  'totalCategories', total_categories,
                  'mostConsumed', most_consumed,
                  'avgMonthly', avg_monthly
              ) FROM summary_cte),
              'trends', (SELECT jsonb_build_object('labels', labels, 'values', values) FROM trends_cte),
              'categories', (SELECT jsonb_build_object(
                  'labels', labels,
                  'values', values
              ) FROM categories_cte),
              'tableData', (SELECT rows FROM table_data_cte)
          ) AS report_data;
    `, [hosId]
  )

  return rows[0]
}