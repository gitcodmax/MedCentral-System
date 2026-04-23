import e from "express";
import { getKpiTblsDataQ, getOrdersDataQ } from "../../repositories/inv_clerk_repo/rep_inv_clerk_dash.js";

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