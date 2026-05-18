import { whManagerPagesLink } from "../global.js"
import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.js-dashboard-container')
    .innerHTML = `
      <nav class="sidebar"></nav>

      <main class="main-content">
        <header class="logo-container"></header>

        <section class="welcome">
          <h1>Hello John</h1>
          <p>Welcome back to the dashboard. Here is what needs your attention.</p>
        </section>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number js-orders-review"></span>
            <span class="stat-label">Orders for Review</span>
          </div>
          <div class="stat-card">
            <span class="stat-number js-orders-assign-clerk"></span>
            <span class="stat-label">To Assign (Packaging)</span>
          </div>
          <div class="stat-card">
            <span class="stat-number js-orders-assign-driver"></span>
            <span class="stat-label">To Assign (Dispatch)</span>
          </div>
        </div>

        <section class="stock-alerts">
          <div class="card-title-container">
            <h2>Stock Alerts</h2>
            <div class="alert-key">
              <span class="key-item">
                <span class="key-color yellow"></span> Warning
              </span>
              <span class="key-item">
                <span class="key-color orange"></span> Low
              </span>
              <span class="key-item">
                <span class="key-color red"></span> Critical
              </span>
            </div>
          </div>
          <div class="alerts-container js-alerts-container"></div>
        </section>

        <section class="recent-orders">
          <h2>Recently Delivered Order Packages</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Order ID</th>
                <th>Creation Date</th>
                <th>Delivered On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </section>
      </main>
    `
  
  //Function to render the sidebar
  renderSidebar('wh_manager_dash')

  const dashData = await getWhManagerDashData()

  // Summary Stats
  const { summaryStats } = dashData

  //Handles display of summary data in the dash
  document.querySelector('.js-orders-review')
    .innerText = summaryStats.totalPendingReview

  document.querySelector('.js-orders-assign-clerk')
    .innerText = summaryStats.totalToAssignClerk

  document.querySelector('.js-orders-assign-driver')
    .innerText = summaryStats.totalToAssignDriver

  // Stock alerts
  const { inventory } = dashData;

  //Handles display of the stock alerts in the dash
  const alertsContainer = document.querySelector('.js-alerts-container')
  for (const item in inventory) {
    const itemDetails = inventory[item]
    alertsContainer.innerHTML += `
      <div class="alert-pill ${itemDetails['stockLevel']}-stock">${itemDetails['itemDetails']}</div>
    `
  }

  // Recently delivered order packages
  const {recentlyDeliveredOrders} = dashData

  recentlyDeliveredOrders.forEach((deliveredOrder) => {

    document.querySelector('tbody')
      .innerHTML += `
        <tr>
          <td>${deliveredOrder.hospitalName}</td>
          <td class="order-id">${deliveredOrder.orderId}</td>
          <td>${deliveredOrder.creationDate}</td>
          <td>${deliveredOrder.deliveredOn}</td>
          <td><span class="dash-deliv-badge">DELIVERED</span></td>
        </tr>
      `
  })

})

const getWhManagerDashData = async () => {
  const response = await fetch(`${whManagerPagesLink}/getWhManagerDashData`)
  const res = await response.json()
  return res.wh_dash_data
}

// Send inventory stock alerts to inventory clerk page
export const inventoryAlerts = async () => {
  const dashData = await getWhManagerDashData()
  return dashData.inventory
}