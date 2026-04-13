import e from "express";
import { createOrderQ, getApprovedRequestsQ } from "../../repositories/org_repo/rep_payments.js";

const orgPortalPaymentsRouter = e.Router()

orgPortalPaymentsRouter.post('/getApprovedRequests', async (req, res) => {
  try {
    const approvedReq = await getApprovedRequestsQ(req.body.hosId)
    res.status(200).json(approvedReq)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

orgPortalPaymentsRouter.post('/createOrder', async (req, res) => {
  try {
    await createOrderQ(req.body.reqId)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

export default orgPortalPaymentsRouter