import e from "express";
import { getWhManagerDashDataQ } from "../../repositories/wh_manager_repo/rep_wh_manager_dash.js";

export const whManagerDashRouter = e.Router()

whManagerDashRouter.get('/getWhManagerDashData', async (req, res) => {
  try {
    const dashData = await getWhManagerDashDataQ()
    res.status(200).json(dashData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})