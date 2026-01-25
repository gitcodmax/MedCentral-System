import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "../overlay.js";

document.addEventListener('DOMContentLoaded', () => {

  //Paid orders mock up data
  const paidOrdersObj = {
    "paidOrders": [
      {
        "orderId": "ORD-2026-102",
        "institutionName": "Aga Khan University Hospital",
        "paymentDate": "Jan 25, 07:30 AM",
        "packages": [
          {
            "packageId": "ORD-2026-102-A",
            "items": [
              { "sku": "MED-001-P", "name": "Paracetamol 500mg", "location": "Shelf A-12", "batchNo": "AOU123", "quantity": "50 Boxes" },
              { "sku": "GS-992-M", "name": "Surgical Gloves (M)", "location": "Shelf C-04", "batchNo": "AOU124", "quantity": "180 Pairs" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-108",
        "institutionName": "The Nairobi Hospital",
        "paymentDate": "Jan 25, 06:15 AM",
        "packages": [
          {
            "packageId": "ORD-2026-108-R",
            "items": [
              { "sku": "IV-FL-09", "name": "Saline Solution 500ml", "location": "Shelf R-01", "batchNo": "AOU125", "quantity": "40 Vials" }
            ]
          },
          {
            "packageId": "ORD-2026-108-A",
            "items": [
              { "sku": "SYR-10-ML", "name": "10ml Syringes", "location": "Shelf B-05", "batchNo": "AOU126", "quantity": "100 Units" },
              { "sku": "BDG-EL-02", "name": "Elastic Bandages", "location": "Shelf E-10", "batchNo": "AOU127", "quantity": "15 Rolls" },
              { "sku": "ANT-SP-04", "name": "Antiseptic Spray", "location": "Shelf D-08", "batchNo": "AOU128", "quantity": "5 Bottles" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-112",
        "institutionName": "Mater Misericordiae Hospital",
        "paymentDate": "Jan 24, 04:45 PM",
        "packages": [
          {
            "packageId": "ORD-2026-112-A",
            "items": [
              { "sku": "MSK-N95-01", "name": "N95 Respirator Masks", "location": "Shelf F-02", "batchNo": "AOU129", "quantity": "200 Pieces" },
              { "sku": "THRM-DIG-05", "name": "Digital Thermometers", "location": "Shelf G-01", "batchNo": "AOU130", "quantity": "10 Units" },
              { "sku": "BPC-MAN-09", "name": "Manual BP Cuffs", "location": "Shelf G-05", "batchNo": "AOU131", "quantity": "3 Sets" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-105",
        "institutionName": "Kenyatta National Hospital",
        "paymentDate": "Jan 23, 03:30 PM",
        "packages": [
          {
            "packageId": "ORD-2026-105-A",
            "items": [
              { "sku": "SYR-50-L", "name": "Luer Lock Syringes", "location": "Shelf B-02", "batchNo": "AOU132", "quantity": "10 Units" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-115",
        "institutionName": "MP Shah Hospital",
        "paymentDate": "Jan 23, 01:20 PM",
        "packages": [
          {
            "packageId": "ORD-2026-115-A",
            "items": [
              { "sku": "ANT-AMX-50", "name": "Amoxicillin 500mg", "location": "Shelf A-15", "batchNo": "AOU133", "quantity": "30 Boxes" },
              { "sku": "VIT-C-100", "name": "Vitamin C 1000mg", "location": "Shelf A-20", "batchNo": "AOU134", "quantity": "50 Bottles" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-120",
        "institutionName": "Karen Hospital",
        "paymentDate": "Jan 22, 11:45 AM",
        "packages": [
          {
            "packageId": "ORD-2026-120-F",
            "items": [
              { "sku": "LAB-RGT-01", "name": "COVID-19 Rapid Test", "location": "Shelf F-01", "batchNo": "AOU135", "quantity": "100 Kits" }
            ]
          },
          {
            "packageId": "ORD-2026-120-A",
            "items": [
              { "sku": "CAN-20G-IV", "name": "IV Cannula 20G", "location": "Shelf C-12", "batchNo": "AOU136", "quantity": "200 Units" },
              { "sku": "TAPE-MIC-01", "name": "Micropore Tape", "location": "Shelf E-02", "batchNo": "AOU137", "quantity": "20 Rolls" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-125",
        "institutionName": "Coptic Hospital",
        "paymentDate": "Jan 22, 09:10 AM",
        "packages": [
          {
            "packageId": "ORD-2026-125-A",
            "items": [
              { "sku": "OXY-GEN-02", "name": "Oxygen Mask - Adult", "location": "Shelf H-05", "batchNo": "AOU138", "quantity": "15 Units" },
              { "sku": "NEB-KIT-01", "name": "Nebulizer Kit", "location": "Shelf H-08", "batchNo": "AOU139", "quantity": "10 Sets" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-130",
        "institutionName": "Mediheal Hospital",
        "paymentDate": "Jan 21, 04:30 PM",
        "packages": [
          {
            "packageId": "ORD-2026-130-C",
            "items": [
              { "sku": "GLU-STR-05", "name": "Glucose Test Strips", "location": "Shelf L-02", "batchNo": "AOU140", "quantity": "20 Packs" },
              { "sku": "GLU-MET-01", "name": "Digital Glucometer", "location": "Shelf L-01", "batchNo": "AOU141", "quantity": "5 Units" },
              { "sku": "LNC-UNI-01", "name": "Universal Lancets", "location": "Shelf L-03", "batchNo": "AOU142", "quantity": "500 Pieces" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-135",
        "institutionName": "PCEA Kikuyu Hospital",
        "paymentDate": "Jan 21, 02:15 PM",
        "packages": [
          {
            "packageId": "ORD-2026-135-R",
            "items": [
              { "sku": "OPTH-DR-01", "name": "Atropine Eye Drops", "location": "Shelf R-05", "batchNo": "AOU143", "quantity": "20 Vials" }
            ]
          },
          {
            "packageId": "ORD-2026-135-A",
            "items": [
              { "sku": "EYE-PAD-02", "name": "Sterile Eye Pads", "location": "Shelf M-06", "batchNo": "AOU144", "quantity": "100 Pieces" }
            ]
          }
        ]
      },
      {
        "orderId": "ORD-2026-140",
        "institutionName": "Nairobi West Hospital",
        "paymentDate": "Jan 20, 10:00 AM",
        "packages": [
          {
            "packageId": "ORD-2026-140-A",
            "items": [
              { "sku": "SCRB-BLU-L", "name": "Surgical Scrubs (L)", "location": "Shelf S-01", "batchNo": "AOU145", "quantity": "25 Sets" }
            ]
          }
        ]
      }
    ],
    "clerks": [
      { "clerkId": "CLK-01", "name": "Peter", "activeTasks": 3 },
      { "clerkId": "CLK-02", "name": "Sarah", "activeTasks": 0 },
      { "clerkId": "CLK-03", "name": "James", "activeTasks": 5 },
      { "clerkId": "CLK-04", "name": "Elena", "activeTasks": 2 }
    ]
  };

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

        <div class="overlay"></div>
      </section>
    </main>
  
    `
  renderSidebar('assign_to_clerk')

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
    displayAllPackages(searchResult)    
    noOfPkgShowing.textContent = getNoOfPackages(searchResult)
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