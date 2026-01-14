import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "./overlay.js";

document.addEventListener('DOMContentLoaded', () => {

  //Paid orders mock up date
  const paidOrdersObj =
  {
    "paidOrders": [
      {
        "orderId": "ORD-2026-102",
        "institutionName": "Aga Khan University Hospital",
        "itemsCount": "2 Items",
        "paymentDate": "Today, 07:30 AM",
        "items": [
          { "sku": "MED-001-P", "name": "Paracetamol 500mg", "location": "Shelf A-12", "quantityUOM": "50 Boxes", "batchNo": "AOU123" },
          { "sku": "GS-992-M", "name": "Surgical Gloves (M)", "location": "Shelf C-04", "quantityUOM": "180 Pairs", "batchNo": "AOU124" }
        ]
      },
      {
        "orderId": "ORD-2026-108",
        "institutionName": "The Nairobi Hospital",
        "itemsCount": "4 Items",
        "paymentDate": "Today, 06:15 AM",
        "items": [
          { "sku": "IV-FL-09", "name": "Saline Solution 500ml", "location": "Shelf D-01", "quantityUOM": "40 Vials", "batchNo": "AOU125" },
          { "sku": "SYR-10-ML", "name": "10ml Syringes", "location": "Shelf B-05", "quantityUOM": "100 Units", "batchNo": "AOU126" },
          { "sku": "BDG-EL-02", "name": "Elastic Bandages", "location": "Shelf E-10", "quantityUOM": "15 Rolls", "batchNo": "AOU127" },
          { "sku": "ANT-SP-04", "name": "Antiseptic Spray", "location": "Shelf D-08", "quantityUOM": "5 Bottles", "batchNo": "AOU128" }
        ]
      },
      {
        "orderId": "ORD-2026-112",
        "institutionName": "Mater Misericordiae Hospital",
        "itemsCount": "3 Items",
        "paymentDate": "Yesterday, 04:45 PM",
        "items": [
          { "sku": "MSK-N95-01", "name": "N95 Respirator Masks", "location": "Shelf F-02", "quantityUOM": "200 Pieces", "batchNo": "AOU129" },
          { "sku": "THRM-DIG-05", "name": "Digital Thermometers", "location": "Shelf G-01", "quantityUOM": "10 Units", "batchNo": "AOU130" },
          { "sku": "BPC-MAN-09", "name": "Manual BP Cuffs", "location": "Shelf G-05", "quantityUOM": "3 Sets", "batchNo": "AOU131" }
        ]
      },
      {
        "orderId": "ORD-2026-105",
        "institutionName": "Kenyatta National Hospital",
        "itemsCount": "1 Item",
        "paymentDate": "Jan 04, 03:30 PM",
        "items": [
          { "sku": "SYR-50-L", "name": "Luer Lock Syringes", "location": "Shelf B-02", "quantityUOM": "10 Units", "batchNo": "AOU132" }
        ]
      }
    ],
    "clerks": [
      { "clerkId": "CLK-01", "name": "Peter", "activeTasks": 3 },
      { "clerkId": "CLK-02", "name": "Sarah", "activeTasks": 0 },
      { "clerkId": "CLK-03", "name": "James", "activeTasks": 5 }
    ]
  }

  const paidOrders = Object.values(paidOrdersObj['paidOrders'])
  const paidOrdersFragment = document.createDocumentFragment()
  console.log(paidOrders.length)

  document.querySelector('.page-container')
    .innerHTML = `      
    <nav class="sidebar"></nav>

    <main class="main-content">
      <header class="logo-container"></header>

      <div class="page-title">
        <h2>Assign for Packaging</h2>
        <p>Select a clerk to fulfill these paid orders.</p>
      </div>
      <div class="status-indicator">
        <span class="dot pulse"></span> ${paidOrders.length} Orders Awaiting Assignment
      </div>

      <section class="assignment-section">
        <table class="assignment-table">
          <thead>
            <tr>
              <th>Order Details</th>
              <th>Items</th>
              <th>Payment Date</th>
              <th>Select Clerk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody class="js-assignment-tbody"></tbody>
        </table>

        <div class="overlay"></div>
      </section>
    </main>
  
    `
  renderSidebar()

  paidOrders.forEach((order) => {

    const tableRow = document.createElement('tr');
    tableRow.className = 'assignment-row'

    tableRow.innerHTML = `     
      <td>
        <div class="hospital-info">
          <strong>${order.institutionName}</strong>
          <span>#${order.orderId}</span>
        </div>
      </td>
      <td>
        <div class="workload-info">
          <button class="view-items-btn js-view-items-btn" data-order-id=${order.orderId}>
            <i class="fas fa-box"></i>
            <span class="items-container">${order.itemsCount} </span>
            <span class="view-items">View Items</span>
          </button>
        </div>
      </td>
      <td>
        <div class="payment-status">
          <span class="paid-timestamp">${order.paymentDate}</span>
          <span class="verified-badge">PAID</span>
        </div>
      </td>
      <td>
        <select class="clerk-select js-clerk-select-${order.orderId}">
          <option value="">Choose Clerk...</option>
        </select>
      </td>
      <td>
        <button class="btn-assign" onclick="assignOrder('ORD-2025-99')">
          Assign Task
        </button>
      </td>
    `

    paidOrdersFragment.appendChild(tableRow)
  })

  //Append the fragment to the page
  document.querySelector('.js-assignment-tbody')
    .appendChild(paidOrdersFragment)

  paidOrders.forEach(order => {
    displayClerks(order.orderId)
  })

  //Displays the options for the clerk to choose
  function displayClerks(orderId) {
    const clerks = Object.values(paidOrdersObj['clerks'])

    clerks.forEach(clerk => {
      document.querySelector(`.js-clerk-select-${orderId}`)
        .innerHTML += `
          <option id=${clerk.clerkId}>${clerk.name} (${clerk.activeTasks} active tasks)</option>
      `
    })
  }

  //Controls how the overlay for items details preview is displayed
  const overlay = document.querySelector('.overlay')
  const viewItemsBtns = document.querySelectorAll('.js-view-items-btn')

  paidOrders.forEach(order => {
    const items = order['items']

    viewItemsBtns.forEach(btn => {
      if (order.orderId === btn.dataset.orderId) {
        btn.addEventListener('click', () => {

          overlay.innerHTML = `
            <div class="items-preview-container">
              <div class="header-close-container">
                <div class="preview-header">
                  <h3>Items in Order #<span class="order-id">${btn.dataset.orderId}</span></h3>
                </div>

                <div>
                  <button class="close-overlay-btn js-close-overlay-btn">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <table class="items-detail-table">
                <thead>
                  <tr>
                    <th>ITEM DESCRIPTION</th>
                    <th>STORAGE LOCATION</th>
                    <th>BATCH/LOT NO</th>
                    <th>REQUESTED QTY</th>
                  </tr>
                </thead>
                <tbody class="js-items-tbody"></tbody>
              </table>
            </div>
          `

          overlay.classList.add('active')

          //Display the items in the overlay
          const itemsFragment = document.createDocumentFragment()

          items.forEach(item => {
            const itemsTableRow = document.createElement('tr')
            itemsTableRow.innerHTML = `
              <td>
                <div class="item-name">${item.name}</div>
                <small class="item-sku">SKU: ${item.sku}</small>
              </td>
              <td>
                <span class="location-badge">${item.location}</span>
              </td>
              <td> <span class="batch-no-badge">${item.batchNo}</span></td>
              <td><strong>${item.quantityUOM}</strong></td>
            `

            itemsFragment.appendChild(itemsTableRow)
          })

          document.querySelector('.js-items-tbody')
            .appendChild(itemsFragment)
          
          xRemoveOverlay(overlay)
        })
      }
    })
  })


  clickToRemoveOverlay(overlay)
})