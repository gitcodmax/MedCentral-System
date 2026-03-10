import express from "express";
import { invReportDataQ } from "../../repositories/admin_repo/rep_reports.js";

const adminReportsRouter = express.Router()

adminReportsRouter.get('/invReportData', async (req, res) => {
  try{
    const invReportData = await invReportDataQ()
    res.status(200).json({invReportData})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

export default adminReportsRouter