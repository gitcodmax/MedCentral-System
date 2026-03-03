import pool from "../../config/db.js"

// This file contains the SQL scripts used to manipulate hospitals page.

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
  const values = [name, contact, phone, email, zone, password, status];
  const { rows } = await pool.query(text, values);
  return rows[0]
}

// Save hospital departments picked
export async function saveHosDeptQ(hosId, deptId){
  const text = `
    INSERT INTO hospital_department_mapping (
    hospital_id, 
    department_id
    )  VALUES (
      $1, $2) RETURNING *
  `;
  const values = [hosId, deptId]
  const {rows} = await pool.query(text, values);
  return rows[0]
}
