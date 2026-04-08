import express from "express";
import { getAllRequestsQ } from "../../repositories/wh_manager_repo/rep_review_requests.js";

const reviewReqRouter = express.Router()

reviewReqRouter.get('/getAllRequests', async (req, res) => {
  try {
    const allReq = await getAllRequestsQ()
    res.status(200).json(allReq)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default reviewReqRouter