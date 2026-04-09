import e from "express";
import { getApprovedRequestsQ } from "../../repositories/org_repo/rep_payments.js";

const orgPortalPaymentsRouter = e.Router()

orgPortalPaymentsRouter.post('/getApprovedRequests', async (req, res) => {
  try {
    const approvedReq = await getApprovedRequestsQ(req.body.hosId)
    res.status(200).json(approvedReq)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default orgPortalPaymentsRouter