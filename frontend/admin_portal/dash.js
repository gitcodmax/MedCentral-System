import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="page-title">
        <h2>Admin Dashboard</h2>
      </div> 
    `

  /**
 * MedCentral Admin Dashboard - Mock Data (Feb 2026)
 * This object can be used to hydrate the dashboard UI.
 */

  const AdminDashboardData = {
    // 1. TOP-LEVEL STATS (Summary Cards)
    stats: {
      totalHospitals: 24,
      totalInventoryItems: 1842,
      lowStockItems: 12,
      pendingOrders: 15,
      ordersInTransit: 8,
      completedOrders: 142
    },

    // 2. RECENT ORDERS (Table Data)
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