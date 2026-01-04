import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.js-dashboard-container')
    .innerHTML = `
      <nav class="sidebar"></nav>

      <main class="main-content">
        <header class="top-header">
          <img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">
        </header>

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
          <h2>Recently Delivered Orders</h2>
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
  renderSidebar()

  //Mock data for dash summary
  const summaryStats = {
    "totalPendingReview": 8,
    "totalToAssignClerk": 10,
    "totalToAssignDriver": 16
  }

  //Handles display of summary data in the dash
  document.querySelector('.js-orders-review')
    .innerText = summaryStats.totalPendingReview

  document.querySelector('.js-orders-assign-clerk')
    .innerText = summaryStats.totalToAssignClerk

  document.querySelector('.js-orders-assign-driver')
    .innerText = summaryStats.totalToAssignDriver

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Code for the stock alerts has been repeated in another file(inv_clerk)
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Mock data from the API for use in the stock alerts
  const inventory = {
    "PAR-500MG": {
      itemDetails: "Paracetamol 500mg(20 boxes)",
      stockLevel: "low" // Value sent from API: 'warning', 'low', 'critical', or 'healthy'
    },
    "AMX-250": {
      itemDetails: "Amoxicillin 250mg(5 bottles)",
      stockLevel: "critical"
    },
    "GLOV-LAT-M": {
      itemDetails: "Latex Gloves(10 cartons)",
      stockLevel: "warning"
    }
  };

  //Handles display of the stock alerts in the dash
  const alertsContainer = document.querySelector('.js-alerts-container')
  for (const item in inventory) {
    const itemDetails = inventory[item]
    alertsContainer.innerHTML += `
      <div class="alert-pill ${itemDetails['stockLevel']}-stock">${itemDetails['itemDetails']}</div>
    `
  }

  //Mock data for recently delivered orders
  const recentlyDeliveredOrders = [
    {
      "orderId": "ORD-0882",
      "hospitalName": "Aga Khan University Hospital",
      "creationDate": "2025-12-28",
      "deliveredOn": "2026-01-02"
    },
    {
      "orderId": "ORD-0875",
      "hospitalName": "The Nairobi Hospital",
      "creationDate": "2025-12-27",
      "deliveredOn": "2026-01-01"
    },
    {
      "orderId": "ORD-0860",
      "hospitalName": "Kenyatta National Hospital",
      "creationDate": "2025-12-24",
      "deliveredOn": "2025-12-28"
    },
    {
      "orderId": "ORD-0855",
      "hospitalName": "MediHeal Hospital",
      "creationDate": "2025-12-22",
      "deliveredOn": "2025-12-26"
    }
  ]

  recentlyDeliveredOrders.forEach((deliveredOrder) => {
    console.log(deliveredOrder)

    document.querySelector('tbody')
      .innerHTML += `
        <tr>
          <td>${deliveredOrder.hospitalName}</td>
          <td class="order-id">${deliveredOrder.orderId}</td>
          <td>${deliveredOrder.creationDate}</td>
          <td>${deliveredOrder.deliveredOn}</td>
          <td><span class="badge">DELIVERED</span></td>
        </tr>
      `
  })

})