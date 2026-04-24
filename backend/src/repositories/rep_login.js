import pool from "../config/db.js"

export async function getUserDetailsQ(email) {
  const { rows } = await pool.query(
    `SELECT password_hash, user_id, role_id, hospital_id FROM users 
    WHERE email = $1`
    , [email])
  
  return rows[0]
}

export async function getUserNameQ(userId) {
  const { rows } = await pool.query(
    `
    SELECT full_name FROM users WHERE user_id = $1
    `, [userId]
  )

  return rows[0]
}