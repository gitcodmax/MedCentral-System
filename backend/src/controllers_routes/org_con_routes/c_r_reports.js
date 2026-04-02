import express from 'express';
import { getItemConsumptionReportDataQ } from '../../repositories/org_repo/rep_reports.js';

const orgReportsRouter = express.Router()

orgReportsRouter.post('/getItemConsumptionReportData', async (req, res) => {
  try {
    const itemConsumptionData = await getItemConsumptionReportDataQ(req.body.hosId)
    res.status(200).json({itemConsumptionData})
  } catch (e) {
    res.status(500).json({Error: e.message})
  }
})

export default orgReportsRouter