import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {

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
            <p>Orders in Transit</p>
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
              <button class="view-all-orders-btn">
                View All
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Hospital Name</th>
                  <th>Status</th>
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

  const AdminDashboardData = {
    stats: {
      totalHospitals: 24,
      totalInventoryItems: 1842,
      lowStockItems: 12,
      pendingOrders: 15,
      ordersInTransit: 8,
      completedOrders: 142
    },

    recentOrders: [
      {
        id: "ORD-8821",
        hospital: "General Medical Center",
        status: "Dispatched",
        date: "Feb 15, 2026",
        amount: 1250.00
      },
      {
        id: "ORD-8819",
        hospital: "St. Jude's Hospital",
        status: "Pending",
        date: "Feb 15, 2026",
        amount: 430.50
      },
      {
        id: "ORD-8815",
        hospital: "City Children's Clinic",
        status: "Packed",
        date: "Feb 14, 2026",
        amount: 2100.00
      },
      {
        id: "ORD-8810",
        hospital: "Westside Trauma Unit",
        status: "Completed",
        date: "Feb 14, 2026",
        amount: 890.25
      }
    ],

    lowStockAlerts: [
      {
        itemName: "Latex Gloves (L)",
        currentStock: 120,
        minRequired: 500,
        unit: "Boxes"
      },
      {
        itemName: "Surgical Masks",
        currentStock: 450,
        minRequired: 2000,
        unit: "Units"
      },
      {
        itemName: "Insulin Vials",
        currentStock: 12,
        minRequired: 100,
        unit: "Vials"
      },
      {
        itemName: "Saline Solution (500ml)",
        currentStock: 85,
        minRequired: 300,
        unit: "Bags"
      }
    ]
  };

  document.getElementById('totalHospitals')
    .textContent = AdminDashboardData.stats.totalHospitals
  document.getElementById('inventoryItems')
    .textContent = AdminDashboardData.stats.totalInventoryItems
  document.getElementById('lowStockItems')
    .textContent = AdminDashboardData.stats.lowStockItems
  document.getElementById('pendingOrders')
    .textContent = AdminDashboardData.stats.pendingOrders
  document.getElementById('ordInTransit')
    .textContent = AdminDashboardData.stats.ordersInTransit
  document.getElementById('completedOrders')
    .textContent = AdminDashboardData.stats.completedOrders

  // Display the recent orders
  const recentOrdersTblFrag = document.createDocumentFragment()
  AdminDashboardData.recentOrders.forEach(ord => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td class="ord-id">${ord.id}</td>
      <td>${ord.hospital}</td>
      <td><span class="status-pill status-${ord.status.toLowerCase()}">${ord.status}</span></td>
      <td>${ord.date}</td>
    `

    recentOrdersTblFrag.appendChild(tblRow)
  })
  document.getElementById('recentOrdersTbody')
    .appendChild(recentOrdersTblFrag)

  // Display the items with low stocks
  const lowStocksAlertsCardFrag = document.createDocumentFragment()
  AdminDashboardData.lowStockAlerts.forEach(item => {
    const itemDivContainer = document.createElement('div')
    itemDivContainer.classList = 'alert-item'

    itemDivContainer.innerHTML = `
      <div class="alert-info">
        <p>${item.itemName}</p>
        <span>Min Req: ${item.minRequired} ${item.unit}</span>
      </div>
      <div class="stock-badge">${item.currentStock}</div>
    `

    lowStocksAlertsCardFrag.appendChild(itemDivContainer)
  })

  document.getElementById('lowStockCard')
    .appendChild(lowStocksAlertsCardFrag)
})