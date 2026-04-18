import e from "express";
import { getItemsDamagesQ, saveItemDamageQ } from "../../repositories/inv_clerk_repo/rep_report_damage.js";

export const reportDamagesRouter = e.Router()

reportDamagesRouter.get('/getItemsDamages', async (req, res) => {
  try {
    const itemsDamages = await getItemsDamagesQ()
    res.status(200).json(itemsDamages)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

reportDamagesRouter.post('/saveItemDamage', async (req, res) => {
  try {
    await saveItemDamageQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({Error: e.message, msg: 'error'})
  }
})