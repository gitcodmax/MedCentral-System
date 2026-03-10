import express from 'express'
import { getOrdReqQ } from '../../repositories/admin_repo/rep_orders.js'

const adminOrdersRouter = express.Router()

adminOrdersRouter.get('/getOrdReq', async (req, res) => {
  try{
    const ordReqData = await getOrdReqQ()
    res.status(200).json({msg: 'success', ordReqData})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

export default adminOrdersRouter