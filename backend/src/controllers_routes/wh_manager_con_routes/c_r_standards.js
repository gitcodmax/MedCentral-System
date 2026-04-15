import e from "express";
import { getAdminStandardsQ } from "../../repositories/wh_manager_repo/rep_standards.js";

export const standardsRouter = e.Router()

standardsRouter.get('/getAdminStandards', async (req, res) => {
  try {
    const adminStandards = await getAdminStandardsQ()
    res.status(200).json(adminStandards)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})