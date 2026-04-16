import e from "express";
import { assignShelfItemQ, createNewShelfQ, deleteShelfQ, getWhInvMapQ } from "../../repositories/wh_manager_repo/rep_wh_layout.js";

export const whLayoutRouter = e.Router()

whLayoutRouter.post('/createNewShelf', async (req, res) => {
  try {
    await createNewShelfQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error'})
  }
})

whLayoutRouter.get('/getWhInvMap', async (req, res) => {
  try {
    const whLayoutData = await getWhInvMapQ()
    res.status(200).json(whLayoutData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

whLayoutRouter.delete('/deleteShelf', async (req, res) => {
  try {
    await deleteShelfQ(req.body.shelfId)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

whLayoutRouter.put('/assignShelfItem', async (req, res) => {
  try {
    await assignShelfItemQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})