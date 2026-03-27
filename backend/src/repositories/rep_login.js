import pool from "../config/db.js"

export async function getUserDetailsQ(email) {
  const { rows } = await pool.query(
    `SELECT password_hash, user_id, role_id FROM users 
    WHERE email = $1`
    , [email])
  
  return rows[0]
}