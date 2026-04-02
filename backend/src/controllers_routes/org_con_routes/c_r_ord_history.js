import express from "express";
import { getAllRequestsInfoQ } from "../../repositories/org_repo/rep_ord_history.js";

const ordHistoryRouter = express.Router()

ordHistoryRouter.post('/getAllRequestsInfo', async (req, res) => {
  try {
    const allHosRequests = await getAllRequestsInfoQ(req.body.hosId)
    res.status(200).json({allHosRequests})
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default ordHistoryRouter