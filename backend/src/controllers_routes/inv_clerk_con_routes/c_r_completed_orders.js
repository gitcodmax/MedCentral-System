import e from "express";
import { getCompletedOrdersQ } from "../../repositories/inv_clerk_repo/rep_completed_orders.js";

export const completedOrdRouter = e.Router()

completedOrdRouter.get('/getCompletedOrders', async (req, res) => {
  try {
    const completedOrders = await getCompletedOrdersQ()
    res.status(200).json(completedOrders)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})