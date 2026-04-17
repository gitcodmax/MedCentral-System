import e from 'express';
import { getItemsDataQ, saveNewStockDataQ } from '../../repositories/inv_clerk_repo/rep_receive_stock.js';

export const receiveStockRouter = e.Router()

receiveStockRouter.get('/getItemsData', async (req, res) => {
  try {
    const itemsData = await getItemsDataQ()
    res.status(200).json(itemsData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

receiveStockRouter.post('/saveNewStockData', async (req, res) => {
  try {
    await saveNewStockDataQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: error, Error: e.message})
  }
})