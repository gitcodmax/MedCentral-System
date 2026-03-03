import { getSavedHospitalsQ } from "../../repositories/admin_repo/rep_hospitals.js";

export async function getSavedHospitals(req, res){
  try{
    const savedHos = await getSavedHospitalsQ()
    res.status(200).json({savedHos})
  }catch(err){
    res.status(500).json({Error: err.message})
  }
}