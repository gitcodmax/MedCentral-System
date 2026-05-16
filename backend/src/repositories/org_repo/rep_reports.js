import pool from "../../config/db.js";

export async function getItemConsumptionReportDataQ({ hosId, startDate, endDate,
  itemCatId, deptId }) {
  const conditions = []
  const values = [hosId]
  let paramIndex = 2
  
  if (startDate && !endDate) {
    conditions.push(`r.created_at BETWEEN $${paramIndex++} AND CURRENT_TIMESTAMP`)
    values.push(startDate)
  }
  if (startDate && endDate) {
    conditions.push(`r.created_at BETWEEN $${paramIndex++} AND $${paramIndex++}`)
    values.push(startDate, [endDate, '23:59:00'].join(' '))
  }

  if (itemCatId !== 'all') {
    conditions.push(`c.id = $${paramIndex++}`)
    values.push(itemCatId)
  }

  if (deptId !== 'all') {
    conditions.push(`ri.department_id = $${paramIndex}`)
    values.push(deptId)
  }

  const addConditions = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : ''

  const { rows } = await pool.query(
    `
      WITH summary_cte AS (
          SELECT 
              TO_CHAR(SUM(ri.quantity_requested), 'FM99,999') as total_items,
              COUNT(DISTINCT i.category_id)::text as total_categories,
              (SELECT i.name
              FROM requests r
              JOIN request_items ri ON r.request_id = ri.request_id
              JOIN items i  ON ri.item_id = i.item_id
              JOIN cfg_item_categories c ON i.category_id = c.id
              WHERE r.hospital_id = $1
                ${addConditions}
              GROUP BY i.name
              ORDER BY MAX(ri.quantity_requested) DESC
              LIMIT 1) as most_consumed,
              TO_CHAR(SUM(ri.quantity_requested) / 6, 'FM99,999') as avg_monthly,
              (SELECT 
              name
              FROM(
                SELECT
                d.name, SUM(ri.quantity_requested) AS total_items_qty
                FROM requests r 
                JOIN request_items ri ON r.request_id = ri.request_id
                JOIN cfg_hospital_departments d ON ri.department_id = d.id
                WHERE hospital_id = $1
                GROUP BY d.name 
                ORDER BY total_items_qty DESC 
                LIMIT 1
              )r) AS dept_cons_name
          FROM request_items ri
          JOIN items i ON ri.item_id = i.item_id
          LEFT JOIN requests r ON r.request_id = ri.request_id
		      JOIN cfg_item_categories c ON i.category_id = c.id 
          WHERE r.hospital_id = $1
          ${addConditions}
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
		      JOIN items i ON ri.item_id = i.item_id
          JOIN cfg_item_categories c ON i.category_id = c.id
          WHERE r.hospital_id = $1 
          ${addConditions}
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
          ${addConditions}
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
          ${addConditions} 
              GROUP BY i.name, c.name, u.name
              ORDER BY total_qty DESC
              LIMIT 7
          ) AS item_summaries
      ), dept_cons_cte AS (
        SELECT 
        jsonb_agg(name ORDER BY total_items_qty) AS labels,
        jsonb_agg(total_items_qty ORDER BY total_items_qty) AS values 
        FROM(
          SELECT
          d.name, SUM(ri.quantity_requested) AS total_items_qty
          FROM requests r 
          JOIN request_items ri ON r.request_id = ri.request_id
          JOIN cfg_hospital_departments d ON ri.department_id = d.id 
          JOIN items i ON ri.item_id = i.item_id
                  JOIN cfg_item_categories c ON i.category_id = c.id
          WHERE hospital_id = $1 
          ${addConditions}
          GROUP BY d.name
        ) AS dept_cons
	  )

    SELECT 
      jsonb_build_object(
          'summary', (SELECT jsonb_build_object(
              'totalItems', total_items,
              'totalCategories', total_categories,
              'mostConsumed', most_consumed,
              'avgMonthly', avg_monthly,
              'deptConsName', dept_cons_name
          ) FROM summary_cte),
          'trends', (SELECT jsonb_build_object('labels', labels, 'values', values) FROM trends_cte),
          'categories', (SELECT jsonb_build_object(
              'labels', labels,
              'values', values
          ) FROM categories_cte),
          'tableData', (SELECT rows FROM table_data_cte), 
          'deptConsumption', (SELECT jsonb_build_object(
            'labels', labels, 
            'values', values
          ) FROM dept_cons_cte)
      ) AS report_data;
    `, values
  )

  return rows[0]
}

export async function getFinancialReportDataQ(hosId) {
  const { rows } = await pool.query(
    `
    WITH base_finance AS (
    SELECT 
        o.order_id,
        ri.item_id,
        i.name AS item_name,
        c.name AS category_name,
        ri.quantity_requested,
        ri.unit_price_at_request,
        (ri.quantity_requested * ri.unit_price_at_request) AS line_total,
        o.created_at AS finance_date
    FROM order_packages op
    JOIN orders o ON op.order_id = o.order_id
    JOIN requests r ON o.request_id = r.request_id
    JOIN request_items ri ON r.request_id = ri.request_id
    JOIN items i ON ri.item_id = i.item_id
    JOIN cfg_item_categories c ON i.category_id = c.id
    WHERE r.hospital_id = $1 
      AND op.status_id > 3 
    ),
    summary_metrics AS (
        SELECT 
            SUM(line_total) AS total_expenditure,
            ROUND(SUM(line_total) / 12.0, 2) AS avg_monthly_spend,
            (SELECT category_name FROM base_finance GROUP BY 1 ORDER BY SUM(line_total) DESC LIMIT 1) AS highest_cost_category,
            (SELECT item_name FROM base_finance GROUP BY 1 ORDER BY SUM(line_total) DESC LIMIT 1) AS highest_cost_item
        FROM base_finance
    ),
    expenditure_trend AS (
        SELECT 
            jsonb_agg(to_char(m, 'Mon YYYY') ORDER BY m) AS labels,
            jsonb_agg(COALESCE(monthly_sum, 0) ORDER BY m) AS values
        FROM generate_series(CURRENT_DATE - INTERVAL '5 months', CURRENT_DATE, '1 month'::interval) m
        LEFT JOIN (
            SELECT date_trunc('month', finance_date) AS mo, SUM(line_total) AS monthly_sum
            FROM base_finance 
            GROUP BY 1
        ) d ON date_trunc('month', m) = d.mo
    ),
    cost_by_category AS (
        SELECT 
            jsonb_agg(category_name ORDER BY total DESC) AS labels,
            jsonb_agg(total ORDER BY total DESC) AS values
        FROM (
            SELECT category_name, SUM(line_total) AS total
            FROM base_finance GROUP BY 1 ORDER BY 2 DESC LIMIT 5
        ) sub
    ),
    top_cost_items AS (
        SELECT 
            jsonb_agg(item_name ORDER BY total DESC) AS labels,
            jsonb_agg(total ORDER BY total DESC) AS values
        FROM (
            SELECT item_name, SUM(line_total) AS total
            FROM base_finance GROUP BY 1 ORDER BY 2 DESC LIMIT 5
        ) sub
    ),
    detailed_breakdown AS (
        SELECT jsonb_agg(item_row) AS rows
        FROM (
            SELECT 
                'FIN-' || LPAD(ROW_NUMBER() OVER(ORDER BY SUM(line_total) DESC)::text, 3, '0') AS id,
                item_name AS "itemName",
                category_name AS category,
                SUM(quantity_requested) AS "totalQuantity",
                MAX(unit_price_at_request) AS "unitCost",
                SUM(line_total) AS "totalCost",
                COUNT(DISTINCT order_id) AS "numOrders"
            FROM base_finance
            GROUP BY item_name, category_name
            ORDER BY SUM(line_total) DESC
            LIMIT 10
        ) item_row
    )

    SELECT jsonb_build_object(
        'summary', (
            SELECT jsonb_build_object(
                'totalExpenditure', COALESCE(total_expenditure, 0),
                'avgMonthlySpend', COALESCE(avg_monthly_spend, 0),
                'highestCostCategory', COALESCE(highest_cost_category, 'N/A'),
                'highestCostItem', COALESCE(highest_cost_item, 'N/A'),
                'currency', 'USD'
            ) FROM summary_metrics
        ),
        'expenditureTrend', (SELECT row_to_json(expenditure_trend) FROM expenditure_trend),
        'costByCategory', (
            SELECT jsonb_build_object(
                'labels', COALESCE(labels, '[]'::jsonb), 
                'values', COALESCE(values, '[]'::jsonb), 
                'colors', '["#007BFF", "#008B00", "#6C757D", "#17A2B8", "#FFC107"]'::jsonb
            ) FROM cost_by_category
        ),
        'topCostItems', (SELECT row_to_json(top_cost_items) FROM top_cost_items),
        'detailedBreakdown', (SELECT COALESCE(rows, '[]'::jsonb) FROM detailed_breakdown)
    ) AS finance_payload;
    `, [hosId]
  )

  return rows[0]
}