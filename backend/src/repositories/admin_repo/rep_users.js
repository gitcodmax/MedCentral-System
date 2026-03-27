import { hash } from "bcrypt";
import pool from "../../config/db.js";
import { hashPassword } from "./rep_hospitals.js";

export async function getAllSysUsersQ(){
  const {rows} = await pool.query(`
    SELECT user_id AS id, full_name, email, 
      (SELECT id FROM cfg_roles WHERE id = role_id) AS role_id, 
      CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END AS status , 
      last_login AS lastLogin
    FROM users WHERE role_id IN (1, 2)
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

export async function addNewSysUserQ({fullName, email, roleId, plainPwd}){
  const hashedPassword = await hashPassword(plainPwd)
  await pool.query(`
    INSERT INTO users (email, password_hash, full_name, role_id)
      VALUES ($1, $2, $3, $4) 
  `, [email, hashedPassword, fullName, roleId])
}

export async function addNewDriverQ({fullName, phoneNo, vehicleNo, zoneId}){
  await pool.query(`
    INSERT INTO drivers (full_name, phone_number, vehicle_plates, preferred_zone_id)
    VALUES ($1, $2, $3, $4)
  `, [fullName, phoneNo, vehicleNo, zoneId])
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

export async function updateSysUsersPasswordQ({userId, plainPwd}){
  const pwdHash = await hashPassword(plainPwd)
  const {rows} = await pool.query(`
    UPDATE users SET 
    password_hash = $1
    WHERE user_id = $2
  `, [pwdHash, userId])

  return rows
}

// Deactivates and activates the sys. users and the drivers
export async function deActivateUserQ({userId, status, userType}){
  if(status === 'active'){
    userType === 'sysUser' ? 
    await pool.query(`
      UPDATE users SET is_active = false WHERE user_id = $1
    `, [userId]) : 
    await pool.query(`
      UPDATE drivers SET is_active = false WHERE driver_id = $1
    `, [userId])
  }else{
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
export async function updateDriverDataQ({fullName, phoneNo, vehicleNo, zoneId, driverId}){
  const {rows} = await pool.query(`
    UPDATE drivers SET 
      full_name = $1, 
      phone_number = $2, 
      vehicle_plates = $3, 
      preferred_zone_id = $4
    WHERE driver_id = $5
  `, [fullName, phoneNo, vehicleNo, zoneId, driverId])

  return rows
}