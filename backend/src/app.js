import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import adminHosRouter from './controllers_routes/admin_con_routes/c_r_hospitals.js';
import adminInvRouter from './controllers_routes/admin_con_routes/c_r_inventory.js';
import adminUsersRouter from './controllers_routes/admin_con_routes/c_r_users.js';

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend assets (HTML, CSS, JS)
// To access the frontend pages use "http://localhost:<port>/admin_portal/hospitals.html"
const frontendPath = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

app.use(cors());
app.use(express.json());

app.use('/admin', adminHosRouter, adminInvRouter, adminUsersRouter);

export default app;