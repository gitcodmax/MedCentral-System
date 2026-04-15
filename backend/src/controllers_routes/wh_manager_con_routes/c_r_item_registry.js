import e from "express";
import { saveNewItemQ } from "../../repositories/wh_manager_repo/rep_item_registry.js";

export const itemRegistryRouter = e.Router()

itemRegistryRouter.post('/saveNewItem', async (req, res) => {
  try {
    await saveNewItemQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})