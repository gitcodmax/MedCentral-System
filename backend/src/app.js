import express from 'express';
import cors from 'cors';
import  getSavedHospitalsRouter  from './routes/admin_routes/rou_hospitals.js';

const app = express()

app.use(cors())
app.use(express.json())

app.use('/admin', getSavedHospitalsRouter)

export default app