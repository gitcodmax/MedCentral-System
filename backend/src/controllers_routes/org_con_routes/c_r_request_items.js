import express from "express";
import { getProductCatalogDataQ, getAllDeptQ, getHospCartItemsQ, getNoHospCartItemsQ, updateCartItemsQ, deleteCartItemQ, updateCartItemsToRequestQ, saveItemToCartQ } from "../../repositories/org_repo/rep_request_items.js";

const orgPortalRouter = express.Router()

orgPortalRouter.get('/getProductCatalogData', async (req, res) => {
  try{
    const getProductCatalogData = await getProductCatalogDataQ()
    res.status(200).json(getProductCatalogData)
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

// Order Summary / Cart
orgPortalRouter.get('/getAllDept', async (req, res) => {
  try{
    const allDept = await getAllDeptQ()
    res.status(200).json(allDept)
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

orgPortalRouter.post('/getHospCartItems', async (req, res) => {
  try{
    const hosCartItems = await getHospCartItemsQ(req.body.hosId)
    res.status(200).json(hosCartItems)
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

orgPortalRouter.post('/getNoHospCartItems', async (req, res) => {
  try{
    const noHospCartItems = await getNoHospCartItemsQ(req.body.hosId)
    res.status(200).json(noHospCartItems)
  }catch(err){
    res.status(500).json({Error: err.message})
  }
})

orgPortalRouter.put('/updateCartItems', async (req, res) => {
  try{
    await updateCartItemsQ(req.body)
    res.status(200).json({msg: 'success'})
  }catch(e){
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

orgPortalRouter.delete('/deleteCartItem', async (req, res) => {
  try {
    await deleteCartItemQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (err) {
    res.status(500).json({msg: 'error', Error: err.message})
  }
})

// Update the cart items to become a request awaiting approval
orgPortalRouter.post('/updateCartItemsToRequest', async (req, res) => {
  try {
    await updateCartItemsToRequestQ(req.body)
    res.status(200).json({msg: 'success'})
  } catch (e) {
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

// PRODUCT CATALOG PAGE
orgPortalRouter.post('/saveItemToCart', async (req, res) => {
  try {
    await saveItemToCartQ(req.body)
    res.status(200).json({ msg: 'success'})
  } catch (e){
    res.status(500).json({msg: 'error', Error: e.message})
  }
})

export default orgPortalRouter