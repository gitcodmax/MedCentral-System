import { orgPortalPagesLink } from "../global.js";
import { renderSidebar } from "./sidebar.js";

export const hosId = Number(sessionStorage.getItem('hosId'))

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.app-container')
    .innerHTML = `
    <nav class="sidebar js-sidebar"></nav>

    <main class="main-content">
      <div class="main-content-logo"></div>

      <div class="dashboard-wrapper">
        <div class="welcome-section">
          <h2>Procurement Dashboard</h2>
          <p>Overview of your medical supply requests and delivery statuses.</p>
        </div>

        <div class="metrics-grid">
          <div class="metric-card total-ord">
            <div class="metric-info">
              <span class="label">Total Orders</span>
              <span class="value js-total-ord-value"></span>
            </div>
            <i class="fas fa-box-archive m-icon"></i>
          </div>
          <div class="metric-card pending">
            <div class="metric-info">
              <span class="label">Pending</span>
              <span class="value js-pending-value"></span>
            </div>
            <i class="fas fa-clock m-icon"></i>
          </div>
          <div class="metric-card dispatched">
            <div class="metric-info">
              <span class="label">In Transit</span>
              <span class="value js-dispatched-value"></span>
            </div>
            <i class="fas fa-truck-fast m-icon"></i>
          </div>
          <div class="metric-card delivered">
            <div class="metric-info">
              <span class="label">Completed</span>
              <span class="value js-delivered-value"></span>
            </div>
            <i class="fas fa-circle-check m-icon"></i>
          </div>
        </div>

        <div class="dashboard-body">
          <div class="card chart-card">
            <div class="card-header">
              <h3>Order Status Chart</h3>
            </div>
            <canvas id="ordersChart"></canvas>
          </div>

          <div class="card table-card">
            <div class="card-header">
              <h3>Recent Orders</h3>
              <a href="/org_portal/ord_history.html" class="btn-link">
                <button class="view-all-btn">View All</button>
              </a>
            </div>
            <table class="recent-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Creation Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody class="js-recent-orders-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  `

  renderSidebar('dash')
  const hospitalDashboardData = await getOrgDashData(hosId)

  //Display quick analytics in the dash
  document.querySelector('.js-total-ord-value')
    .textContent = hospitalDashboardData.metrics.total_orders
  document.querySelector('.js-pending-value')
    .textContent = hospitalDashboardData.metrics.pending
  document.querySelector('.js-dispatched-value')
    .textContent = hospitalDashboardData.metrics.in_transit
  document.querySelector('.js-delivered-value')
    .textContent = hospitalDashboardData.metrics.delivered

  //Creating the order status chart
  const ctx = document.getElementById('ordersChart');
  if (typeof Chart === 'undefined') {
    return;
  }
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Rejected', 'Approved', 'Completed'],
      datasets: [{
        label: 'Orders',
        data: hospitalDashboardData.ordersStatusDistroData,
        backgroundColor: [
          '#DC3545', '#007BFF', '#157347'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })

  //Display the recent orders in the recent orders card
  const recentOrdersTableFragment = document.createDocumentFragment()
  const { recentOrders } = hospitalDashboardData
  recentOrders.forEach(order => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.creationDate}</td>
      <td><span class="badge-pill b-${order.status.toLowerCase()}">${order.status}</span></td>
    `

    recentOrdersTableFragment.appendChild(tblRow)
  })
  document.querySelector('.js-recent-orders-tbody')
    .appendChild(recentOrdersTableFragment)
})

const getOrgDashData = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getOrgDashData`, 
    {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({hosId})
    }
  )

  const res = await response.json()
  return res.dashboard_data
}

export const getHospName = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getHospName`, 
    {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({hosId})
    }
  )

  const res = await response.json()
  return res.name
}