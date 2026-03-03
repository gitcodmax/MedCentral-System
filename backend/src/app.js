import express from 'express';
import cors from 'cors';
import adminHosRouter from './controllers_routes/admin_con_routes/c_r_hospitals.js';

const app = express()

app.use(cors())
app.use(express.json())

app.use('/admin', adminHosRouter)

export default app