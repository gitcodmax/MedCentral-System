import express from "express";
import { getAllItemsQ, getCatStorageUomQ, updateItemsDetailsQ } from "../../repositories/admin_repo/rep_inventory.js";

const adminInvRouter = express.Router()

adminInvRouter.get('/getAllItems', async (req, res) => {
  try {
    const itemsDetails = await getAllItemsQ()
    const itemsWithStatus = itemsDetails.map(item => {
      const currentStock = item.current_stock
      const minStockLevel = item.min_stock_level
      let status = ''

      if (currentStock <= 0) {
        status = 'out of stock'
      } else if (currentStock <= minStockLevel) {
        status = 'low'
      } else if (currentStock > minStockLevel) {
        status = 'healthy'
      }

      item.status = status
      return item
    })

    res.status(200).json({ msg: 'success', itemsWithStatus })
  } catch (err) {
    res.status(500).json({ msg: 'error', Error: err.message })
  }
})

adminInvRouter.get('/getCatStorageUom', async (req, res) => {
  try {
    const catStorageUomDetails = await getCatStorageUomQ()
    res.status(200).json({ msg: 'success', catStorageUomDetails })
  } catch (err) {
    res.status(500).json({ msg: 'error', Error: err.message })
  }
})

adminInvRouter.put('/updateItemsDetails', async (req, res) => {
  try{
    const updatedItemsDetails = await updateItemsDetailsQ(req.body)
    console.log(updatedItemsDetails)
    res.status(200).json({msg: 'success', updatedItemsDetails})
  }catch(err){
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

export default adminInvRouter