import express from "express";
import { getAllDeliveredPackagesQ, getCommonDamageTypesQ, getReceivedItemsStatusQ, saveDeliveredItemsWithIssuesQ, updatePackageStatusQ } from "../../repositories/org_repo/rep_receive_items.js";

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

receiveItemsRouter.get('/getReceivedItemsStatus', async (req, res) => {
  try {
    const recievedItemsStatuses = await getReceivedItemsStatusQ()
    res.status(200).json({recievedItemsStatuses})
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})


receiveItemsRouter.post('/saveDeliveredItemsWithIssues', async (req, res) => {
  try {
    const { deliveryIssuesArr } = req.body
    await saveDeliveredItemsWithIssuesQ(deliveryIssuesArr)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({Error: e.message, msg: 'error'})
  }
})

// UPdate the status of a package to completed if there is no issue in the items received
receiveItemsRouter.post('/updatePackageStatus', async (req, res) => {
  try {
    await updatePackageStatusQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error'})
  }
})

export default receiveItemsRouter