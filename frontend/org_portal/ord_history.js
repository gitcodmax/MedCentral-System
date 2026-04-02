import { renderSidebar } from "./sidebar.js";
import {
  getStorageTempIcon, displayNoMatchFound,
  orgPortalPagesLink
} from "../global.js"

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.app-container')
    .innerHTML = `
      
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <section id="orderDetailsPage" class="view-section">
        <div class="page-header">
          <div>
            <h2>Requisition & Order History</h2>
            <p>Track the lifecycle of your medical supply requests.</p>
          </div>
        </div>

        <div class="filter-section">
          <div class="search-container">
            <div class="search-input-wrapper">
              <i class="fas fa-search"></i>
              <input type="text" id="idSearchInput" placeholder="Search by Request ID or Order ID (e.g., REQ-2026...)">
            </div>
            <button class="btn-toggle-filters js-btn-toggle-filters">
              <i class="fas fa-filter"></i> Filters
            </button>
          </div>

          <div id="advancedFilters" class="advanced-filters">
            <div class="filter-grid">
              <div class="filter-group">
                <label>Date Range</label>
                <div class="date-inputs">
                  <select id="dateType">
                    <option value="initiated">Date Initiated</option>
                    <option value="payment">Payment Date</option>
                    <option value="delivery">Delivery Date</option>
                  </select>
                  <input type="date" id="startDate">
                  <span>to</span>
                  <input type="date" id="endDate">
                </div>
              </div>

              <div class="filter-group">
                <label>Number of Packages (1 - 4)</label>
                <div class="range-wrapper js-range-wrapper disabled">
                  <input type="range" id="pkgRange" min="1" max="4" value="4" disabled>
                  <div class="pkg-label-btn">
                    <span class="pkg-label" id="pkgLabel">Showing all Packages</span>
                    <button class="enable-btn js-disable-btn">Enable Filter</button>
                  </div>
                </div>
              </div>

              <div class="filter-group">
                <label>Max Total Value (KES)</label>
                <div class="value-input-wrapper">
                  <input type="number" id="maxValue" min="0" placeholder="e.g. 100000">
                </div>
              </div>
            </div>

            <div class="filter-actions">
              <button class="btn-reset js-btn-reset">Reset All</button>
              <button class="btn-apply js-btn-apply">Apply Filters</button>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="orders-table js-ord-tbl">
            <thead>
              <tr>
                <th>Reference IDs</th>
                <th>Packages</th>
                <th>Date Initiated</th>
                <th>Payment Date</th>
                <th>Delivery Date</th>
                <th>Total Value</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="orderTableBody"></tbody>
          </table>
          <div class="no-match-container hidden js-no-match-found"></div>
        </div>

        <div id="packageDrawer" class="side-drawer">
          <div class="drawer-header">
            <div class="header-titles">
              <h2> <span class="no-pkg js-no-pkg"></span> Order Packages</h2>
              <p id="drawerRequestId"></p>
            </div>
            <div class="header-titles-right">
              <button class="btn-close-drawer js-btn-close-drawer">&times;</button>
              <div class="total-items">Total Items: <span class="no-total-items js-no-total-items">3</span></div>
            </div>
          </div>

          <div class="drawer-body js-drawer-body"></div>
        </div>
      </section>
    </main>
  
    `

  renderSidebar('ord_history')
  displayNoMatchFound()

  // ========================  
  // ========================  
  // ========================  
  const hosId = 1
  // ========================
  // ========================
  // ========================

  const orderHistoryData = await getAllHosRequests(hosId)
  console.log(orderHistoryData)

  //Display the requests/orders in the table
  const ordTblBodyElem = document.getElementById('orderTableBody')
  function displayAllOrdReq(orderData) {
    const ordTbodyFragment = document.createDocumentFragment()
    orderData.forEach((reqOrd) => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
        <td>
          <div class="id-stack">
            <span class="req-id" title="Request ID">${reqOrd.requestId}</span>
            <span class="ord-id" title="Order ID">
              ${!reqOrd.orderId ? '<small><i>Pending Approval</i></small>' : reqOrd.orderId}
            </span>
          </div>
        </td>
        <td>
          <div class="package-count js-pkg-count" data-req-id=${reqOrd.requestId}></div>
        </td>
        <td>${reqOrd.dateInitiated}</td>
        <td>${!reqOrd.paymentDate ? '---' : reqOrd.paymentDate}</td>
        <td>${!reqOrd.deliveryDate ? '---' : reqOrd.deliveryDate}</td>
        <td class="price-cell">KES ${reqOrd.totalValue}</td>
        <td>
          <div class="package-count js-pkg-count js-pkg-count-complete" data-req-id=${reqOrd.requestId}></div>
        </td>
        <td>
          <button class="btn-view-packages" data-req-id=${reqOrd.requestId}>
            View Packages
          </button>
        </td>
      `

      ordTbodyFragment.appendChild(tblRow)
    })

    ordTblBodyElem.appendChild(ordTbodyFragment)
  }

  displayAllOrdReq(orderHistoryData)

  //Display the packages badges
  function displayPackagesBadges() {
    document.querySelectorAll('.js-pkg-count')
      .forEach(pkgColElem => {
        const elemReqId = pkgColElem.dataset.reqId;

        orderHistoryData.forEach(reqOrd => {
          if (elemReqId === reqOrd.requestId) {
            reqOrd.packages.forEach(pkg => {
              const storageChar = pkg.storageTemp[0].toUpperCase()
              pkgColElem.innerHTML += `
              <span class="badge ${getGreyBadge(pkgColElem, pkg.status)} ${storageChar}">${storageChar}</span>
            `
            })
          }
        })
      })
  }
  displayPackagesBadges()

  //Display grey badge if package status is not yet completed
  function getGreyBadge(elem, status) {
    if (elem.classList.contains('js-pkg-count-complete')) {
      if (status !== 'completed') {
        return 'grey-badge'
      }
    }
  }

  //Set up opening and closing the filter container
  document.querySelector('.js-btn-toggle-filters')
    .addEventListener('click', () => {
      const filters = document.getElementById('advancedFilters');
      const isVisible = filters.style.display === 'block';
      filters.style.display = isVisible ? 'none' : 'block';
    })


  // Filtering Logic
  const noPkgElem = document.getElementById('pkgRange')
  const pkgLabelElem = document.getElementById('pkgLabel')
  const disableBtnElem = document.querySelector('.js-disable-btn')
  const rangeWrapperElem = document.querySelector('.js-range-wrapper')

  //Listens for a change in the range
  noPkgElem.addEventListener('input', () => {
    displayNoPackagesLabel()
  })

  //Design the number of packages filter
  disableBtnElem.addEventListener('click', () => {
    rangeWrapperElem.classList.toggle('disabled')
    pkgFilterHandler()
  })

  function pkgFilterHandler() {
    if (rangeWrapperElem.classList.contains('disabled')) {
      pkgLabelElem.innerText = `Showing all Packages`
      noPkgElem.disabled = true
      disableBtnElem.textContent = `Enable Filter`
    } else {
      displayNoPackagesLabel()
      noPkgElem.disabled = false
      disableBtnElem.textContent = `Disable Filter`
    }
  }
  pkgFilterHandler()

  //Displays the text in the packages label
  function displayNoPackagesLabel() {
    pkgLabelElem.innerText = `Up to ${noPkgElem.value} Packages`;
  }

  const searchBarElem = document.getElementById('idSearchInput')
  const selectDateElem = document.getElementById('dateType')
  const maxValueElem = document.getElementById('maxValue')

  const startDateElem = document.getElementById('startDate')
  const endDateElem = document.getElementById('endDate')

  // Display the search result from the search bar
  searchBarElem.addEventListener('keyup', () => {
    const searchText = searchBarElem.value.toLowerCase().trim()

    const searchResult = orderHistoryData.filter(ordReq => {
      return getSearchMatch(ordReq, searchText)
    })

    renderNewOrdReq(searchResult)
  })

  // Returns either true or false for an order/request that matches the condition
  function getSearchMatch(ordReq, searchText) {
    const orderId = ordReq.orderId
    const searchMatch = orderId ?
      ordReq.requestId.toLowerCase().includes(searchText) || orderId.toLowerCase().includes(searchText) :
      ordReq.requestId.toLowerCase().includes(searchText)

    return searchMatch
  }

  document.querySelector('.js-btn-apply')
    .addEventListener('click', () => {
      // Display the result based on the selected date filter
      const dateType = selectDateElem.value
      const startDate = startDateElem.value
      const endDate = endDateElem.value
      if (startDate && !endDate) {
        alert(`Enter the end date!`)
      } else if (!startDate && endDate) {
        alert(`Enter the start date!`)
      } else {
        searchFunction(dateType, startDate, endDate)
      }

    })

  function searchFunction(dateTypeValue, startDateStr, endDateStr) {
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)
    const searchText = searchBarElem.value.toLowerCase().trim()

    const searchResult = orderHistoryData.filter(ordReq => {
      const searchMatch = getSearchMatch(ordReq, searchText)

      // Search for the date match
      let dateType = ordReq.dateInitiated
      if (dateTypeValue === 'payment') {
        dateType = ordReq.paymentDate
      } else if (dateTypeValue === 'delivery') {
        dateType = ordReq.deliveryDate
      }

      const checkingDate = new Date(dateType)
      // Normalize all to midnight local time
      checkingDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const dateMatch = startDateStr === ''
        || endDateStr === '' || checkingDate >= startDate && checkingDate <= endDate

      // Search for the number of packages match
      const noPkgMatch = noPkgElem.disabled === true
        || noPkgElem.disabled === false && ordReq.packages.length === Number(noPkgElem.value)

      // Search for the range of the max total value
      const maxValueMatch = maxValueElem.value === '' || ordReq.totalValue <= maxValueElem.value

      return searchMatch && dateMatch && noPkgMatch && maxValueMatch
    })

    renderNewOrdReq(searchResult)
  }

  //Reset the advanced filters inputs
  document.querySelector('.js-btn-reset')
    .addEventListener('click', () => {
      selectDateElem.value = 'initiated'
      searchBarElem.value = startDateElem.value = endDateElem.value = maxValueElem.value = ''
      rangeWrapperElem.classList.add('disabled')
      pkgFilterHandler()

      renderNewOrdReq(orderHistoryData)
    })

  //Displays the data when 
  function renderNewOrdReq(ordReqData) {
    const noMatchElem = document.querySelector('.js-no-match-found')

    ordTblBodyElem.innerHTML = ``
    if (ordReqData.length === 0) {
      noMatchElem.classList.remove('hidden')
    } else {
      noMatchElem.classList.add('hidden')
      displayAllOrdReq(ordReqData)
      displayPackagesBadges()
    }
  }

  //Opening and closing the drawer
  const drawerElem = document.getElementById('packageDrawer')
  document.querySelector('.js-ord-tbl')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      //Open the drawer to view the packages details
      if (btn.classList.contains('btn-view-packages')) {
        const btnReqId = btn.dataset.reqId
        const drawerBodyElem = document.querySelector('.js-drawer-body')
        drawerBodyElem.innerHTML = ``
        drawerElem.classList.add('open')

        //Display the packages cards
        orderHistoryData.forEach(ordReq => {
          if (btnReqId === ordReq.requestId) {
            document.querySelector('.js-no-pkg')
              .textContent = ordReq.packages.length
            document.getElementById('drawerRequestId')
              .textContent = btnReqId

            ordReq.packages.forEach(pkg => {
              drawerBodyElem.innerHTML += `
                  <div class="package-group ${pkg.storageTemp[0].toUpperCase()}">
                    <div class="package-meta">
                      <div class="pkg-badge">
                        <i class="${getStorageTempIcon(pkg.storageTemp)}"></i> ${pkg.storageTemp}
                      </div>
                      <span class="pkg-status ${pkg.status.includes('issue') ? 'delivered-with-issue' : pkg.status}">${pkg.status}</span>
                    </div>
                    <div class="package-id-strip">ID: ${pkg.packageId}</div>

                    <ul class="pkg-items-list" data-pkg-id=${pkg.packageId}></ul>
                  </div>
                `
            })
          }
        })

        //Closing the packages drawer
        document.querySelector('.js-btn-close-drawer')
          .addEventListener('click', () => {
            drawerElem.classList.remove('open')
          })

        //Display the items in the packages
        let totalItems = 0
        document.querySelectorAll('.pkg-items-list')
          .forEach(list => {
            const listPkgId = list.dataset.pkgId

            orderHistoryData.forEach(ordReq => {
              ordReq.packages.forEach(pkg => {
                if (listPkgId === pkg.packageId) {
                  totalItems += pkg.items.length
                  pkg.items.forEach(item => {
                    let uomMod = ``
                    if (item.quantity > 1 && item.uom !== 'box') {
                      uomMod = `${item.uom}s`
                    } else if (item.quantity > 1 && item.uom === 'box') {
                      uomMod = `${item.uom}es`
                    } else {
                      uomMod = item.uom
                    }

                    list.innerHTML += `
                      <li>
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">${item.quantity} ${uomMod}</span>
                      </li>
                    `
                  })
                }
              })
            })
          })

        document.querySelector('.js-no-total-items')
          .textContent = totalItems
      }
    })

  //Check if the click is inside an element(returns True/False)
  function isClickInsideOrChildOf(element, clickTarget) {
    return element === clickTarget || element.contains(clickTarget);
  }

  //Closes the drawer overlay when the click is outside it
  document.querySelector('.app-content')
    .addEventListener('pointerdown', (e) => {
      const clickInside = isClickInsideOrChildOf(drawerElem, e.target)

      if (!clickInside) {
        drawerElem.classList.remove('open')
      }
    })
})

const getAllHosRequests = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getAllRequestsInfo`, 
    {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({hosId})
    }
  )

  const res = await response.json()
  return res.allHosRequests.hosrequests
}