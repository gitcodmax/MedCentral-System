import e from "express";
import { dispatchOrderPkgsQ, getKpiTblsDataQ, getOrdersDataQ, packedOrderPkgsQ } from "../../repositories/inv_clerk_repo/rep_inv_clerk_dash.js";

export const invClerkDashRouter = e.Router()

invClerkDashRouter.post('/getKpiTblsData', async (req, res) => {
  try {
    const kpiTablesData = await getKpiTblsDataQ(req.body.clerkId)
    res.status(200).json(kpiTablesData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

invClerkDashRouter.post('/getOrdersData', async (req, res) => {
  try {
    const ordersData = await getOrdersDataQ(req.body.clerkId)
    res.status(200).json(ordersData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

// UPDATES
invClerkDashRouter.put('/packedOrderPkgs', async (req, res) => {
  try {
    await packedOrderPkgsQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

invClerkDashRouter.put('/dispatchOrderPkgs', async (req, res) => {
  try {
    await dispatchOrderPkgsQ(req.body.packageId)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})