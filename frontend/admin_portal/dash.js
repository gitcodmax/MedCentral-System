import { adminPagesLink } from "../global.js";
import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `   
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <main class="content">
        <div class="cards-grid">
          <div class="stat-card total-hosp-card">
            <div class="card-header">
              <div class="card-icon icon-blue"><i class="fas fa-hospital"></i></div>
              <h3 id="totalHospitals"></h3>
            </div>
            <p>Total Hospitals</p>
          </div>

          <div class="stat-card card-inventory">
            <div class="card-header">
              <div class="card-icon icon-green"><i class="fas fa-boxes"></i></div>
              <h3 id="inventoryItems"></h3>
            </div>
            <p>Inventory Items</p>
          </div>

          <div class="stat-card low-stock-card">
            <div class="card-header">
              <div class="card-icon icon-red"><i class="fas fa-exclamation-triangle"></i></div>
              <h3 id="lowStockItems"></h3>
            </div>
            <p>Low Stock Items</p>
          </div>

          <div class="stat-card pending-card">
            <div class="card-header">
              <div class="card-icon icon-pending"><i class="fas fa-clock"></i></div>
              <h3 id="pendingOrders"></h3>
            </div>
            <p>Pending Orders</p>
          </div>

          <div class="stat-card in-transit-card">
            <div class="card-header">
              <div class="card-icon icon-in-transit"><i class="fas fa-truck-loading"></i></div>
              <h3 id="ordInTransit"></h3>
            </div>
            <p>Packages in Transit</p>
          </div>

          <div class="stat-card completed-ord-card">
            <div class="card-header">
              <div class="card-icon icon-green-alt"><i class="fas fa-check-circle"></i></div>
              <h3 id="completedOrders"></h3>
            </div>
            <p>Completed Orders</p>
          </div>
        </div>

        <div class="dashboard-row">
          <section class="section-card">
            <div class="section-title">
              Recent Orders
              <a href="/admin_portal/orders.html" class="view-all-orders-link">
                View All
              </a>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Hospital Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="recentOrdersTbody"></tbody>
            </table>
          </section>

          <section class="section-card" id="lowStockCard">
            <div class="section-title">Low Stock Alerts</div>
          </section>
        </div>
      </main>
    </div>
    `

  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="page-title">
        <h2>Admin Dashboard</h2>
      </div> 
    `

  const adminDashData = await getDashData()

  document.getElementById('totalHospitals')
    .textContent = adminDashData.stats.total_hospitals
  document.getElementById('inventoryItems')
    .textContent = adminDashData.stats.total_inventory_items
  document.getElementById('lowStockItems')
    .textContent = adminDashData.stats.low_stock_items
  document.getElementById('pendingOrders')
    .textContent = adminDashData.stats.pending_orders
  document.getElementById('ordInTransit')
    .textContent = adminDashData.stats.packages_in_transit
  document.getElementById('completedOrders')
    .textContent = adminDashData.stats.completed_orders

  // Display the recent orders
  const recentOrdersTblFrag = document.createDocumentFragment()
  adminDashData.recentOrders.forEach(ord => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td class="ord-id">${ord.order_id}</td>
      <td>${ord.hospital_name}</td>
      <td>${ord.order_date}</td>
    `

    recentOrdersTblFrag.appendChild(tblRow)
  })
  document.getElementById('recentOrdersTbody')
    .appendChild(recentOrdersTblFrag)

  // Display the items with low stocks
  const lowStocksAlertsCardFrag = document.createDocumentFragment()
  adminDashData.lowStockAlerts.forEach(item => {
    const itemDivContainer = document.createElement('div')
    itemDivContainer.classList = 'alert-item'

    itemDivContainer.innerHTML = `
      <div class="alert-info">
        <p>${item.item_name}</p>
        <span>Min Req: ${item.min_required} ${item.unit}</span>
      </div>
      <div class="stock-badge">${item.current_stock}</div>
    `

    lowStocksAlertsCardFrag.appendChild(itemDivContainer)
  })

  document.getElementById('lowStockCard')
    .appendChild(lowStocksAlertsCardFrag)
})

async function getDashData(){
  const response = await fetch(`${adminPagesLink}/getAdminDashData`)
  const res = await response.json()
  return res.adminDashData.admin_dash_data
}