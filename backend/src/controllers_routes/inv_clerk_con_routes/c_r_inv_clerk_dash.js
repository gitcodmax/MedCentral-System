import e from "express";
import { getKpiTblsDataQ } from "../../repositories/inv_clerk_repo/rep_inv_clerk_dash.js";

export const invClerkDashRouter = e.Router()

invClerkDashRouter.post('/getKpiTblsData', async (req, res) => {
  try {
    const kpiTablesData = await getKpiTblsDataQ(req.body.hosId)
    res.status(200).json(kpiTablesData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})