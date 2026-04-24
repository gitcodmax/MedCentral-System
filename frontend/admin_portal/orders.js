import { renderSidebar } from "./sidebar.js"
import { handleOverlay, displayNoMatchFound, adminPagesLink } from "../global.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
    
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <main class="content">
        <section class="filter-container">
          <div class="filter-main-row">
            <div class="filter-item search-grow">
              <label class="filter-label">Search Orders</label>
              <div class="search-input-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" id="masterSearch" placeholder="Search ID or Hospital...">
              </div>
            </div>

            <div class="filter-group-wrapper">
              <label class="filter-label">Request Date Range</label>
              <div class="date-range-inputs">
                <div class="date-input-field">
                  <span>From</span>
                  <input type="date" id="dateFrom" class="filter-input">
                </div>
                <div class="date-input-field">
                  <span>To</span>
                  <input type="date" id="dateTo" class="filter-input">
                </div>
              </div>
            </div>

            <div class="filter-item flex-center">
              <label class="checkbox-container">
                <input type="checkbox" id="rejectedToggle">
                <span class="checkmark"></span>
                Show Only Rejected
              </label>
            </div>

            <div class="filter-actions">
              <button class="btn-clear">
                <i class="fas fa-undo"></i> Clear Filters
              </button>
            </div>

            <div class="filter-results-info">
              <p>Showing <span id="resultCount">10</span> results found in the system</p>
            </div>
          </div>
        </section>

        <main class="table-container">
          <table class="order-table">
            <thead>
              <tr>
                <th>Reference IDs</th>
                <th>Hospital Name</th>
                <th>Request Date</th>
                <th>Packages</th>
                <th>Total Items</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="ordersTbody"></tbody>
          </table>

          <div class="no-match-container js-no-match-found hidden"></div>

          <div class="modal-overlay" id="orderDetailsOverlay">
            <div class="modal-card detail-modal-wide">
              <div class="modal-header order-detail-header">
                <div class="header-main">
                  <div class="id-badge-group">
                    <span class="req-id-view-overlay" id="reqIdOverlay"></span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="ord-id-view-overlay" id="ordIdOverlay"></span>
                  </div>
                  <h2 id="hosNameOv"></h2>
                  <div class="header-meta">
                    <span><i class="far fa-calendar-alt"></i> Requested: <strong id="reqDateOv"></strong></span>
                    <span><i class="far fa-credit-card"></i> Paid: <strong id="payDateOv"></strong></span>
                    <span><i class="fas fa-box"></i> <strong id="pkgsCount"></strong> | <strong
                        id="itemsCount"></strong> Total</span>
                  </div>
                </div>
                <button class="modal-close-btn js-btn-close-overlay">&times;</button>
              </div>

              <div class="ord-details-modal-body">
                <div class="package-list" id="pkgListOverlay"></div>
              </div>
            </div>
          </div>
        </main>
      </main>
    </div>
  
    `

  await renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="page-title">
        <h2>Order & Request History</h2>
      </div> 
    `
  displayNoMatchFound()

  const ordReqData = await getAllOrdReq()

  const StorageConfig = {
    "A": {
      code: "A",
      label: "Ambient",
      cssClass: "fa-solid fa-house-medical-circle-check"
    },
    "C": {
      code: "C",
      label: "Common Room Temp",
      cssClass: "fas fa-thermometer-half"
    },
    "R": {
      code: "R",
      label: "Refrigerated",
      cssClass: "fas fa-snowflake"
    },
    "F": {
      code: "F",
      label: "Frozen",
      cssClass: "fas fa-icicles"
    }
  };

  const ordersTbodyElem = document.getElementById('ordersTbody')

  function displayAllOrders(ordersData) {
    ordersTbodyElem.innerHTML = ``
    const ordersTableFrag = document.createDocumentFragment()
    ordersData.forEach(ord => {
      const tblRow = document.createElement('tr')
      tblRow.innerHTML = `
      <td>
        <div class="id-stack">
          <span class="req-id">${ord.requestId}</span>
          <span class="ord-id">${!ord.orderId ? '---' : ord.orderId}</span>
        </div>
      </td>
      <td class="hospital-name">${ord.hospitalName}</td>
      <td>${ord.requestDate}</td>
      <td>
        ${displayPackages(ord.requestId, 'packages')}
      </td>
      <td>
        <div class="items-display">${ord.totalItems}</div>
      </td>
      <td>${displayPackages(ord.requestId, 'completed')}</td>
      <td>
        <div class="action-btns">
          <button class="
            ${ord.isRejected ? "rejected-ord-btn" : 'btn-icon btn-view js-view-ord-details-btn'}" 
            data-req-id=${ord.requestId} title="${ord.isRejected ? "REJECTED" : 'View Details'}" 
            ${ord.isRejected ? "disabled" : ''}>
            ${ord.isRejected ? "REJECTED" : 'View'}
          </button>
        </div>
      </td>
    `

      ordersTableFrag.appendChild(tblRow)
    })
    ordersTbodyElem.appendChild(ordersTableFrag)
  }

  displayAllOrders(ordReqData)

  // Search & Filter Logic
  const masterSearchInput = document.getElementById('masterSearch')
  const dateFromInput = document.getElementById('dateFrom')
  const dateToInput = document.getElementById('dateTo')
  const rejectedToggleInput = document.getElementById('rejectedToggle')
  const clearFiltersBtn = document.querySelector('.btn-clear')
  const resultCountElem = document.getElementById('resultCount')
  const noMatchFoundElem = document.querySelector('.js-no-match-found')

  // Filtering function
  function applyFilters() {
    let filtered = [...ordReqData]

    // Text search: requestId, orderId, hospitalName
    const searchTerm = masterSearchInput?.value.trim().toLowerCase()
    if (searchTerm) {
      filtered = filtered.filter(ord => {
        const reqId = ord.requestId?.toLowerCase() || ''
        const ordId = ord.orderId?.toLowerCase() || ''
        const hosp = ord.hospitalName?.toLowerCase() || ''
        return (
          reqId.includes(searchTerm) ||
          ordId.includes(searchTerm) ||
          hosp.includes(searchTerm)
        )
      })
    }

    // Date range filter (based on requestDate)
    const fromVal = dateFromInput?.value
    const toVal = dateToInput?.value

    if (fromVal) {
      const fromDate = new Date(fromVal)
      filtered = filtered.filter(ord => new Date(ord.requestDate) >= fromDate)
    }

    if (toVal) {
      const toDate = new Date(toVal)
      filtered = filtered.filter(ord => new Date(ord.requestDate) <= toDate)
    }

    // Rejected-only toggle
    if (rejectedToggleInput?.checked) {
      filtered = filtered.filter(ord => ord.isRejected)
    }

    if (filtered.length === 0) {
      ordersTbodyElem.innerHTML = ``
      noMatchFoundElem.classList.remove('hidden')
    } else {
      noMatchFoundElem.classList.add('hidden')
      displayAllOrders(filtered)
    }
    if (resultCountElem) {
      resultCountElem.textContent = String(filtered.length)
    }
  }

  if (masterSearchInput) {
    masterSearchInput.addEventListener('input', applyFilters)
  }
  if (dateFromInput) {
    dateFromInput.addEventListener('change', applyFilters)
  }
  if (dateToInput) {
    dateToInput.addEventListener('change', applyFilters)
  }
  if (rejectedToggleInput) {
    rejectedToggleInput.addEventListener('change', applyFilters)
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (masterSearchInput) masterSearchInput.value = ''
      if (dateFromInput) dateFromInput.value = ''
      if (dateToInput) dateToInput.value = ''
      if (rejectedToggleInput) rejectedToggleInput.checked = false
      displayAllOrders(ordReqData)
      noMatchFoundElem.classList.add('hidden')
      if (resultCountElem) {
        resultCountElem.textContent = String(ordReqData.length)
      }
    })
  }

  // Set initial result count
  if (resultCountElem) {
    resultCountElem.textContent = String(ordReqData.length)
  }

  // Displays the packages badges
  function displayPackages(reqId, columnName) {
    const orderData = ordReqData.find(ord => reqId === ord.requestId)
    if (!orderData) return ''

    const htmlArr = orderData.packages.map(pkg => {
      let badgeStatus = ``
      if (orderData.isRejected) {
        badgeStatus = 'red-badge'
      } else if (pkg.status.toLowerCase() !== 'completed') {
        badgeStatus = 'grey-badge'
      }
      if (columnName === 'packages') {
        return `<span class="badge ${pkg.storageCode} 
        ${orderData.isRejected ? "red-badge" : ''}">${pkg.storageCode}</span>`
      } else if (columnName === 'completed') {
        return `<span class="badge ${pkg.storageCode} 
        ${badgeStatus}">${pkg.storageCode}</span>`
      }
    })

    return htmlArr.join('')
  }

  // Helper to get storage details safely
  function getStorageDetails(code) {
    return StorageConfig[code] || { label: "Unknown", cssClass: "tag-default", icon: "fas fa-question" };
  }

  // Show the order details
  ordersTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('js-view-ord-details-btn')) {
      const orderDetailsOverlayElem = document.getElementById('orderDetailsOverlay')
      handleOverlay(orderDetailsOverlayElem)

      const pkgListOverlayElem = document.getElementById('pkgListOverlay')
      pkgListOverlayElem.innerHTML = ``

      const ordData = ordReqData.find(ord => ord.requestId === btn.dataset.reqId)
      document.getElementById('reqIdOverlay')
        .textContent = ordData.requestId
      document.getElementById('ordIdOverlay')
        .textContent = `${!ordData.orderId ? '---' : ordData.orderId}`
      document.getElementById('hosNameOv')
        .textContent = ordData.hospitalName
      document.getElementById('reqDateOv')
        .textContent = ordData.requestDate
      document.getElementById('payDateOv')
        .textContent = ordData.paymentDate
      document.getElementById('pkgsCount')
        .textContent = `${ordData.packages.length} 
          Package${ordData.packages.length > 1 ? 's' : ''}`
      document.getElementById('itemsCount')
        .textContent = `${ordData.totalItems} 
        Item${ordData.totalItems > 1 ? 's' : ''}`

      const pkgsListFrag = document.createDocumentFragment()
      ordData.packages.forEach(pkg => {
        const storageTempDetails = getStorageDetails(pkg.storageCode)
        const divElem = document.createElement('div')
        divElem.className = `package-card`

        // Build item rows from this package's items
        const itemRowsHtml = pkg.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.uom}</td>
          </tr>
        `).join('')

        divElem.innerHTML = `
          <div class="package-card-header">
            <div>
              <span class="label">Package ID</span>
              <strong class="view-pkg-id">${pkg.packageId}</strong>
            </div>
            <div>
              <span class="label">Packed By:</span>
              <strong class="clerk-name">${!pkg.assignedClerk ? '---' : pkg.assignedClerk}</strong>
            </div>
            <div>
              <span class="label">Delivered By:</span>
              <strong class="clerk-name">${!pkg.assignedDriver ? '---' : pkg.assignedDriver}</strong>
            </div>
            <div class="pkg-type">
              <span class="storage-temp"><i class="${storageTempDetails.cssClass}"></i> 
                ${storageTempDetails.label}
              </span>
            </div>
            <div class="pkg-status">
              <span class="status-pill status-${pkg.status.toLowerCase()}">${pkg.status.replaceAll('-', ' ')}</span>
            </div>
          </div>

          <div class="package-items">
            <table class="item-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                ${itemRowsHtml}
              </tbody>
            </table>
          </div>
        `

        pkgsListFrag.appendChild(divElem)
      })

      pkgListOverlayElem.appendChild(pkgsListFrag)
    }
  })
})

async function getAllOrdReq(){
  const response = await fetch(`${adminPagesLink}/getOrdReq`)
  const res = await response.json()
  return res.ordReqData.ordersrequests
}

getAllOrdReq()