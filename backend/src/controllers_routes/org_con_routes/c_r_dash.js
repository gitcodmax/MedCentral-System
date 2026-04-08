import e from "express";
import { getOrgDashDataQ } from "../../repositories/org_repo/rep_dash.js";

const orgDashRouter = e.Router()

orgDashRouter.post('/getOrgDashData', async (req, res) => {
  try {
    const dashData = await getOrgDashDataQ(req.body.hosId)
    res.status(200).json(dashData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default orgDashRouter