import e from "express";
import { deleteItemQ, getCatalogItemsQ, saveNewItemQ } from "../../repositories/wh_manager_repo/rep_item_registry.js";


export const itemRegistryRouter = e.Router()

itemRegistryRouter.post('/saveNewItem', async (req, res) => {
  try {
    await saveNewItemQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

itemRegistryRouter.get('/getCatalogItems', async (req, res) => {
  try {
    const catalogItems = await getCatalogItemsQ()
    res.status(200).json(catalogItems)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

itemRegistryRouter.put('/deleteItem', async (req, res) => {
  try {
    await deleteItemQ(req.body.sku)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})