import pool from "../../config/db.js";

export async function getAdminStandardsQ() {
  const { rows } = await pool.query(
    `
    SELECT jsonb_build_object(
      'storageTemps', (SELECT jsonb_agg(
          jsonb_build_object(
            'id', code, 
            'name', description || ' (' || temp_range || ')'
          )
        )
        FROM cfg_storage_options
      ),
      'categories', (SELECT jsonb_agg(
          jsonb_build_object(
            'id', id, 
            'name', name
          )
        )
        FROM cfg_item_categories
      ), 
      'uomOptions', (SELECT jsonb_agg(
          jsonb_build_object(
            'id', id, 
            'name', name
          )
        ) 
        FROM cfg_uoms
      )
    ) AS admin_standards
    `
  )

  return rows[0]
}