import e from "express";
import { assignClerkQ, getOrderPackagesQ } from "../../repositories/wh_manager_repo/rep_assign_to_clerk.js";

const clerkAssignmentRouter = e.Router()

clerkAssignmentRouter.get('/getOrderPackages', async (req, res) => {
  try {
    const clerkReqData = await getOrderPackagesQ()
    res.status(200).json(clerkReqData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

clerkAssignmentRouter.put('/assignClerk', async (req, res) => {
  try {
    await assignClerkQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error'})
  }
})

export default clerkAssignmentRouter