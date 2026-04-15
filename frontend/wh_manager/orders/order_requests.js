import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { whManagerPagesLink } from "../../global.js";

dayjs.extend(window.dayjs_plugin_isBetween);

document.addEventListener('DOMContentLoaded', async () => {

  //Render the page content
  document.querySelector('.page-container')
    .innerHTML = `
      
      <nav class="sidebar"></nav>

      <div class="master-container">
        <header class="logo-container"></header>

        <div class="log-header">
          <h2><i class="fas fa-archive"></i> Orders Log</h2>
          <div class="log-stats">
            <div class="stat-card"><span>Total Orders:</span> 
              <strong class="js-no-total-orders"></strong>
            </div>
            <div class="stat-card"><span>Total Packages:</span> 
              <strong class="blue js-no-total-pkg"></strong>
            </div>
            <div class="stat-card"><span>Completed:</span> 
              <strong class="green js-no-total-delivered"></strong>
            </div>
          </div>
        </div>

        <div class="filter-dashboard">
          <div class="filter-row">
            <div class="filter-group flex-2">
              <label>Search Order</label>
              <div class="input-with-icon">
                <i class="fas fa-search"></i>
                <input type="text" id="masterSearch" 
                placeholder="Search Order ID or Institution Name...">
              </div>
            </div>

            <div class="filter-group flex-1">
              <label>Delivery Status</label>
              <select id="deliveryFilter">
                <option value="all">All Statuses</option>
                <option value="yes">Delivered (Yes)</option>
                <option value="no">Not Delivered (No)</option>
              </select>
            </div>
          </div>

          <div class="filter-row date-row">
            <div class="filter-group">
              <label>Filter by Date Type</label>
              <div class="toggle-container">
                <input type="radio" id="dateCreate" name="dateType" value="creationDate">
                <label for="dateCreate">Creation Date</label>

                <input type="radio" id="datePay" name="dateType" value="paymentDate">
                <label for="datePay">Payment Date</label>
              </div>
            </div>

            <div class="filter-group flex-1">
              <label>From</label>
              <input type="date" id="startDate">
            </div>

            <div class="filter-group flex-1">
              <label>To</label>
              <input type="date" id="endDate">
            </div>

            <div class="filter-actions">
              <p class="results-label">Showing <span class="no-of-results">0</span> Results</p>
              <button class="btn-apply js-btn-apply">Clear Filters</button>
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="master-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Destination</th>
                <th>Packages</th>
                <th>Creation Date</th>
                <th>Payment Date</th>
                <th>Delivered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody class="js-orders-table"></tbody>
          </table>
        </div>

        <div class="no-match-container hidden js-no-match-container"></div>

        <div class="overlay" id="packages-overlay">
          <div class="packages-details-container">
            <div class="details-header">
              <h3><i class="fas fa-box-open"></i> Order Progress: <span class="order-id"></span></h3>
              <button class="close-btn js-close-overlay-btn">&times;</button>
            </div>

            <div class="details-body">
              <p class="destination-text">
                <strong>Destination:</strong>
                <span class="js-destination"></span>
              </p>

              <table class="package-status-table">
                <thead>
                  <tr>
                    <th>Package ID</th>
                    <th>No. of Items</th>
                    <th>Processing</th>
                    <th>Ready</th>
                    <th>In Transit</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody class="js-packages-table"></tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `

  renderSidebar('orders_requests')
  displayNoMatch()

  const orders = await getOrdersData()

  const ordersTableBody = document.querySelector('.js-orders-table')

  // Display all the orders in the table
  function displayOrders(orders) {
    const tblRowFragment = document.createDocumentFragment()
    orders.forEach(ord => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
        <td class="order-id"><strong>${ord.orderId}</strong></td>
        <td>
          <strong>${ord.institutionName}</strong><br>
          <small>${ord.destination}</small>
        </td>
        <td class="js-packages-${ord.orderId}"></td>
        <td>${ord.creationDate}</td>
        <td>${ord.paymentDate}</td>
        <td><span class="deliv-${ord.delivered.toLowerCase()}">${ord.delivered}</span></td>
        <td><button class="view-btn js-view-btn" data-order-id="${ord.orderId}">Details</button></td>
      `

      const packagesCol = tblRow.querySelector(`.js-packages-${ord.orderId}`)

      ord.packages.forEach(pkg => {
        const storageTemp = pkg.packageId.slice(-1)
        const badge = document.createElement('span')
        badge.className = `badge ${storageTemp}`
        badge.textContent = storageTemp

        packagesCol.appendChild(badge)
      })

      tblRowFragment.appendChild(tblRow)
    })

    return tblRowFragment
  }

  ordersTableBody.appendChild(displayOrders(orders))

  // Controls when to display the overlay and close it 
  const overlay = document.getElementById('packages-overlay')
  ordersTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('js-view-btn')) {
      overlay.classList.add('active')
      const btnOrdId = btn.dataset.orderId

      const packagesTableElem = document.querySelector('.js-packages-table')

      document.querySelector('.details-header .order-id')
        .textContent = btnOrdId

      orders.forEach(ord => {
        const orderId = ord.orderId

        if (btnOrdId === orderId) {
          const orgName = ord.institutionName
          document.querySelector('.js-destination')
            .textContent = orgName
          packagesTableElem.innerHTML = ``

          const packagesFragment = document.createDocumentFragment()

          ord.packages.forEach(pkg => {
            const row = document.createElement('tr')

            row.innerHTML = `
              <td><strong>${pkg.packageId}</strong></td>
              <td>${pkg.itemCount}</td>
              <td><span class="p-${pkg.processing.toLowerCase()}">${pkg.processing}</span></td>
              <td><span class="p-${pkg.ready.toLowerCase()}">${pkg.ready}</span></td>
              <td><span class="p-${pkg.inTransit.toLowerCase()}">${pkg.inTransit}</span></td>
              <td><span class="p-${pkg.completed.toLowerCase()}">${pkg.completed}</span></td>
            `
            packagesFragment.appendChild(row)
          })

          packagesTableElem.appendChild(packagesFragment)
        }

        xRemoveOverlay(overlay)
        clickToRemoveOverlay(overlay)
      })
    }
  })

  // ##Filtering logic
  const searchbarElem = document.getElementById('masterSearch')
  const deliveryStatusDropdown = document.getElementById('deliveryFilter')
  const dateCreatedRadioElem = document.getElementById('dateCreate')
  const datePayRadioElem = document.getElementById('datePay')
  const startDatetElem = document.getElementById('startDate')
  const endDateElem = document.getElementById('endDate')

  // Function to enable searching/filtering of the orders
  function filterOrders(searchText, deliveryStatusPicked, startDate, endDate) {
    const searchTerm = searchText.toLowerCase().trim()

    const searchResult = orders.filter(ord => {
      const { orderId, institutionName, delivered, creationDate, paymentDate } = ord

      const orderMatch = orderId.toLowerCase().includes(searchTerm)
      const orgMatch = institutionName.toLowerCase().includes(searchTerm)

      const deliveryMatch = deliveryStatusPicked === 'all' || deliveryStatusPicked === delivered.toLowerCase()

      const dateMatch = filterDates(creationDate, paymentDate, startDate, endDate)

      return (orderMatch || orgMatch) && dateMatch && deliveryMatch
    })

    return searchResult
  }

  dateCreatedRadioElem.checked = true

  //Filters date depending on the date type selected
  function filterDates(creationDate, paymentDate, startDate, endDate) {
    if (dateCreatedRadioElem.checked) {
      return dayjs(creationDate).isBetween(startDate, endDate, 'day', '[]')
    } else {
      return dayjs(paymentDate).isBetween(startDate, endDate, 'day', '[]')
    }
  }

  const noMatchContainerElem = document.querySelector('.no-match-container')
  const noOfResultsElem = document.querySelector('.no-of-results')
  function filterOrdersCore() {
    const searchResult = filterOrders(searchbarElem.value,
      deliveryStatusDropdown.value,
      startDatetElem.value,
      endDateElem.value
    )

    noOfResultsElem.textContent = searchResult.length
    ordersTableBody.innerHTML = ``

    if (searchResult.length === 0) {
      noMatchContainerElem.classList.remove('hidden')
    } else {
      noMatchContainerElem.classList.add('hidden')
      ordersTableBody.appendChild(displayOrders(searchResult))
    }
  }

  datePayRadioElem.addEventListener('click', () => {
    dateCreatedRadioElem.checked = false
    datePayRadioElem.checked = true
    filterOrdersCore()
  })

  dateCreatedRadioElem.addEventListener('click', () => {
    datePayRadioElem.checked = false
    dateCreatedRadioElem.checked = true
    filterOrdersCore()
  })

  searchbarElem.addEventListener('keyup', filterOrdersCore)
  deliveryStatusDropdown.addEventListener('change', filterOrdersCore)
  startDatetElem.addEventListener('change', filterOrdersCore)
  endDateElem.addEventListener('change', filterOrdersCore)

  // Button to clear the filters applied
  document.querySelector('.js-btn-apply')
    .addEventListener('click', () => {
      searchbarElem.value = startDatetElem.value = endDateElem.value = ''
      deliveryStatusDropdown.value = 'all'
      noOfResultsElem.textContent = '0'

      filterOrdersCore()
    })

  //##End of filtering logic

  //Displays the order statistics at the top of the page
  function displayStats() {
    document.querySelector('.js-no-total-orders')
      .textContent = orders.length

    let noOfPackages = 0
    let completedOrders = 0
    orders.forEach(ord => {
      noOfPackages += ord.packages.length
      if (ord.delivered === 'Yes') completedOrders += 1
    })
    document.querySelector('.js-no-total-pkg')
      .textContent = noOfPackages
    document.querySelector('.js-no-total-delivered')
      .textContent = completedOrders
  }

  displayStats()
})

// Get order details from the db
const getOrdersData = async () => {
  const response = await fetch(`${whManagerPagesLink}/getOrdersData`)
  const res = await response.json()
  return res.order_summary
}