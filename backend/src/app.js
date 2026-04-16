import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import adminHosRouter from './controllers_routes/admin_con_routes/c_r_hospitals.js';
import adminInvRouter from './controllers_routes/admin_con_routes/c_r_inventory.js';
import adminUsersRouter from './controllers_routes/admin_con_routes/c_r_users.js';
import adminOrdersRouter from './controllers_routes/admin_con_routes/c_r_orders.js';
import adminReportsRouter from './controllers_routes/admin_con_routes/c_r_reports.js';
import orgPortalRouter from './controllers_routes/org_con_routes/c_r_request_items.js';
import loginRouter from './controllers_routes/c_r_login.js';
import receiveItemsRouter from './controllers_routes/org_con_routes/c_r_receive_items.js';
import ordHistoryRouter from './controllers_routes/org_con_routes/c_r_ord_history.js';
import orgReportsRouter from './controllers_routes/org_con_routes/c_r_reports.js';
import orgDashRouter from './controllers_routes/org_con_routes/c_r_dash.js';
import reviewReqRouter from './controllers_routes/wh_manager_con_routes/c_r_review_requests.js';
import orgPortalPaymentsRouter from './controllers_routes/org_con_routes/c_r_payments.js';
import clerkAssignmentRouter from './controllers_routes/wh_manager_con_routes/c_r_assign_to_clerk.js';
import assignDriverRouter from './controllers_routes/wh_manager_con_routes/c_r_assign_to_driver.js';
import allOrdersRouter from './controllers_routes/wh_manager_con_routes/c_r_all_orders.js';
import { standardsRouter } from './controllers_routes/wh_manager_con_routes/c_r_standards.js';
import { itemRegistryRouter } from './controllers_routes/wh_manager_con_routes/c_r_item_registry.js';
import { whLayoutRouter } from './controllers_routes/wh_manager_con_routes/c_r_wh_layout.js';
import { whManagerDashRouter } from './controllers_routes/wh_manager_con_routes/c_r_wh_manager_dash.js';

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

app.use('/admin', 
  adminHosRouter, adminInvRouter, 
  adminUsersRouter, adminOrdersRouter, 
  adminReportsRouter
);

app.use('/login', loginRouter)

app.use('/org', 
  orgPortalRouter, receiveItemsRouter,
  ordHistoryRouter, orgReportsRouter, 
  orgDashRouter, orgPortalPaymentsRouter
)

app.use('/whManager', 
  reviewReqRouter, clerkAssignmentRouter, 
  assignDriverRouter, allOrdersRouter, 
  standardsRouter, itemRegistryRouter, 
  whLayoutRouter, whManagerDashRouter
)

export default app;