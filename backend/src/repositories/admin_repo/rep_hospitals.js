import pool from "../../config/db.js"

export async function getSavedHospitalsQ(){
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
  const {rows} = await pool.query(text)
  return rows
}
