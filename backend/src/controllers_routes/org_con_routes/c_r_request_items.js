import express from "express";
import { getProductCatalogDataQ } from "../../repositories/org_repo/rep_request_items.js";

const orgPortalRouter = express.Router()

orgPortalRouter.get('/getProductCatalogData', async (req, res) => {
  try{
    const getProductCatalogData = await getProductCatalogDataQ()
    res.status(200).json(getProductCatalogData)
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

export default orgPortalRouter