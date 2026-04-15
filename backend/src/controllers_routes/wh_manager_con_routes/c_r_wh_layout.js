import e from "express";
import { createNewShelfQ } from "../../repositories/wh_manager_repo/rep_wh_layout.js";

export const whLayoutRouter = e.Router()

whLayoutRouter.post('/createNewShelf', async (req, res) => {
  try {
    await createNewShelfQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error'})
  }
})