import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "./overlay.js";

document.addEventListener('DOMContentLoaded', () => {

  renderSidebar()

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

  const dispatchOdersFragment = document.createDocumentFragment()

  //Display all the packages in the page
  orderDriverData['dispatchQueue'].forEach(order => {
    const orderPackage = order['packages']

    orderPackage.forEach(pkg => {
      const orderCard = document.createElement('div')
      orderCard.className = 'dispatch-card js-dispatch-card'

      let storageTempIcon = 'fa-solid fa-house-medical-circle-check'
      if (pkg.storageTemp === 'crt') {
        storageTempIcon = `fas fa-thermometer-half`
      } else if (pkg.storageTemp === 'refrigerated') {
        storageTempIcon = `fas fa-snowflake`
      } else if (pkg.storageTemp === 'frozen') {
        storageTempIcon = `fas fa-icicles`
      }

      orderCard.innerHTML = `
        <div class="card-badge"><i class="${storageTempIcon}"></i></div>
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
    })
  })

  document.querySelector('.js-dispatch-grid')
    .appendChild(dispatchOdersFragment)

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

  orderDriverData['dispatchQueue'].forEach(ord => {
    ord['packages'].forEach(pkg => {
      displayDrivers(pkg.packageId, pkg.storageTemp,
        pkg.weightTonnes, ord.subCounty, ord.county)
    })
  })


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


})
