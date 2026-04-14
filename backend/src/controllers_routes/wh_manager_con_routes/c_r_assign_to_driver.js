import e from "express";
import { getPackagesDriversDataQ } from "../../repositories/wh_manager_repo/rep_assign_to_driver.js";

const assignDriverRouter = e.Router()

assignDriverRouter.get('/getPackagesDriversData', async (req, res) => {
  try {
    const pkgDriverData = await getPackagesDriversDataQ()
    res.status(200).json(pkgDriverData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default assignDriverRouter