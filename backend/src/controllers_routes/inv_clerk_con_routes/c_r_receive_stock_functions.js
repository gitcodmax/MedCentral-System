import e from 'express';
import { getItemsDataQ } from '../../repositories/inv_clerk_repo/rep_receive_stock_functions.js';

export const receiveStockRouter = e.Router()

receiveStockRouter.get('/getItemsData', async (req, res) => {
  try {
    const itemsData = await getItemsDataQ()
    res.status(200).json(itemsData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})