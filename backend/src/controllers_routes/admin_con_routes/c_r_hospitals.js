import express from 'express'
import { getSavedHospitalsQ } from '../../repositories/admin_repo/rep_hospitals.js'

const adminHosRouter = express.Router()

adminHosRouter.get('/getSavedHospitals', async (req, res) => {
  try{
    const savedHos = await getSavedHospitalsQ()
    res.status(200).json({savedHos})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

export default adminHosRouter