import express from 'express'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { getUserDetailsQ } from '../repositories/rep_login.js'

dotenv.config()
const loginRouter = express.Router()

loginRouter.post('/getUserDetails', async (req, res) => {
  try {
    const reqEmail = req.body.email
    const reqPwd = req.body.password
    const userDetails = await getUserDetailsQ(reqEmail)
    const savedPwdHash = userDetails.password_hash
    const savedUserId = userDetails.user_id
    const savedRoleId = userDetails.role_id

    if (userDetails && await bcrypt.compare(reqPwd, savedPwdHash)) {
      const token = jwt.sign(
        { userId: savedUserId, role: savedRoleId},
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      res.status(200).json({
        token, role: savedRoleId, hosId: userDetails.hospital_id,
        userId: savedUserId, msg: 'success'
      })
    } else {
      res.status(401).json({msg: 'Invalid credentials'})
    }
  } catch (err) {
    res.status(500).json({Error: err.message})
  }
})

export default loginRouter