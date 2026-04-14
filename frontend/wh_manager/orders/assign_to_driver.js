import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import {getStorageTempIcon, renderSuccessErrorOverlay, triggerStatus, whManagerPagesLink} from "../../global.js"

document.addEventListener('DOMContentLoaded', async () => {

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
              <button class="btn-yes" id="assignDriver">Yes, Assign</button>
            </div>
          </div>
        </div>
      </main>
    `

  renderSidebar('assign_to_driver')
  renderSuccessErrorOverlay()
  displayNoMatch()

  const orderDriverData = await getPackagesDriversData()

  const pkgToShipElem = document.querySelector('.js-no-of-orders')
  const dispatchGridElem = document.querySelector('.js-dispatch-grid')
  const dispatchOdersFragment = document.createDocumentFragment()

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
              Assign
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

      // Remove vehicles where the storage temp. does not include the packages storage temp.
      if (!tempCaps.includes(storageTemp)) {
        return;
      }

      // Remove vehicle if current load + package load is greater than max. vehicle tonnes
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
    pkgToShipElem.textContent = orderDriverData.dispatchQueue.length
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
              if (Number(selectElem.value) === driver.driverId)
                document.querySelector('.js-driver-name')
                  .textContent = driver.name
            })

            const packId = Number(packageId.slice(4, -2))
            const drivId = Number(selectElem.value)

            document.getElementById('assignDriver')
              .addEventListener('click', async () => {
                const response = await fetch(`${whManagerPagesLink}/assignPackageDriver`, 
                  {
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({packId, drivId})
                  }
                )

                const res = await response.json()
                triggerStatus(res.msg)
              }, { once: true }
              )

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

const getPackagesDriversData = async () => {
  const response = await fetch(`${whManagerPagesLink}/getPackagesDriversData`)
  const res = await response.json()
  return res.packages_drivers_data
}