import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { whManagerPagesLink } from "../../global.js";

document.addEventListener('DOMContentLoaded', async () => {

  const paidOrdersObj = await getOrderPackages()

  const paidOrders = paidOrdersObj.paidOrders
  const paidOrdersFragment = document.createDocumentFragment()

  //Returns the number of packages that exist
  function getNoOfPackages(paidOrders) {
    let noOfPackages = 0
    paidOrders.forEach(ord => {
      noOfPackages += ord.packages.length
    })

    return noOfPackages
  }

  //Display all the content on the main page
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
        <span class="dot pulse"></span> ${getNoOfPackages(paidOrders)} Packages Awaiting Assignment
      </div>

      <section class="filter-container">
        <div class="filter-group">
          <label for="hospitalSearch"><i class="fas fa-hospital"></i> Hospital Name/ Order Id</label>
          <input type="text" id="searchTerm" placeholder="Search...">
        </div>

        <div class="filter-group">
          <label for="dateFilter"><i class="fas fa-calendar-alt"></i> Payment Date</label>
          <input type="date" id="dateFilter">
        </div>

        <div class="filter-stats">
          <span id="showingCount">Showing 
            <span class="no-of-packages">All</span>
             Packages
          </span>
          <button class="btn-reset js-btn-reset">Reset</button>
        </div>
      </section>

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

        <div class="no-match-container hidden js-no-match-container"></div>

        <div class="overlay"></div>
      </section>
    </main>
  
    `
  renderSidebar('assign_to_clerk')
  displayNoMatch()

  //Display the rows with packages to assign to a clerk
  const assignToClerkTbodyElem = document.querySelector('.js-assignment-tbody')
  function displayAllPackages(paidOrders) {
    paidOrders.forEach((order) => {
      order.packages.forEach(pkg => {
        const tableRow = document.createElement('tr');
        tableRow.className = 'assignment-row'

        tableRow.innerHTML = `     
          <td>
            <div class="hospital-info">
              <strong>${order.institutionName}</strong>
              <span>
                <span class="order-id">${order.orderId}</span> | 
                <span class="pkg-id">${pkg.packageId}</span>
              </span>
            </div>
          </td>
          <td>
            <div class="workload-info">
              <button class="view-items-btn js-view-items-btn" data-package-id=${pkg.packageId}>
                <i class="fas fa-box"></i>
                <span class="items-container">${pkg.items.length} Items</span>
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
            <select class="clerk-select js-clerk-select-${pkg.packageId}">
              <option value="">Choose Clerk...</option>
            </select>
          </td>
          <td>
            <button class="btn-assign">
              Assign Task
            </button>
          </td>
        `
        paidOrdersFragment.appendChild(tableRow)
      })
    })
    //Append the fragment to the page
    assignToClerkTbodyElem.appendChild(paidOrdersFragment)
  }

  displayAllPackages(paidOrders)

  //Display the clerks options 
  paidOrders.forEach(order => {
    order.packages.forEach(pkg => {
      displayClerks(pkg.packageId)
    })
  })

  //Displays the options for the clerk to choose
  function displayClerks(packageId) {
    const clerks = Object.values(paidOrdersObj['clerks'])

    clerks.forEach(clerk => {
      document.querySelector(`.js-clerk-select-${packageId}`)
        .innerHTML += `
          <option id=${clerk.clerkId}>${clerk.name} (${clerk.activeTasks} active tasks)</option>
      `
    })
  }

  //Controls how the overlay for items details preview is displayed
  const overlay = document.querySelector('.overlay')
  assignToClerkTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')

    if (!btn) return;

    if (btn.classList.contains('js-view-items-btn')) {
      const btnPackageId = btn.dataset.packageId

      paidOrders.forEach(order => {
        order.packages.forEach(pkg => {
          const items = pkg.items

          if (pkg.packageId === btnPackageId) {
            overlay.innerHTML = `
              <div class="items-preview-container">
                <div class="header-close-container">
                  <div class="preview-header">
                    <h3>Items in Package <span class="package-id">${btn.dataset.packageId}</span></h3>
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
                  <td><strong>${item.quantity}</strong></td>
                `

              itemsFragment.appendChild(itemsTableRow)
            })

            document.querySelector('.js-items-tbody')
              .appendChild(itemsFragment)

            xRemoveOverlay(overlay)
            clickToRemoveOverlay(overlay)
          }
        })
      })
    }
  })

  //Search logic
  const searchTermElem = document.getElementById('searchTerm')
  const paymentDateElem = document.getElementById('dateFilter')
  const noOfPkgShowing = document.querySelector('.no-of-packages')
  const noMatchElem = document.querySelector('.js-no-match-container')

  function handleSearch() {
    const searchText = searchTermElem.value.toLowerCase().trim()
    const paymentDateValue = dayjs(paymentDateElem.value).format("MMM DD")

    const searchResult = paidOrders.filter(ord => {
      const searchMatch = ord.institutionName.toLowerCase().includes(searchText)
        || ord.orderId.toLowerCase().includes(searchText)

      const paymentDateMatch = paymentDateValue === 'Invalid Date' 
        || ord.paymentDate.includes(paymentDateValue)

      return searchMatch && paymentDateMatch
    })

    assignToClerkTbodyElem.innerHTML = ``

    if(searchResult.length === 0){
      noMatchElem.classList.remove('hidden')
    }else{
      noMatchElem.classList.add('hidden')
      displayAllPackages(searchResult)    
      noOfPkgShowing.textContent = getNoOfPackages(searchResult)
    }
  }

  searchTermElem.addEventListener('keyup', handleSearch)
  paymentDateElem.addEventListener('change', handleSearch)

  document.querySelector('.js-btn-reset')
  .addEventListener('click', () => {
    searchTermElem.value = paymentDateElem.value = ''
    handleSearch()
    noOfPkgShowing.textContent = 'All'
  })
})

// Fetch assign to clerk page data from the db
const getOrderPackages = async () => {
  const response = await fetch(`${whManagerPagesLink}/getOrderPackages`)
  const res = await response.json()
  return res.orders_clerk_data
}