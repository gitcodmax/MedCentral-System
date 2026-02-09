import { renderSidebar } from "./sidebar.js";
import { getStorageTempIcon, displayNoMatchFound } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
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

  renderSidebar()
  displayNoMatchFound()

  const orderHistoryData = [
    {
      requestId: "REQ-2026-06100",
      orderId: "ORD-100200",
      dateInitiated: "Feb 01, 2026",
      paymentDate: "Feb 02, 2026",
      deliveryDate: null,
      totalValue: 842000.00,
      packages: [
        {
          packageId: "PKG-6100-A", storageTemp: "frozen", status: "dispatched",
          items: [
            { name: "Fresh Frozen Plasma", quantity: 10, uom: "unit" },
            { name: "Cryoprecipitate", quantity: 5, uom: "unit" },
            { name: "Stem Cell Vials", quantity: 2, uom: "vial" },
            { name: "Frozen Bone Graft", quantity: 1, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6100-B", storageTemp: "refrigerated", status: "packed",
          items: [
            { name: "Insulin Aspart", quantity: 50, uom: "vial" },
            { name: "Tetanus Antitoxin", quantity: 20, uom: "ampoule" },
            { name: "Hepatitis B Vaccine", quantity: 40, uom: "vial" },
            { name: "Oxytocin Injection", quantity: 100, uom: "ampoule" }
          ]
        },
        {
          packageId: "PKG-6100-C", storageTemp: "ambient", status: "processing",
          items: [
            { name: "Surgical Gowns", quantity: 200, uom: "unit" },
            { name: "Sterile Drape Sheets", quantity: 150, uom: "unit" },
            { name: "Face Masks (N95)", quantity: 500, uom: "unit" },
            { name: "Surgical Caps", quantity: 300, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6100-D", storageTemp: "crt", status: "approved",
          items: [
            { name: "Saline 0.9% 1L", quantity: 100, uom: "bag" },
            { name: "Ringer's Lactate 500ml", quantity: 80, uom: "bag" },
            { name: "Dextrose 5% 1L", quantity: 50, uom: "bag" },
            { name: "Sterile Water 10ml", quantity: 200, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06105",
      orderId: "ORD-100205",
      dateInitiated: "Feb 01, 2026",
      paymentDate: "Feb 01, 2026",
      deliveryDate: "Feb 03, 2026",
      totalValue: 12500.00,
      packages: [
        {
          packageId: "PKG-6105-A", storageTemp: "ambient", status: "completed",
          items: [{ name: "Hand Sanitizer 5L", quantity: 5, uom: "jerrycan" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06110",
      orderId: "ORD-100210",
      dateInitiated: "Feb 02, 2026",
      paymentDate: "Feb 02, 2026",
      deliveryDate: null,
      totalValue: 95400.00,
      packages: [
        {
          packageId: "PKG-6110-A", storageTemp: "refrigerated", status: "dispatched",
          items: [
            { name: "Atracurium Injection", quantity: 50, uom: "ampoule" },
            { name: "Propofol 1% 20ml", quantity: 100, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6110-B", storageTemp: "crt", status: "dispatched",
          items: [
            { name: "Cannula 20G", quantity: 200, uom: "unit" },
            { name: "IV Giving Sets", quantity: 150, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06120",
      orderId: null,
      dateInitiated: "Feb 02, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 245000.00,
      packages: [
        {
          packageId: "PKG-6120-A", storageTemp: "ambient", status: "pending",
          items: [
            { name: "Examination Gloves (M)", quantity: 50, uom: "box" },
            { name: "Examination Gloves (L)", quantity: 50, uom: "box" },
            { name: "Alcohol Swabs", quantity: 5000, uom: "unit" },
            { name: "Wooden Tongue Depressors", quantity: 1000, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6120-R", storageTemp: "refrigerated", status: "completed",
          items: [
            { name: "Povidone Iodine 500ml", quantity: 20, uom: "bottle" },
            { name: "Hydrogen Peroxide", quantity: 10, uom: "bottle" },
            { name: "Surgical Spirit", quantity: 25, uom: "bottle" },
            { name: "Chlorhexidine Gluconate", quantity: 15, uom: "bottle" }
          ]
        },
        {
          packageId: "PKG-6120-C", storageTemp: "crt", status: "pending",
          items: [
            { name: "Gauze Swabs 10x10", quantity: 100, uom: "pack" },
            { name: "Crepe Bandage 10cm", quantity: 50, uom: "roll" },
            { name: "Adhesive Tape 2.5cm", quantity: 40, uom: "roll" },
            { name: "Orthopedic Padding", quantity: 30, uom: "roll" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06130",
      orderId: "ORD-100230",
      dateInitiated: "Feb 03, 2026",
      paymentDate: "Feb 03, 2026",
      deliveryDate: null,
      totalValue: 56000.00,
      packages: [
        {
          packageId: "PKG-6130-A", storageTemp: "frozen", status: "delayed",
          items: [
            { name: "Yellow Fever Vaccine", quantity: 100, uom: "vial" },
            { name: "Oral Polio Vaccine", quantity: 150, uom: "vial" },
            { name: "Measles Vaccine", quantity: 80, uom: "vial" },
            { name: "BCG Vaccine", quantity: 120, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06140",
      orderId: "ORD-100240",
      dateInitiated: "Feb 03, 2026",
      paymentDate: "Feb 04, 2026",
      deliveryDate: "Feb 06, 2026",
      totalValue: 12000.00,
      packages: [
        {
          packageId: "PKG-6140-A", storageTemp: "ambient", status: "delivered with issues",
          items: [{ name: "Patient Files", quantity: 500, uom: "unit" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06150",
      orderId: "ORD-100250",
      dateInitiated: "Feb 04, 2026",
      paymentDate: "Feb 04, 2026",
      deliveryDate: null,
      totalValue: 312000.00,
      packages: [
        {
          packageId: "PKG-6150-A", storageTemp: "refrigerated", status: "delivered",
          items: [
            { name: "Lab Reagent Kit Alpha", quantity: 4, uom: "kit" },
            { name: "Lab Reagent Kit Beta", quantity: 2, uom: "kit" },
            { name: "Calibration Fluid", quantity: 10, uom: "vial" },
            { name: "Control Serum", quantity: 8, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6150-B", storageTemp: "ambient", status: "dispatched",
          items: [
            { name: "Microscope Slides", quantity: 10, uom: "box" },
            { name: "Glass Beakers 250ml", quantity: 20, uom: "unit" },
            { name: "Pipettes 10ml", quantity: 100, uom: "unit" },
            { name: "Test Tube Racks", quantity: 5, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6150-C", storageTemp: "crt", status: "completed",
          items: [
            { name: "Distilled Water 5L", quantity: 10, uom: "jerrycan" },
            { name: "Formalin 10% Solution", quantity: 5, uom: "bottle" },
            { name: "Xylene Solution", quantity: 2, uom: "bottle" },
            { name: "Paraffin Wax", quantity: 20, uom: "kg" }
          ]
        },
        {
          packageId: "PKG-6150-F", storageTemp: "frozen", status: "approved",
          items: [
            { name: "Lab Coats (L)", quantity: 10, uom: "unit" },
            { name: "Biohazard Bags (L)", quantity: 500, uom: "unit" },
            { name: "Sharp Containers 5L", quantity: 20, uom: "unit" },
            { name: "Safety Goggles", quantity: 15, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06160",
      orderId: null,
      dateInitiated: "Feb 04, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 15000.00,
      packages: [
        {
          packageId: "PKG-6160-A", storageTemp: "ambient", status: "rejected",
          items: [{ name: "Printer Toner (Black)", quantity: 3, uom: "cartridge" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06170",
      orderId: "ORD-100270",
      dateInitiated: "Feb 05, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: null,
      totalValue: 48000.00,
      packages: [
        {
          packageId: "PKG-6170-A", storageTemp: "ambient", status: "processing",
          items: [
            { name: "Bed Sheets (Blue)", quantity: 100, uom: "unit" },
            { name: "Pillow Cases", quantity: 100, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6170-F", storageTemp: "frozen", status: "processing",
          items: [
            { name: "Patient Gowns", quantity: 50, uom: "unit" },
            { name: "Blankets (Wool)", quantity: 30, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06180",
      orderId: "ORD-100280",
      dateInitiated: "Feb 05, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: "Feb 06, 2026",
      totalValue: 8800.00,
      packages: [
        {
          packageId: "PKG-6180-A", storageTemp: "crt", status: "completed",
          items: [
            { name: "Dexamethasone 4mg", quantity: 100, uom: "ampoule" },
            { name: "Furosemide 20mg", quantity: 50, uom: "ampoule" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06190",
      orderId: null,
      dateInitiated: "Feb 06, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 192000.00,
      packages: [
        {
          packageId: "PKG-6190-A", storageTemp: "refrigerated", status: "approved",
          items: [
            { name: "Human Albumin 20%", quantity: 10, uom: "vial" },
            { name: "Immunoglobulin G", quantity: 5, uom: "vial" },
            { name: "Factor VIII", quantity: 8, uom: "vial" },
            { name: "Erythropoietin", quantity: 20, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6190-B", storageTemp: "ambient", status: "approved",
          items: [
            { name: "Disposable Syringes 5ml", quantity: 1000, uom: "unit" },
            { name: "Disposable Syringes 10ml", quantity: 1000, uom: "unit" },
            { name: "Hypodermic Needles 21G", quantity: 2000, uom: "unit" },
            { name: "Hypodermic Needles 23G", quantity: 2000, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06200",
      orderId: "ORD-100300",
      dateInitiated: "Feb 06, 2026",
      paymentDate: "Feb 06, 2026",
      deliveryDate: null,
      totalValue: 2400.00,
      packages: [
        {
          packageId: "PKG-6200-A", storageTemp: "ambient", status: "packed",
          items: [{ name: "Hand Soap 500ml", quantity: 24, uom: "bottle" }]
        }
      ]
    }
  ];

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
    console.log(ordReqData)
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