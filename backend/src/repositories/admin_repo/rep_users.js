import pool from "../../config/db.js";

export async function getAllSysUsersQ(){
  const {rows} = await pool.query(`
    SELECT user_id AS id, full_name, email, 
      (SELECT id FROM cfg_roles WHERE id = role_id) AS role_id, 
      CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status , 
      last_login AS lastLogin
    FROM users
  `)

  return rows
}

export async function getAllDriversQ(){
  const {rows} = await pool.query(`
    SELECT driver_id AS id, full_name, phone_number AS phone, 
      vehicle_plates AS vehicleNo, 
      (SELECT county_id FROM cfg_zones WHERE id = preferred_zone_id) AS county_id, 
      (SELECT name FROM cfg_counties WHERE id = (SELECT county_id FROM cfg_zones WHERE id = preferred_zone_id)) AS county_name, 
      preferred_zone_id AS zone_id, 
      (SELECT zone_name FROM cfg_zones WHERE id = preferred_zone_id) AS zone_name, 
      CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status 
    FROM drivers
  `)

  return rows
}

export async function updateSysUsersDataQ({fullName, email, roleId, userId}){
  const {rows} = await pool.query(`
    UPDATE users SET 
      full_name = $1, 
      email = $2, 
      role_id = $3
    WHERE user_id = $4 RETURNING *
  `, [fullName, email, roleId, userId])

  return rows
}