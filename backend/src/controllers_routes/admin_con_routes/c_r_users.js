import express from "express";
import { addNewDriverQ, addNewSysUserQ, deActivateUserQ, getAllDriversQ, getAllSysUsersQ, updateDriverDataQ, 
  updateSysUsersDataQ, updateSysUsersPasswordQ, 
  vehiclesCategoriesTypesQ} from "../../repositories/admin_repo/rep_users.js";

const adminUsersRouter = express.Router()

// Get all system users
adminUsersRouter.get('/getAllSysUsers', async (req, res) => {
  try{
    const sysUsers = await getAllSysUsersQ()
    const sysUsersMod = usersDataModArr(sysUsers, 'sysU')
    res.status(200).json({sysUsersMod})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

// Get all drivers
adminUsersRouter.get('/getAllDrivers', async (req, res) => {
  try{
    const allDrivers = await getAllDriversQ()
    const allDriversMod = usersDataModArr(allDrivers, 'driver')
    res.status(200).json({allDriversMod})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

adminUsersRouter.post('/addNewSysUser', async (req, res) => {
  try{
    await addNewSysUserQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

adminUsersRouter.post('/addNewDriver', async (req, res) => {
  try{
    await addNewDriverQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(err){
    res.status(500).json({msg: 'error'})
  }
})

adminUsersRouter.put('/updateSysUsersData', async (req, res) => {
  try{
    const updatedUser = await updateSysUsersDataQ(req.body)
    res.status(200).json({msg: 'success', updatedUser})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

adminUsersRouter.put('/updateSysUsersPassword', async (req, res) => {
  try{
    await updateSysUsersPasswordQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

adminUsersRouter.put('/deActivateUser', async (req, res) => {
  try{
    await deActivateUserQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(err){
    res.status(500).json({msg: 'error'})
  }
})

adminUsersRouter.put('/updateDriverData', async (req, res) => {
  try{
    await updateDriverDataQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

adminUsersRouter.get('/vehiclesCategoriesTypes', async (req, res) => {
  try {
    const vehiclesData =  await vehiclesCategoriesTypesQ()
    res.status(200).json(vehiclesData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

// Updates the result passed to the FE about the users data
function usersDataModArr(usersArr, userType){
  const sysUsersMod = usersArr.map(user => {
    const [firstName, lastName] = user.full_name.split(" ")
    user.firstName = firstName
    user.lastName = lastName
    delete user.full_name

    if(userType === "sysU"){
      user.lastLogin = user.lastlogin
      delete user.lastlogin
    }else if(userType === 'driver'){
      user.vehicleNo = user.vehicleno
      delete user.vehicleno
    }

    return user
  })

  return sysUsersMod
}

export default adminUsersRouter