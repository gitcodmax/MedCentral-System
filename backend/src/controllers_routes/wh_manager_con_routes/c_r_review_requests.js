import express from "express";
import { approveReqQ, denyRequestQ, getAllRequestsQ } from "../../repositories/wh_manager_repo/rep_review_requests.js";

const reviewReqRouter = express.Router()

reviewReqRouter.get('/getAllRequests', async (req, res) => {
  try {
    const allReq = await getAllRequestsQ()
    res.status(200).json(allReq)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

reviewReqRouter.put('/denyRequest', async (req, res) => {
  try {
    await denyRequestQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({Error: e.message, msg: 'error'})
  }
})

reviewReqRouter.put('/approveReq', async (req, res) => {
  try {
    await approveReqQ(req.body.reqId)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

export default reviewReqRouter