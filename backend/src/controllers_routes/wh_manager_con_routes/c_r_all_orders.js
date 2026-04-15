import e from "express";
import { getOrdersDataQ } from "../../repositories/wh_manager_repo/rep_all_orders.js";

const allOrdersRouter = e.Router()

allOrdersRouter.get('/getOrdersData', async (req, res) => {
  try {
    const allOrders = await getOrdersDataQ()
    res.status(200).json(allOrders)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default allOrdersRouter