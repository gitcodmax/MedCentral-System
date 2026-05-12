import express from "express";
import { distroReportDataQ, invReportDataQ, lowStockReportDataQ } from "../../repositories/admin_repo/rep_reports.js";

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

adminReportsRouter.get('/distroReportData', async (req, res) => {
  try{
    const distroReportData = await distroReportDataQ()
    res.status(200).json({distroReportData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

export default adminReportsRouter