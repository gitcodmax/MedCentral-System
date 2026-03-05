import express from 'express'
import {
  getSavedHospitalsQ, getGeoReferenceDataQ,
  getDepartmentsQ,
  saveNewHosDetailsQ,
  saveHosDeptQ,
  updateHosDetailsQ,
  checkHosDeptIdQ,
  deactivateHosQ,
  activateHosQ
} from '../../repositories/admin_repo/rep_hospitals.js'

const adminHosRouter = express.Router()

// Get the hospital data to display it in the table
adminHosRouter.get('/getSavedHospitals', async (req, res) => {
  try {
    const savedHos = await getSavedHospitalsQ()
    res.status(200).json({ savedHos })
  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
})

adminHosRouter.get('/getGeoRefData', async (req, res) => {
  try {
    const countyData = await getGeoReferenceDataQ()
    res.status(200).json({ countyData })
  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
})

adminHosRouter.get('/getDepartments', async (req, res) => {
  try {
    const departmentsData = await getDepartmentsQ()
    res.status(200).json({ departmentsData })
  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
})

adminHosRouter.post('/newHosDetails', async (req, res) => {
  try {
    const { selectedDeptIds } = req.body
    const newHosDetails = await saveNewHosDetailsQ(req.body)

    // Get the hospital id of the new hospital and save the departments selected
    if (newHosDetails && selectedDeptIds) {
      const newHosId = newHosDetails.hospital_id

      for (const deptId of selectedDeptIds) {
        await saveHosDeptQ(newHosId, deptId)
      }
    }
    res.status(200).json({ newHosDetails })
  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
})

adminHosRouter.put('/updateHosDetails', async (req, res) => {
  try {
    const { selectedDeptIds } = req.body
    const updatedHosDetails = await updateHosDetailsQ(req.body)
    if (updatedHosDetails && selectedDeptIds) {
      const updatedHosId = updatedHosDetails.hospital_id

      // Check first if the hospital & department ids are available in the
      // hospital_department_mapping b4 inserting the details
      for (const deptId of selectedDeptIds) {
        const hosDeptIds = await checkHosDeptIdQ(updatedHosId, deptId)
        if (hosDeptIds.length === 0) await saveHosDeptQ(updatedHosId, deptId)
      }
    }
    res.status(200).json({ updatedHosDetails })
  } catch (err) {
    res.status(500).json({ Error: err.message })
  }
})

// Transaction to deactivate hos
adminHosRouter.patch('/deactivateHos', async (req, res) => {
  try {
    const deactiveHosDetails = await deactivateHosQ(req.body)
    res.status(200).json({msg: 'success', deactiveHosDetails})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

// Update hospital status to active
adminHosRouter.put('/activateHos', async (req, res) => {
  try{
    const activatedHosDetails = await activateHosQ(req.body.hosId)
    res.status(200).json({msg: 'success', activatedHosDetails})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

export default adminHosRouter