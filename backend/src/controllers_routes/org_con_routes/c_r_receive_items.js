import express from "express";
import { getAllDeliveredPackagesQ, getCommonDamageTypesQ } from "../../repositories/org_repo/rep_receive_items.js";

const receiveItemsRouter = express.Router()

receiveItemsRouter.post('/getAllDeliveredPackages', async (req, res) => {
  try {
    const deliveredPkgs = await getAllDeliveredPackagesQ(req.body.hosId)
    res.status(200).json({deliveredPkgs})
  } catch (err) {
    res.status(500).json({Error: err.message})
  }
})

receiveItemsRouter.get('/getCommonDamageTypes', async (req, res) => {
  try {
    const commonDamageTypes = await getCommonDamageTypesQ()
    res.status(200).json({ commonDamageTypes })
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default receiveItemsRouter