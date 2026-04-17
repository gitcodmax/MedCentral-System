import e from "express";
import { getItemsDamagesQ } from "../../repositories/inv_clerk_repo/rep_report_damage.js";

export const reportDamagesRouter = e.Router()

reportDamagesRouter.get('/getItemsDamages', async (req, res) => {
  try {
    const itemsDamages = await getItemsDamagesQ()
    res.status(200).json(itemsDamages)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})