import express from "express";
import { distroReportDataQ, getHosIdNameQ, invReportDataQ, lowStockReportDataQ } from "../../repositories/admin_repo/rep_reports.js";

const adminReportsRouter = express.Router()

adminReportsRouter.post('/invReportData', async (req, res) => {
  try{
    const invReportData = await invReportDataQ(req.body)
    res.status(200).json({invReportData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

adminReportsRouter.post('/lowStockReportData', async (req, res) => {
  try{
    const lowStockReportData = await lowStockReportDataQ(req.body)
    res.status(200).json({lowStockReportData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

adminReportsRouter.post('/distroReportData', async (req, res) => {
  try{
    const distroReportData = await distroReportDataQ(req.body)
    res.status(200).json({distroReportData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

adminReportsRouter.get('/getHosIdName', async (req, res) => {
  try {
    const hosIdNameData = await getHosIdNameQ()
    res.status(200).json(hosIdNameData)
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default adminReportsRouter