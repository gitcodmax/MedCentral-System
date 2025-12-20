import { renderHeader } from "./header.js";

document.addEventListener('DOMContentLoaded', () => {
  renderHeader()

  document.querySelector('.js-container')
    .innerHTML = `

    <div class="filter-container">
      <div class="filter-group">
        <label for="search">Search</label>
        <input type="text" id="search" placeholder="Order ID, Hospital N...">
      </div>

      <div class="filter-group">
        <label for="date-type">Filter Date By</label>
        <select id="date-type">
          <option value="creationDate">Creation Date</option>
          <option value="packingDate">Packing Date</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="start-date">From</label>
        <input type="date" id="start-date">
      </div>

      <div class="filter-group">
        <label for="end-date">To</label>
        <input type="date" id="end-date">
      </div>

      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <button class="filter-btn" id="filter-btn">Apply Filter</button>
      <button class="clear-filter-btn" id="clear-filter-btn">Clear Filter</button>
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
        <tbody id="completedOrdersBody"></tbody>
    </table>
    <div class="no-match-container js-no-match-container">
      <p>No orders match the filters!!</p>
    </div>
    `

  const completedOrdersData = {
    "ORD-8821": {
      customerName: "St. Jude Medical Center",
      creationDate: "2025-12-15",
      packingDate: "2025-12-18",
      status: "PENDING"
    },
    "ORD-8822": {
      customerName: "City General Clinic",
      creationDate: "2025-12-16",
      packingDate: "2025-12-19",
      status: "SHIPPED"
    },
    "ORD-8823": {
      customerName: "Hope Children's Hospital",
      creationDate: "2025-12-18",
      packingDate: "2025-12-20",
      status: "DELIVERED"
    }
  }

  //Completed orders table body
  const body = document.getElementById('completedOrdersBody');
  //Display the orders in the table
  function renderCompletedOrders() {

    const emptyState = document.getElementById('emptyState');
    const entries = Object.entries(completedOrdersData);

    if (entries.length === 0) {
      body.parentElement.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    displayOrders(body, entries)
  }

  //The container that appears when there is no order found by filtering
  document.querySelector('.js-no-match-container').classList.add('hidden')

  //Setting the filtering functionality
  const applyBtn = document.getElementById('filter-btn')
  const clearFilterBtn = document.getElementById('clear-filter-btn')
  const searchInput = document.getElementById('search')
  const dateType = document.getElementById('date-type')
  const startDate = document.getElementById('start-date')
  const endDate = document.getElementById('end-date')
  const statusFilter = document.getElementById('status')

  //Set the button to filter orders
  applyBtn.addEventListener('click', () => {
    const searchValue = searchInput.value.trim().toLowerCase()
    const dateTypeValue = dateType.value
    const startDateValue = startDate.value
    const endDateValue = endDate.value
    const statusValue = statusFilter.value

    const filteredResults = Object.entries(completedOrdersData).filter(([orderId, details]) => {
      //Checks whether the order id or customer name matches any of the values
      const matchesSearch = orderId.toLowerCase().includes(searchValue)
        || details.customerName.toLowerCase().includes(searchValue)

      //Checks the date type chosen and filters the date depending
      //  on the date type and start and end date
      const orderTargetDate = details[dateTypeValue]
      let matchesDate = true

      if (startDateValue && orderTargetDate < startDateValue) {
        matchesDate = false
      }
      if (endDateValue && orderTargetDate > endDateValue) {
        matchesDate = false
      }

      //Checks the status selected and returns the one that matches
      const matchesStatus = (statusValue === 'all')
        || (details.status.toLowerCase() === statusValue)

      //Result should contain both the values as true
      return matchesSearch && matchesDate && matchesStatus
    })

    if (filteredResults.length > 0) {
      displayOrders(body, filteredResults)
    } else {
      body.innerHTML = '';
      document.querySelector('.js-no-match-container').classList.remove('hidden')
    }
  })

  //Populates the completed orders table with the necessary info
  function displayOrders(body, orders) {
    body.innerHTML = '';
    orders.forEach(([id, info]) => {
      const row = `
            <tr>
                <td class="order-id"><strong>${id}</strong></td>
                <td>${info.customerName}</td>
                <td>${info.creationDate}</td>
                <td>${info.packingDate}</td>
                <td><span class="status-badge">${info.status}</span></td>
            </tr>
        `;
      body.innerHTML += row;
    })
  }

  //Set the button to clear the filtering details
  clearFilterBtn.addEventListener('click', () => {
    if (document.querySelector('.js-no-match-container')) {
      document.querySelector('.js-no-match-container').classList.add('hidden')
    }
    searchInput.value = ''
    dateType.selectedIndex = 0
    startDate.value = ''
    endDate.value = ''
    statusFilter.selectedIndex = 0

    renderCompletedOrders()
  })


  renderCompletedOrders();
})