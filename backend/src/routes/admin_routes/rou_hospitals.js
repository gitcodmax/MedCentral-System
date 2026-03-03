import express from 'express'
import { getSavedHospitals } from '../../controllers/admin_controller/con_hospitals.js'

const adminHosRouter = express.Router()

adminHosRouter.get('/getSavedHospitals', getSavedHospitals)

export default adminHosRouter