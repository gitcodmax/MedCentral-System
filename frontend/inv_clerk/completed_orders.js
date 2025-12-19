import { renderHeader } from "./header.js";

document.addEventListener('DOMContentLoaded', () => {
  renderHeader()

  document.querySelector('.js-container')
    .innerHTML = `

    <div class="filter-bar">
      <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" placeholder="Search by Hospital or Order ID..." onkeyup="filterOrders()">
      </div>
      <div class="date-filter">
          <label for="dateFilter">Filter by Creation Date:</label>
          <input type="date" id="dateFilter" onchange="filterOrders()">
      </div>
      <button class="reset-btn" onclick="resetFilters()">Clear Filters</button>
    </div>
    
    <div class="header">
        <h1 class="title"><i class="fas fa-clipboard-check"></i> Completed Orders</h1>
    </div>

    <table id="completedTable">
        <thead>
            <tr>
                <th>Order ID</th>
                <th>Hospital Name</th>
                <th>Created On</th>
                <th>Packed On</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody id="completedOrdersBody">
            </tbody>
    </table>
    
    <div id="emptyState" class="empty-state" style="display: none;">
        <i class="fas fa-archive" style="font-size: 3rem; margin-bottom: 10px;"></i>
        <p>No completed orders found in this session.</p>
    </div>
    `

  renderCompletedOrders();
})

// This would ideally be stored in localStorage or a database
// For now, it imitates the object structure you requested
const completedOrdersData = {
  "ORD-8820": {
    customerName: "Memorial Clinic",
    orderDate: "2025-12-18",
    dispatchDate: "2025-12-19",
    packedOn: "2025-12-20",
    items: [
      { itemName: "Surgical Masks", sku: "MASK-SURG", batchNumber: "M991", quantityToPack: 200, unitOfMeasure: "BOX" }
    ]
  }, 
    "ORD-8821": {
    customerName: "Memorial Clinic",
    orderDate: "2025-12-18",
    dispatchDate: "2025-12-19",
    packedOn: "2025-12-19",
    items: [
      { itemName: "Surgical Masks", sku: "MASK-SURG", batchNumber: "M991", quantityToPack: 200, unitOfMeasure: "BOX" }
    ]
  }
};

//Display the orders in the table
function renderCompletedOrders() {
  const body = document.getElementById('completedOrdersBody');
  const emptyState = document.getElementById('emptyState');
  const entries = Object.entries(completedOrdersData);

  if (entries.length === 0) {
    body.parentElement.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  body.innerHTML = '';

  entries.forEach(([orderId, details]) => {
    const row = `
            <tr>
                <td class="order-id"><strong>${orderId}</strong></td>
                <td>${details.customerName}</td>
                <td>${details.dispatchDate}</td>
                <td>${details.packedOn}</td>
                <td><span class="status-badge">AWAITING DISPATCH</span></td>
            </tr>
        `;
    body.innerHTML += row;
  });
}