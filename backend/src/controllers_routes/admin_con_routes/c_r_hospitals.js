import express from 'express'
import { getSavedHospitalsQ, getGeoReferenceDataQ } from '../../repositories/admin_repo/rep_hospitals.js'

const adminHosRouter = express.Router()

// Get the hospital data to display it in the table
adminHosRouter.get('/getSavedHospitals', async (req, res) => {
  try{
    const savedHos = await getSavedHospitalsQ()
    res.status(200).json({savedHos})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

adminHosRouter.get('/getGeoRefData', async (req, res) => {
  try{
    const countyData = await getGeoReferenceDataQ()
    res.status(200).json({countyData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

export default adminHosRouter