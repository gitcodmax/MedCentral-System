import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { populateDropdowns } from "../standards.js";
import { renderSuccessErrorOverlay, triggerStatus, whManagerPagesLink } from "../../global.js";

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.page-container')
    .innerHTML = `     
    <nav class="sidebar"></nav>

    <main class="shelf-mgmt-container">
      <header class="logo-container"></header>

      <section class="shelf-form-card">
        <div class="card-header">
          <h2><i class="fas grn-i fa-ruler-combined"></i> <span class="container-title">Define Storage Capacity</span>
          </h2>
          <p>Set the physical limits and unit types for this location.</p>
        </div>

        <form id="shelfCreationForm">
          <div class="form-group">
            <label>Shelf/Rack ID</label>
            <input type="text" id="shelfId" class="shelf-id-input" placeholder="e.g., AISLE-04-RACK-B" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Storage Zone</label>
              <select id="tempSelect" required>
                <option value="">Select Storage Zone...</option>
              </select>
            </div>
            <div class="form-group">
              <label>Target Bulk UOM</label>
              <select id="uomSelect" required>
                <option value="">Select UOM...</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Max Unit Capacity</label>
              <input type="number" id="binCapacity" class="unit-wt-no" placeholder="e.g. 50 Cartons" min="1" required>
            </div>
          </div>

          <button type="submit" class="create-btn">Register Shelf Location</button>
        </form>
      </section>

      <div id="shelfConfirmOverlay" class="overlay">
        <div class="confirmation-card">
          <div class="confirm-header">
            <h3><i class="fas fa-barcode grn-i"></i> Verify Shelf Configuration</h3>
            <p>Please confirm the physical limits and storage standards for this unit.</p>
          </div>

          <div class="confirm-body">
            <div class="confirm-section highlight-bg">
              <span class="label">Storage Location ID</span>
              <div class="value large" id="show-shelfId"></div>
            </div>

            <div class="confirm-row">
              <div class="confirm-section">
                <span class="label">Temperature Zone</span>
                <div class="value" id="show-shelfZone">
                </div>
              </div>
              <div class="confirm-section">
                <span class="label">Target Bulk UOM</span>
                <div class="value" id="show-shelfUom"></div>
              </div>
            </div>

            <div class="confirm-row">
              <div class="confirm-section">
                <span class="label">Max Unit Capacity</span>
                <div class="value" id="show-shelfCap"></div>
              </div>
            </div>
          </div>

          <div class="confirm-footer">
            <button class="btn-no js-btn-no">Adjust Details</button>
            <button class="btn-yes" id="createShelfBtn">Confirm & Initialize</button>
          </div>
        </div>
      </div>

      <section class="shelf-display-card">
        <div class="display-header">
          <h3><i class="fas grn-i fa-th-list"></i>
            <span class="container-title">Warehouse Inventory Map</span>
          </h3>

          <div class="filter-container">
            <div class="filter-wrapper">

              <div class="filter-inputs">
                <div class="filter-group search-flex">
                  <label><i class="fas fa-search"></i> Search Inventory</label>
                  <div class="search-input-wrapper">
                    <input type="text" id="inventorySearch" placeholder="Enter Shelf ID or Item Name...">
                  </div>
                </div>

                <div class="filter-group">
                  <label><i class="fas fa-door-open"></i> Occupancy Status</label>
                  <select id="filterOccupancy">
                    <option value="">All Shelves</option>
                    <option value="empty">Unallocated (Empty)</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label><i class="fas fa-thermometer-half"></i> Temp Zone</label>
                  <select id="filterTemp">
                    <option value="">All Zones</option>
                    <option value="A">Ambient | A</option>
                    <option value="C">CRT | C</option>
                    <option value="R">Refrigerated | R</option>
                    <option value="F">Frozen | F</option>
                  </select>
                </div>

                <div class="filter-group">
                  <label><i class="fas fa-box-open"></i> Bulk UOM</label>
                  <select id="filterUOM">
                    <option value="">All Units</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Crate">Crate</option>
                    <option value="Carton">Carton</option>
                    <option value="Box">Box</option>
                  </select>
                </div>
              </div>

              <div class="filter-group filter-btn-container">
                <button class="reset-btn js-reset-btn" disabled>
                  <i class="fas fa-undo"></i> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="shelf-master-table" id="shelfMasterTable">
            <thead>
              <tr>
                <th>Shelf ID</th>
                <th>Item Name</th>
                <th>Temp Zone</th>
                <th>Bulk UOM</th>
                <th>Remaining Space</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="shelfTableBody" class="shelf-tbody"></tbody>
          </table>

          <div class="no-match-container hidden js-no-match-container"></div>
        </div>

        <div class="overlay" id="deleteItemOverlay">
          <div class="notification-container">
            <div class="modal-content">
              <h3>Confirm Deletion</h3>

              <p class="item-info">
                Delete <strong>Shelf: <span class="js-shelf-id"></span> </strong>
                with Item: <span class="js-item-name"></span>?
              </p>

              <div class="buttons">
                <button class="btn-no js-btn-no" id="cancelDelete">No, Cancel</button>
                <button class="btn-yes" id="confirmDelete">Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div class="overlay" id="assignmentModal">
          <div class="assignment-card">
            <div class="assignment-header">
              <div class="shelf-context">
                <span class="context-label">Assigning to Shelf:</span>
                <span class="context-id" id="targetShelfId">AISLE-04-RACK-B</span>
              </div>
              <button class="close-overlay-btn js-close-overlay-btn">&times;</button>
            </div>

            <div class="assignment-body">

              <div class="instructions-search-container">
                <div class="instruction-text">
                  <h3>Select Item to Allocate</h3>
                  <p>Choose an item from the registry.</p>
                </div>

                <div class="item-search-box">
                  <i class="fas fa-search"></i>
                  <input type="text" id="registrySearch" placeholder="Search by SKU or Name...">
                </div>
              </div>

              <div class="table-container">
                <table class="assignment-table">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>SKU</th>
                      <th>Item Name</th>
                      <th>No. of Items to Assign</th>
                    </tr>
                  </thead>
                  <tbody id="registryItemsToAssign"></tbody>
                </table>
              </div>

              <div class="no-match-container hidden js-no-match-container" id="assignShelfNoMatchContainer"></div>
            </div>

            <div class="assignment-footer">
              <div class="capacity-warning" id="capWarning">
                <i class="fas fa-exclamation-triangle"></i> Remaining Shelf Space: <span id="spaceLimit">50</span> Units
              </div>
              <div class="action-buttons">
                <button class="btn-no js-btn-no">Cancel</button>
                <button class="btn-yes">Confirm Assignment</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main> 
    `

  renderSidebar('wh_layout')
  populateDropdowns()
  displayNoMatch()
  renderSuccessErrorOverlay()

  // Creating a new shelf
  const shelfDetailsOverlay = document.getElementById('shelfConfirmOverlay')
  const form = document.getElementById('shelfCreationForm')
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const shelfLabel = document.getElementById('shelfId').value
    const storageZone = document.getElementById('tempSelect').value
    const targetUOMElem = document.getElementById('uomSelect')
    const binCapacity = document.getElementById('binCapacity').value

    document.getElementById('show-shelfId').textContent = shelfLabel
    document.getElementById('show-shelfZone').textContent = storageZone
    document.getElementById('show-shelfUom').textContent = targetUOMElem.selectedOptions[0].text
    document.getElementById('show-shelfCap').textContent = binCapacity

    const bulkUom = targetUOMElem.value

    // Button to send the new shelf details to the server
    document.getElementById('createShelfBtn')
      .addEventListener('click', async () => {
        const response = await fetch(`${whManagerPagesLink}/createNewShelf`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shelfLabel, storageZone, bulkUom, binCapacity })
          }
        )

        const res = await response.json()
        triggerStatus(res.msg)
      }, { once: true })

    shelfDetailsOverlay.classList.add('active')
    xRemoveOverlay(shelfDetailsOverlay)
    clickToRemoveOverlay(shelfDetailsOverlay)
  })

  // Warehouse inventory Map Table
  const warehouseInventoryMap = await getWhInventoryMap()

  const shelfTableBodyElem = document.getElementById('shelfTableBody')

  //Show the shelves that exist
  function displayShelves(shelves) {
    const shelfTableFragment = document.createDocumentFragment()
    shelves.forEach(shelf => {
      const tblRow = document.createElement('tr')

      const itemName = shelf.itemName
      const buttonHtml = itemName === 'UNALLOCATED'
        ? `<button data-shelf-id="${shelf.shelfId}" class="assign-shelf">ASSIGN</button>`
        : `<button data-shelf-id="${shelf.shelfId}" class="delete-shelf">DELETE</button>`;
      const displayItemName = itemName === 'UNALLOCATED'
        ? `<span class="unallocated-tag"><strong>UNALLOCATED</strong></span>`
        : `${itemName}`

      tblRow.innerHTML = `              
        <td><strong class="grn-cell">${shelf.shelfLabel}</strong></td>
        <td>${displayItemName}</td>
        <td><span class="badge ${shelf.tempZone}">${shelf.tempZone}</span></td>
        <td>${shelf.bulkUOM}</td>
        <td>
          <div class="capacity-container">
            <div class="capacity-bar">
              <div class="fill" style="width: ${shelf.spaceFilledPercent}%;"></div>
            </div>
            <small>${shelf.remainingUnits} / ${shelf.totalCapacity} Left</small>
          </div>
        </td>
        <td class="btn-container">${buttonHtml}</td>             
      `

      shelfTableFragment.appendChild(tblRow)
    })

    return shelfTableFragment
  }
  shelfTableBodyElem.appendChild(displayShelves(warehouseInventoryMap))

  // Set up the overlay
  const assignShelfOverlay = document.getElementById('assignmentModal')
  const deleteItemOverlay = document.getElementById('deleteItemOverlay')
  document.getElementById('shelfMasterTable')
    .addEventListener('click', (e) => {
      const btn = e.target
      const btnShelfId = btn.dataset.shelfId
      const shelfDetails = getShelf(btnShelfId)

      //Set up the delete shelf button
      if (e.target.classList.contains('delete-shelf')) {
        document.querySelector('.js-shelf-id').textContent = btnShelfId + ' -> ' + shelfDetails.shelfLabel
        document.querySelector('.js-item-name').textContent = shelfDetails.itemName

        deleteItemOverlay.classList.add('active')

        xRemoveOverlay(deleteItemOverlay)
        clickToRemoveOverlay(deleteItemOverlay)
      }

      //Set up the assign shelf button and display items in the items to assign table
      const assignShelfNoMatchElem = document.getElementById('assignShelfNoMatchContainer')
      if (e.target.classList.contains('assign-shelf')) {
        document.getElementById('targetShelfId').textContent = shelfDetails.shelfId + ' -> ' + shelfDetails.shelfLabel
        displayRegistryItems(shelfDetails.eligibleItems)

        assignShelfOverlay.classList.add('active')

        xRemoveOverlay(assignShelfOverlay)
        clickToRemoveOverlay(assignShelfOverlay)

        //Search for the item name or sku that matches
        const registrySearchElem = document.getElementById('registrySearch')
        registrySearchElem.addEventListener('keyup', () => {
          const searchValue = registrySearchElem.value.toLowerCase().trim()
          const searchResults = shelfDetails.eligibleItems.filter((shelf) => {
            const searchMatch = shelf.name.toLowerCase().includes(searchValue)
              || shelf.sku.toLowerCase().includes(searchValue)

            return searchMatch
          })
          displayRegistryItems(searchResults)

          displayNoMatchMessage(searchResults, assignShelfNoMatchElem)
        })
      }
    })

  //Returns the shelf details that matches the button shelf id
  function getShelf(btnShelfId) {
    return warehouseInventoryMap.find(shelf => shelf.shelfId === Number(btnShelfId))
  }

  //Show the registry items for assignment to a specific shelf
  function displayRegistryItems(eligibleItems) {
    const registryItemsTbody = document.getElementById('registryItemsToAssign')
    registryItemsTbody.innerHTML = ``

    const assignItemTableFragment = document.createDocumentFragment()
    eligibleItems.forEach(item => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
      <td><input type="radio" name="selectedItem" value="${item.sku}"></td>
      <td><strong class="grn-cell">${item.sku}</strong></td>
      <td>${item.name}</td>
      <td>
        <div class="qty-input-wrapper">
          <input type="number" class="qty-field" value="0" min="0" placeholder="0">
          <small class="helper-text">Enter quantity if stock exists</small>
        </div>
      </td>
    `

      assignItemTableFragment.appendChild(tblRow)
    })
    registryItemsTbody.appendChild(assignItemTableFragment)
  }

  //FIltering logic for the warehouse inventory map table
  const invSearchElem = document.getElementById('inventorySearch')
  const occupancyElem = document.getElementById('filterOccupancy')
  const tempElem = document.getElementById('filterTemp')
  const uomElem = document.getElementById('filterUOM')

  const noMatchContainerElem = document.querySelector('.no-match-container')

  const resetBtn = document.querySelector('.js-reset-btn')

  function filterShelves() {
    resetBtn.disabled = false
    const result = warehouseInventoryMap.filter(shelf => {
      const shelfIdMatch = shelf.shelfId.toLowerCase().includes(invSearchElem.value.toLowerCase().trim())
      const itemNameMatch = shelf.itemName.toLowerCase().includes(invSearchElem.value.toLowerCase().trim())

      const unallocatedMatch = occupancyElem.value === ''
        || (shelf.itemName === 'UNALLOCATED' && occupancyElem.value === 'empty')
      const allocatedMatch = occupancyElem.value === ''
        || (shelf.itemName !== 'UNALLOCATED' && occupancyElem.value === 'occupied')

      const tempMatch = tempElem.value === '' || shelf.tempZone === tempElem.value

      const uomMatch = uomElem.value === '' || shelf.bulkUOM.toLowerCase() === uomElem.value.toLowerCase()

      return (shelfIdMatch || itemNameMatch) && (unallocatedMatch || allocatedMatch)
        && tempMatch && uomMatch
    })

    shelfTableBodyElem.innerHTML = ``
    shelfTableBodyElem.appendChild(displayShelves(result))

    displayNoMatchMessage(result, noMatchContainerElem)
  }

  //Displays the no match found message when there is no result after searchin
  function displayNoMatchMessage(searchResult, noMatchContainerElem) {
    if (searchResult.length === 0) {
      noMatchContainerElem.classList.remove('hidden')
    } else {
      noMatchContainerElem.classList.add('hidden')
    }
  }

  invSearchElem.addEventListener('keyup', filterShelves)
  occupancyElem.addEventListener('change', filterShelves)
  tempElem.addEventListener('change', filterShelves)
  uomElem.addEventListener('change', filterShelves)

  resetBtn.addEventListener('click', () => {
    invSearchElem.value = occupancyElem.value = tempElem.value = uomElem.value = ``
    noMatchContainerElem.classList.add('hidden')

    shelfTableBodyElem.innerHTML = ``
    shelfTableBodyElem.appendChild(displayShelves(warehouseInventoryMap))

    resetBtn.disabled = true
  })
})

const getWhInventoryMap = async () => {
  const response = await fetch(`${whManagerPagesLink}/getWhInvMap`)
  const res = await response.json()
  return res.wh_inventory_map
}