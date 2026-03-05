import pool from "../../config/db.js"
import bcrypt from 'bcrypt'

// This file contains the SQL scripts used to manipulate hospitals page.

async function hashPassword(plainPassword){
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
  return hashedPassword
}

// Get the hospital data to display it in the table
export async function getSavedHospitalsQ() {
  const text = `
    SELECT 
      h.hospital_id AS id,
      h.name,
      h.contact_person AS "contactPerson",
      h.phone_number AS phone,
      h.email,
      h.status,
      TO_CHAR(h.created_at, 'YYYY-MM-DD') AS "registeredDate",
      
      jsonb_build_object(
          'county_id', c.id,
          'county_name', c.name,
          'zone_id', z.id,
          'zone_name', z.zone_name
      ) AS location,

      (
          SELECT jsonb_agg(jsonb_build_object(
              'id', d.id,
              'name', d.name
          ))
          FROM hospital_department_mapping m
          JOIN cfg_hospital_departments d ON m.department_id = d.id
          WHERE m.hospital_id = h.hospital_id
      ) AS departments

    FROM hospitals h
    JOIN cfg_zones z ON h.zone_id = z.id
    JOIN cfg_counties c ON z.county_id = c.id;
  `
  const { rows } = await pool.query(text)
  return rows
}

export async function getGeoReferenceDataQ() {
  const text = `
    SELECT 
    c.id AS county_id,
    c.name AS county_name,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', z.id,
                'name', z.zone_name
            ) 
            ORDER BY z.zone_name ASC
        ), 
        '[]'
    ) AS zones
    FROM cfg_counties c
    LEFT JOIN cfg_zones z ON c.id = z.county_id
    GROUP BY c.id, c.name
    ORDER BY c.name ASC;
  `

  const { rows } = await pool.query(text)
  return rows
}

export async function getDepartmentsQ() {
  const text = `SELECT * FROM cfg_hospital_departments`
  const { rows } = await pool.query(text)
  return rows
}

// POST: Save new hospital details
export async function saveNewHosDetailsQ({ name, contact, phone, email,
  zone, password, status }) {
  const hashedPassword = await hashPassword(password)
  const text = `INSERT INTO hospitals ( 
    name,
    contact_person,
    phone_number, 
    email,
    zone_id,
    password_hash, 
    status
  ) VALUES 
  ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const values = [name, contact, phone, email, zone, hashedPassword, status];
  const { rows } = await pool.query(text, values);
  return rows[0]
}

// Save hospital departments picked
export async function saveHosDeptQ(hosId, deptId) {
  const text = `
    INSERT INTO hospital_department_mapping (
    hospital_id, 
    department_id
    )  VALUES (
      $1, $2) RETURNING *
  `;
  const values = [hosId, deptId]
  const { rows } = await pool.query(text, values);
  return rows[0]
}

export async function updateHosDetailsQ({ hosId, name, contact, phone,
  email, zone, status }) {
  const text = `
    UPDATE hospitals
    SET 
      name = $1,
      email = $2,
      zone_id = $3,
      contact_person = $4,
      phone_number = $5,
      status = $6
    WHERE hospital_id = $7 RETURNING *
  `
  const values = [name, email, zone, contact, phone, status, hosId]
  const {rows} = await pool.query(text, values)
  return rows[0]
}

// Check whether hospital and department id exist in the table b4 inserting them
export async function checkHosDeptIdQ(hosId, deptId){
  const text = `
    SELECT * FROM hospital_department_mapping  
    WHERE hospital_id = $1 AND department_id = $2
  `
  const values = [hosId, deptId]
  const {rows} = await pool.query(text, values)
  return rows
}

// Transaction query to deactivate an hospital
export async function deactivateHosQ({hosId, reason}){
  const client = await pool.connect();

  try{
    await client.query('BEGIN');

    const updatedHos = await client.query(
      `UPDATE hospitals 
      SET status = 'inactive' 
      WHERE hospital_id = $1 
      RETURNING *`, 
      [hosId]
    )

    if(updatedHos.rowCount === 0){
      throw new Error('Hospital not found')
    }

    await client.query(
      `INSERT INTO hospital_deactivation_log (hospital_id, reason)
       VALUES ($1, $2)`, 
       [hosId, reason]
    );

    await client.query('COMMIT')

    return updatedHos.rows[0]
  }catch (err){
    await client.query('ROLLBACK')
    throw err
  }finally{
    client.release()
  }
}

// Activate an hospital
export async function activateHosQ(hosId){
  const {rows} = await pool.query(
    `UPDATE hospitals 
    SET status = 'active' 
    WHERE hospital_id = $1 RETURNING *`, 
    [hosId]
  )
  return rows[0]
}

export async function updateHosPasswordQ({hosId, password}){
  const hashedPassword = await hashPassword(password)
  await pool.query(`
    UPDATE hospitals 
    SET password_hash = $1
    WHERE hospital_id = $2
    `, [hashedPassword, hosId])
}
