import express from "express";
import { getAllDeliveredPackagesQ } from "../../repositories/org_repo/rep_receive_items.js";

const receiveItemsRouter = express.Router()

receiveItemsRouter.post('/getAllDeliveredPackages', async (req, res) => {
  try {
    const deliveredPkgs = await getAllDeliveredPackagesQ(req.body.hosId)
    res.status(200).json({deliveredPkgs})
  } catch (err) {
    res.status(500).json({Error: err.message})
  }
})

export default receiveItemsRouter