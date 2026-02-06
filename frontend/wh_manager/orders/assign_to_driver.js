import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import {getStorageTempIcon} from "../../global.js"

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.page-container')
    .innerHTML = `
      <nav class="sidebar"></nav>

      <main class="main-content">
        <header class="logo-container"></header>

        <h2>Dispatch Center</h2>
        <div class="stat"> <span class="js-no-of-orders"></span> Packages Ready to Ship</div>

        <div class="search-dashboard">
          <div class="search-row">
            <div class="search-group flex-2">
              <label><i class="fas fa-hospital"></i> Organization / Package ID</label>
              <input type="text" id="idSearch" placeholder="e.g. Nairobi Hospital or ORD-101-R">
            </div>

            <div class="search-group flex-1">
              <label><i class="fas fa-map-marked-alt"></i> County</label>
              <select id="countyFilter">
                <option value="">All Counties</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Machakos">Machakos</option>
              </select>
            </div>

            <div class="search-group flex-1">
              <label><i class="fas fa-map-pin"></i> Zone (Sub-County)</label>
              <select id="zoneFilter">
                <option value="">All Zones</option>
                <option value="Upper Hill">Upper Hill</option>
                <option value="Parklands">Parklands</option>
                <option value="Kikuyu">Kikuyu</option>
              </select>
            </div>
          </div>

          <div class="temp-filter-row">
            <span>Storage Condition:</span>
            <div class="temp-options">
              <button class="t-btn" data-temp="A"><i class="fa-solid fa-house-medical-circle-check"></i> Ambient</button>
              <button class="t-btn" data-temp="C"><i class="fas fa-thermometer-half"></i> CRT</button>
              <button class="t-btn" data-temp="R"><i class="fas fa-snowflake"></i> Ref</button>
              <button class="t-btn" data-temp="F"><i class="fas fa-icicles"></i> Frozen</button>
            </div>
            <button class="reset-btn js-reset-btn">Reset All</button>
          </div>
        </div>

        <section class="dispatch-grid js-dispatch-grid"></section>

        <div class="no-match-container hidden js-no-match-container"></div>

        <div class="overlay" id="items-overlay">
          <div class="items-preview-container">
            <div class="header-close-container">
              <div class="preview-header">
                <span class="order-package-ids js-order-package-ids"></span> for
                <span class="org-name js-org-name">Kenyatta Hospital</span>
              </div>
              <div>
                <button class="close-overlay-btn js-close-overlay-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <table>
              <thead>
                <th>No.</th>
                <th>ITEM NAME</th>
                <th>REQUESTED QUANTITY</th>
              </thead>
              <tbody id="items-tbody"></tbody>
            </table>
          </div>
        </div>

        <div class="overlay" id="dispatch-overlay">
          <div class="notification-container">
            <div class="modal-body">
              <p>Assign
                <span class="highlight-order js-pkg-id"></span>,
                <span class="dispatch-org-name js-dispatch-org-name"></span>
                to
                <span class="highlight-driver js-driver-name"></span>?
              </p>
            </div>

            <div class="modal-footer">
              <button class="btn-no js-btn-no">No, Cancel</button>
              <button class="btn-yes">Yes, Assign</button>
            </div>
          </div>
        </div>
      </main>
    `

  renderSidebar('assign_to_driver')
  displayNoMatch()

  const orderDriverData = {
    "dispatchQueue": [
      {
        "orderId": "ORD-101", "institutionName": "Kenyatta National Hospital", "subCounty": "Upper Hill", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-101-R", "storageTemp": "refrigerated", "weightTonnes": 0.05, "items": [{ "itemName": "Insulin Vials", "qty": "50 Units" }, { "itemName": "Oxytocin", "qty": "10 Ampoules" }] },
          { "packageId": "ORD-101-A", "storageTemp": "ambient", "weightTonnes": 0.40, "items": [{ "itemName": "Standard Syringes 5ml", "qty": "500 Pieces" }, { "itemName": "Gauze Rolls", "qty": "100 Units" }] }
        ]
      },
      {
        "orderId": "ORD-102", "institutionName": "Aga Khan Hospital", "subCounty": "Parklands", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-102-F", "storageTemp": "frozen", "weightTonnes": 0.12, "items": [{ "itemName": "Lab Reagents", "qty": "5 Kits" }, { "itemName": "Enzyme Samples", "qty": "12 Vials" }] },
          { "packageId": "ORD-102-R", "storageTemp": "refrigerated", "weightTonnes": 0.08, "items": [{ "itemName": "Vaccine Batch B12", "qty": "100 Vials" }] }
        ]
      },
      {
        "orderId": "ORD-103", "institutionName": "PCEA Kikuyu Hospital", "subCounty": "Kikuyu", "county": "Kiambu",
        "packages": [{ "packageId": "ORD-103-C", "storageTemp": "crt", "weightTonnes": 0.15, "items": [{ "itemName": "Antiretroviral Meds", "qty": "100 Packs" }, { "itemName": "Inhaler Units", "qty": "25 Pieces" }] }]
      },
      {
        "orderId": "ORD-104", "institutionName": "Nairobi Women's Hospital", "subCounty": "Hurlingham", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-104-R", "storageTemp": "refrigerated", "weightTonnes": 0.08, "items": [{ "itemName": "Hepatitis B Vaccine", "qty": "30 Doses" }] },
          { "packageId": "ORD-104-F", "storageTemp": "frozen", "weightTonnes": 0.03, "items": [{ "itemName": "Frozen Plasma", "qty": "2 Units" }] }
        ]
      },
      {
        "orderId": "ORD-105", "institutionName": "Gertrude's Children's", "subCounty": "Muthaiga", "county": "Nairobi",
        "packages": [{ "packageId": "ORD-105-F", "storageTemp": "frozen", "weightTonnes": 0.02, "items": [{ "itemName": "Stem Cell Units", "qty": "1 Unit" }] }]
      },
      {
        "orderId": "ORD-106", "institutionName": "MP Shah Hospital", "subCounty": "Parklands", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-106-A", "storageTemp": "ambient", "weightTonnes": 1.10, "items": [{ "itemName": "Bed Linens", "qty": "50 Rolls" }, { "itemName": "Patient Gowns", "qty": "100 Units" }] },
          { "packageId": "ORD-106-C", "storageTemp": "crt", "weightTonnes": 0.20, "items": [{ "itemName": "Sensitive Antibiotics", "qty": "200 Vials" }] }
        ]
      },
      {
        "orderId": "ORD-107", "institutionName": "Thika Level 5", "subCounty": "Thika Town", "county": "Kiambu",
        "packages": [{ "packageId": "ORD-107-C", "storageTemp": "crt", "weightTonnes": 2.50, "items": [{ "itemName": "Cough Syrup", "qty": "500 Bottles" }, { "itemName": "Paracetamol", "qty": "2000 Strips" }] }]
      },
      {
        "orderId": "ORD-108", "institutionName": "Mater Misericordiae", "subCounty": "South B", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-108-A", "storageTemp": "ambient", "weightTonnes": 0.35, "items": [{ "itemName": "First Aid Kits", "qty": "20 Units" }] },
          { "packageId": "ORD-108-R", "storageTemp": "refrigerated", "weightTonnes": 0.05, "items": [{ "itemName": "Anti-D Immunoglobulin", "qty": "5 Vials" }] }
        ]
      },
      {
        "orderId": "ORD-109", "institutionName": "Karen Hospital", "subCounty": "Karen", "county": "Nairobi",
        "packages": [{ "packageId": "ORD-109-R", "storageTemp": "refrigerated", "weightTonnes": 0.04, "items": [{ "itemName": "Tetanus Toxoid", "qty": "15 Vials" }] }]
      },
      {
        "orderId": "ORD-110", "institutionName": "St. Francis Hospital", "subCounty": "Kasarani", "county": "Nairobi",
        "packages": [{ "packageId": "ORD-110-A", "storageTemp": "ambient", "weightTonnes": 0.90, "items": [{ "itemName": "Wheelchairs", "qty": "5 Units" }, { "itemName": "Crutches", "qty": "15 Pairs" }] }]
      },
      {
        "orderId": "ORD-111", "institutionName": "Limuru Nursing Home", "subCounty": "Limuru", "county": "Kiambu",
        "packages": [{ "packageId": "ORD-111-C", "storageTemp": "crt", "weightTonnes": 0.10, "items": [{ "itemName": "Supplements", "qty": "200 Bottles" }] }]
      },
      {
        "orderId": "ORD-112", "institutionName": "Coptic Hospital", "subCounty": "Ngong Road", "county": "Nairobi",
        "packages": [{ "packageId": "ORD-112-R", "storageTemp": "refrigerated", "weightTonnes": 0.22, "items": [{ "itemName": "Blood Bags (O-)", "qty": "10 Units" }] }]
      },
      {
        "orderId": "ORD-113", "institutionName": "Machakos Level 5", "subCounty": "Machakos Central", "county": "Machakos",
        "packages": [{ "packageId": "ORD-113-A", "storageTemp": "ambient", "weightTonnes": 1.40, "items": [{ "itemName": "I.V. Fluids", "qty": "300 Bags" }] }]
      },
      {
        "orderId": "ORD-114", "institutionName": "Avenue Hospital", "subCounty": "Parklands", "county": "Nairobi",
        "packages": [
          { "packageId": "ORD-114-F", "storageTemp": "frozen", "weightTonnes": 0.05, "items": [{ "itemName": "Vaccine Seed", "qty": "2 Vials" }] },
          { "packageId": "ORD-114-A", "storageTemp": "ambient", "weightTonnes": 0.15, "items": [{ "itemName": "Safety Boxes", "qty": "50 Units" }] }
        ]
      },
      {
        "orderId": "ORD-115", "institutionName": "Nazareth Hospital", "subCounty": "Limuru", "county": "Kiambu",
        "packages": [{ "packageId": "ORD-115-R", "storageTemp": "refrigerated", "weightTonnes": 0.18, "items": [{ "itemName": "Anti-Venom", "qty": "5 Vials" }] }]
      }
    ],
    "drivers": [
      {
        "driverId": "DRV-1",
        "name": "Samuel Mutua",
        "homeCounty": "Nairobi",
        "primaryZone": "Upper Hill",
        "vehicle": {
          "type": "Ref-Van",
          "category": "Light",
          "maxTons": 3.5,
          "currentLoad": 1.2,
          "tempCaps": ["refrigerated", "crt", "ambient"]
        }
      },
      {
        "driverId": "DRV-2",
        "name": "Jane Wanjiku",
        "homeCounty": "Nairobi",
        "primaryZone": "Parklands",
        "vehicle": {
          "type": "Box-Truck",
          "category": "Medium",
          "maxTons": 12.0,
          "currentLoad": 4.5,
          "tempCaps": ["ambient", "crt"]
        }
      },
      {
        "driverId": "DRV-3",
        "name": "David Otieno",
        "homeCounty": "Kiambu",
        "primaryZone": "Kikuyu",
        "vehicle": {
          "type": "Cold-Truck",
          "category": "Medium",
          "maxTons": 15.0,
          "currentLoad": 0.0,
          "tempCaps": ["frozen", "refrigerated", "crt", "ambient"]
        }
      },
      {
        "driverId": "DRV-4",
        "name": "Alice Koech",
        "homeCounty": "Machakos",
        "primaryZone": "Machakos Central",
        "vehicle": {
          "type": "Heavy-Hauler",
          "category": "Heavy",
          "maxTons": 28.0,
          "currentLoad": 18.5,
          "tempCaps": ["ambient"]
        }
      }
    ]
  }

  const pkgToShipElem = document.querySelector('.js-no-of-orders')
  const dispatchGridElem = document.querySelector('.js-dispatch-grid')
  const dispatchOdersFragment = document.createDocumentFragment()

  //Find the number of packages awaiting dispatch
  function getNoOfPackages() {
    let noOfPackages = 0
    orderDriverData['dispatchQueue'].forEach(ord => {
      noOfPackages += ord.packages.length
    })

    return noOfPackages
  }

  // Generates the html for each of the cards in the page
  function displayPackages(pkg, order) {
    const orderCard = document.createElement('div')
    orderCard.className = 'dispatch-card js-dispatch-card'

    orderCard.innerHTML = `
        <div class="card-badge"><i class="${getStorageTempIcon(pkg.storageTemp)}"></i></div>
        <div class="card-main">
          <div class="order-meta">
            <span class="order-no">${order.orderId}</span><span class="package-id">${pkg['packageId']} (${pkg.storageTemp})</span>
            <h3>${order.institutionName}</h3>
            <p class="location-tag"><i class="fas fa-map-marker-alt"></i> ${order.subCounty}, ${order.county}</p>
          </div>

          <div class="package-details">
            <div class="detail-item">
              <button class="view-items-btn js-view-items-btn" data-package-id="${pkg.packageId}">
                <i class="fas fa-boxes"></i>
                <span class="no-of-items">${pkg['items'].length} Item(s)</span>
                <span class="view-items-text">View items</span>
              </button>
            </div>
            <div class="detail-item">
              <i class="fas fa-weight-hanging"></i>
              <span>${pkg['weightTonnes'] * 1000} kg (${pkg['weightTonnes']}t)</span>
            </div>
          </div>
        </div>

        <div class="assignment-footer">
          <label>Assign Driver
            <span class="assign-driver-key">(🔵- different 🟢- same)</span>
          </label>
          <div class="action-row">
            <select class="driver-select js-driver-select-${pkg.packageId}">
              <option value="">Select Driver...</option>
            </select>
            <button class="btn-dispatch js-btn-dispatch" data-package-id="${pkg.packageId}">
              Dispatch
            </button>
          </div>
        </div>
      `

    dispatchOdersFragment.appendChild(orderCard)
  }

  //Function to control how the drivers are displayed in the the select driver drop down
  function displayDrivers(packageId, storageTemp, packageWt, subCnty, cnty) {
    const selectElem = document.querySelector(`.js-driver-select-${packageId}`);
    if (!selectElem) return;

    const selectDriverFragment = document.createDocumentFragment();

    orderDriverData.drivers.forEach(driver => {
      const vehicleData = driver.vehicle
      const { tempCaps, currentLoad, maxTons } = vehicleData
      const { primaryZone, homeCounty } = driver

      if (!tempCaps.includes(storageTemp)) {
        return;
      }

      const totalLoad = Number((currentLoad + packageWt).toFixed(2))
      if (totalLoad >= maxTons) {
        return;
      }

      const zoneMatch = primaryZone.toLowerCase() === subCnty.toLowerCase();
      const countyMatch = homeCounty.toLowerCase() === cnty.toLowerCase();
      const option = document.createElement('option');
      option.value = driver.driverId;

      let status = ''
      if (zoneMatch && countyMatch) {
        status = '🟢Zone 🟢County'
      } else if (zoneMatch) {
        status = '🟢Zone 🔵County'
      } else if (countyMatch) {
        status = '🔵Zone 🟢County'
      } else {
        status = '🔵Zone 🔵County'
      }

      option.textContent = `${driver.name} @ ${currentLoad}t | ${status}`;
      selectDriverFragment.appendChild(option)
    })

    selectElem.appendChild(selectDriverFragment)
  }

  //Displays the packages in the html
  function displayAllPackages(orderDriverData) {
    pkgToShipElem.textContent = getNoOfPackages()
    dispatchGridElem.innerHTML = ``

    orderDriverData['dispatchQueue'].forEach(ord => {
      ord['packages'].forEach(pkg => {
        displayPackages(pkg, ord)
      })
    })

    // Display all the cards that have been stored in the fragment to the page
    dispatchGridElem.appendChild(dispatchOdersFragment)
  }

  displayAllPackages(orderDriverData)
  displayRightDrivers(orderDriverData)

  function displayRightDrivers(orderDriverData) {
    orderDriverData['dispatchQueue'].forEach(ord => {
      ord['packages'].forEach(pkg => {
        displayDrivers(pkg.packageId, pkg.storageTemp,
          pkg.weightTonnes, ord.subCounty, ord.county)
      })
    })
  }

  const overlay = document.getElementById('items-overlay')
  const itemsFragment = document.createDocumentFragment()

  //Button to view items in each of the packages
  document.querySelectorAll('.js-view-items-btn')
    .forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.classList.add('active')
        const pkgId = btn.dataset.packageId

        orderDriverData['dispatchQueue'].forEach(order => {
          order['packages'].forEach(pkg => {
            const itemsTbodyElem = document.getElementById('items-tbody')

            if (pkgId === pkg['packageId']) {
              document.querySelector('.js-order-package-ids')
                .innerHTML = `${pkg.packageId}`
              document.querySelector('.js-org-name')
                .innerHTML = `${order.institutionName}`
              itemsTbodyElem.innerHTML = ``

              for (const i in pkg['items']) {
                const itemNo = parseInt(i) + 1
                const item = pkg['items'][i]

                const tblRow = document.createElement('tr')

                tblRow.innerHTML = `
                  <td>${itemNo}</td>
                  <td>${item.itemName}</td>
                  <td>${item.qty}</td>
                `
                itemsFragment.appendChild(tblRow)
              }

              itemsTbodyElem.appendChild(itemsFragment)
            }
          })
        })

        xRemoveOverlay(overlay)
      })
    })

  clickToRemoveOverlay(overlay)

  //Displays the notification message to assign dispatch driver
  function displayDispatchNotif() {
    const overlay = document.getElementById('dispatch-overlay')
    const dispatchOrgElem = document.querySelector('.js-dispatch-org-name')

    document.querySelectorAll('.js-btn-dispatch')
      .forEach(dispatchBtn => {
        const packageId = dispatchBtn.dataset.packageId
        const selectElem = document.querySelector(`.js-driver-select-${packageId}`)

        dispatchBtn.addEventListener('click', () => {
          if (selectElem.value === '') {
            alert('Select a Driver for dispatch.')
          } else {
            overlay.classList.add('active')
            document.querySelector('.js-pkg-id')
              .textContent = packageId

            orderDriverData['dispatchQueue'].forEach(ord => {
              ord['packages'].forEach(pkg => {
                if (packageId === pkg.packageId) {
                  dispatchOrgElem.textContent = ord.institutionName
                }
              })
            })

            orderDriverData['drivers'].forEach(driver => {
              if (selectElem.value === driver.driverId)
                document.querySelector('.js-driver-name')
                  .textContent = driver.name
            })

            xRemoveOverlay(overlay)
          }
        })

        clickToRemoveOverlay(overlay)
      })

  }

  displayDispatchNotif()


  // ##Code that handles the filtering logic
  function searchOrders(searchText, selectedCounty, selectedZone, selectedTemp, orders) {
    const searchTerm = searchText.toLowerCase().trim()

    return orders.map(order => {
      const countyMatch = selectedCounty === `` || order.county === selectedCounty
      const zoneMatch = selectedZone === '' || order.subCounty === selectedZone

      const hospitalMatch = order.institutionName.toLowerCase().includes(searchTerm)

      const filterdPackages = order.packages.filter(pkg => {
        const tempMatch = selectedTemp === '' || pkg.packageId.endsWith(`-${selectedTemp}`)

        const idMatch = searchTerm === '' || pkg.packageId.toLowerCase().includes(searchTerm)

        return zoneMatch && countyMatch && tempMatch && (idMatch || hospitalMatch)
      })

      if (filterdPackages.length > 0) {
        return { ...order, packages: filterdPackages }
      }
      return null
    }).filter(order => order !== null)
  }

  const searchInputElem = document.getElementById('idSearch')
  const countyDropdown = document.getElementById('countyFilter')
  const zoneDropdown = document.getElementById('zoneFilter')
  const noMatchElem = document.querySelector('.js-no-match-container')

  let currentTempFilter = ``
  document.querySelectorAll('.t-btn')
    .forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active')

        currentTempFilter = button.dataset.temp

        updateHandler()
      })
    })

  //Displays the filtered results in the page
  function updateHandler() {
    const filteredResults = searchOrders(
      searchInputElem.value,
      countyDropdown.value,
      zoneDropdown.value,
      currentTempFilter,
      orderDriverData['dispatchQueue']
    )
    dispatchGridElem.innerHTML = ``

    if(filteredResults.length === 0){
      noMatchElem.classList.remove('hidden')
    }else{
      noMatchElem.classList.add('hidden')
      filteredResults.forEach(order => {
        order.packages.forEach(pkg => {
          displayPackages(pkg, order)
        })
      }) 
    }

    pkgToShipElem.textContent = filteredResults.length

    dispatchGridElem.appendChild(dispatchOdersFragment)
    displayRightDrivers(orderDriverData)
  }

  searchInputElem.addEventListener('input', updateHandler)
  countyDropdown.addEventListener('change', updateHandler)
  zoneDropdown.addEventListener('change', updateHandler)

  document.querySelector('.js-reset-btn')
    .addEventListener('click', () => {
      searchInputElem.value = countyDropdown.value = zoneDropdown.value = ``
      document.querySelectorAll('.t-btn').forEach(b => b.classList.remove('active'));
      noMatchElem.classList.add('hidden')

      displayAllPackages(orderDriverData)
      displayRightDrivers(orderDriverData)
    })
  // ##End of code that handles the filtering logic
})
