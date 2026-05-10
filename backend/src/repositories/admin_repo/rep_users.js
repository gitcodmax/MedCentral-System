import { hash } from "bcrypt";
import pool from "../../config/db.js";
import { hashPassword } from "./rep_hospitals.js";

export async function getAllSysUsersQ() {
  const { rows } = await pool.query(`
    SELECT user_id AS id, full_name, email, 
      (SELECT id FROM cfg_roles WHERE id = role_id) AS role_id, 
      CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status , 
      last_login AS lastLogin
    FROM users WHERE role_id IN (1, 2)
  `)

  return rows
}

export async function getAllDriversQ() {
  const { rows } = await pool.query(`
    SELECT d.driver_id AS id, d.full_name, d.phone_number AS phone, 
      v.plate_number AS vehicle_no, 
      v.max_tons AS max_tons, 
      v.type_code AS veh_type, 
      v.category_id AS veh_cat, 
      v.temp_cap_codes AS temp_codes,
      (SELECT county_id FROM cfg_zones WHERE id = preferred_zone_id) AS county_id, 
      (SELECT name FROM cfg_counties WHERE id = (SELECT county_id FROM cfg_zones WHERE id = preferred_zone_id)) AS county_name, 
      preferred_zone_id AS zone_id, 
      (SELECT zone_name FROM cfg_zones WHERE id = preferred_zone_id) AS zone_name, 
      CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status 
    FROM drivers d 
    JOIN vehicle_assignments va ON d.driver_id = va.driver_id 
    JOIN vehicles v ON v.vehicle_id = va.vehicle_id
  `)

  return rows
}

export async function addNewSysUserQ({ fullName, email, roleId, plainPwd }) {
  const hashedPassword = await hashPassword(plainPwd)
  await pool.query(`
    INSERT INTO users (email, password_hash, full_name, role_id)
      VALUES ($1, $2, $3, $4) 
  `, [email, hashedPassword, fullName, roleId])
}

export async function addNewDriverQ({ fullName, phoneNo, vehicleNo, zoneId,
  vehicleType, vehicleCategory, maxTon, storageTempCaps
}) {
  const client = await pool.connect()

  try {
    client.query('BEGIN')

    const driversRes = await client.query(`
      INSERT INTO drivers (full_name, phone_number, preferred_zone_id)
        VALUES ($1, $2, $3) RETURNING driver_id
      `, [fullName, phoneNo, zoneId]
    )

    const driverId = driversRes.rows[0].driver_id

    if (!driverId) throw new Error('Driver details not saved!')

    const vehiclesRes = await client.query(
      `
      INSERT INTO vehicles(plate_number, type_code, category_id, max_tons, temp_cap_codes)
      VALUES ($1, $2, $3, $4, $5) RETURNING vehicle_id
      `, [vehicleNo, vehicleType, vehicleCategory, maxTon, storageTempCaps]
    )

    const vehicleId = vehiclesRes.rows[0].vehicle_id

    if (!vehicleId) throw new Error('Vehicle details not saved!!')

    const vehAssiRes = await client.query(
      `
      INSERT INTO vehicle_assignments (vehicle_id, driver_id, assigned_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING assignment_id
      `, [vehicleId, driverId]
    )

    const vehicleAssignId = vehAssiRes.rows[0].assignment_id

    const updateDrivers = await client.query(
      `
      UPDATE drivers
      SET assignment_id = $1
      WHERE driver_id = $2
      `, [vehicleAssignId, driverId]
    )

    await client.query('COMMIT')
    return vehicleAssignId
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function updateSysUsersDataQ({ fullName, email, roleId, userId }) {
  const { rows } = await pool.query(`
    UPDATE users SET 
      full_name = $1, 
      email = $2, 
      role_id = $3
    WHERE user_id = $4 RETURNING *
  `, [fullName, email, roleId, userId])

  return rows
}

export async function updateSysUsersPasswordQ({ userId, plainPwd }) {
  const pwdHash = await hashPassword(plainPwd)
  const { rows } = await pool.query(`
    UPDATE users SET 
    password_hash = $1
    WHERE user_id = $2
  `, [pwdHash, userId])

  return rows
}

// Deactivates and activates the sys. users and the drivers
export async function deActivateUserQ({ userId, status, userType }) {
  if (status === 'active') {
    userType === 'sysUser' ?
      await pool.query(`
      UPDATE users SET is_active = false WHERE user_id = $1
    `, [userId]) :
      await pool.query(`
      UPDATE drivers SET is_active = false WHERE driver_id = $1
    `, [userId])
  } else {
    userType === 'sysUser' ?
      await pool.query(`
      UPDATE users SET is_active = true WHERE user_id = $1
    `, [userId]) :
      await pool.query(`
      UPDATE drivers SET is_active = true WHERE driver_id = $1
    `, [userId])
  }
}

// Drivers edit, activation and deactivation
export async function updateDriverDataQ({fullName, phoneNo, zoneId, driverId}){
  const {rows} = await pool.query(`
    UPDATE drivers SET 
      full_name = $1, 
      phone_number = $2,  
      preferred_zone_id = $3
    WHERE driver_id = $4
  `, [fullName, phoneNo, zoneId, driverId])

  return rows
}

export async function vehiclesCategoriesTypesQ() {
  const { rows } = await pool.query(
    `
    WITH veh_categories AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'category_id', category_id, 
          'name', name
        )
      ) AS cat_data
    FROM cfg_vehicle_categories
    ), veh_types AS 
      (
      SELECT 
        jsonb_agg(
          jsonb_build_object(
            'type_code', type_code, 
            'type_name', display_name
          )
        ) AS types_data
      FROM cfg_vehicle_types
      )

    SELECT 
      jsonb_build_object(
        'vehicle_categories', (SELECT cat_data FROM veh_categories), 
        'vehicle_types', (SELECT types_data FROM veh_types)
      ) AS vehicles_categories_types
    `
  )

  return rows[0]
}