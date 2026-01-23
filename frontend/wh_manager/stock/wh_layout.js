import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { populateDropdowns } from "../standards.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  populateDropdowns()
  displayNoMatch()

  const shelfDetailsOverlay = document.getElementById('shelfConfirmOverlay')
  const form = document.getElementById('shelfCreationForm')
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const shelfId = document.getElementById('shelfId').value
    const storageZone = document.getElementById('tempSelect').value
    const targetUOM = document.getElementById('uomSelect').value
    const binCapacity = document.getElementById('binCapacity').value
    const wtLimitElem = document.getElementById('weightLimit')
    const wtLimit = Number(wtLimitElem.value) || 0;

    document.getElementById('show-shelfId').textContent = shelfId
    document.getElementById('show-shelfZone').textContent = storageZone
    document.getElementById('show-shelfUom').textContent = targetUOM
    document.getElementById('show-shelfCap').textContent = binCapacity
    document.getElementById('show-shelfWeight').textContent = wtLimit

    shelfDetailsOverlay.classList.add('active')
    xRemoveOverlay(shelfDetailsOverlay)
    clickToRemoveOverlay(shelfDetailsOverlay)
  })


  const warehouseInventoryMap = [
    {
      shelfId: "A1-RACK-01",
      itemSku: "MED-AMX-001",
      itemName: "Amoxicillin 500mg",
      tempZone: "A",
      bulkUOM: "Carton",
      totalCapacity: 100,
      remainingUnits: 15,
      spaceLeftPercent: 15,
      eligibleItems: []
    },
    {
      shelfId: "FREEZE-S1",
      itemSku: "—",
      itemName: "UNALLOCATED",
      tempZone: "F",
      bulkUOM: "Box",
      totalCapacity: 30,
      remainingUnits: 30,
      spaceLeftPercent: 100,
      eligibleItems: [
        { sku: "VAC-PLI-007", name: "Polio Vaccine" },
        { sku: "LAB-RGT-009", name: "COVID Test Kit" }
      ]
    },
    {
      shelfId: "COLD-R04",
      itemSku: "—",
      itemName: "UNALLOCATED",
      tempZone: "R",
      bulkUOM: "Vial",
      totalCapacity: 200,
      remainingUnits: 200,
      spaceLeftPercent: 100,
      eligibleItems: [
        { sku: "INS-GLR-004", name: "Insulin SoloStar" },
        { sku: "VAC-BCG-002", name: "BCG Vaccine" }
      ]
    },
    {
      shelfId: "A1-RACK-02",
      itemSku: "SUR-GLV-003",
      itemName: "Surgical Gloves",
      tempZone: "A",
      bulkUOM: "Carton",
      totalCapacity: 50,
      remainingUnits: 5,
      spaceLeftPercent: 10,
      eligibleItems: []
    },
    {
      shelfId: "CRT-ZONE-01",
      itemSku: "—",
      itemName: "UNALLOCATED",
      tempZone: "C",
      bulkUOM: "Crate",
      totalCapacity: 40,
      remainingUnits: 40,
      spaceLeftPercent: 100,
      eligibleItems: [
        { sku: "IVF-SAL-006", name: "Normal Saline 0.9%" }
      ]
    },
    {
      shelfId: "A2-RACK-05",
      itemSku: "PAN-TAB-005",
      itemName: "Panadol Extra",
      tempZone: "A",
      bulkUOM: "Box",
      totalCapacity: 500,
      remainingUnits: 150,
      spaceLeftPercent: 30,
      eligibleItems: []
    },
    {
      shelfId: "COLD-R05",
      itemSku: "ANT-CEF-010",
      itemName: "Ceftriaxone 1g",
      tempZone: "R",
      bulkUOM: "Vial",
      totalCapacity: 100,
      remainingUnits: 60,
      spaceLeftPercent: 60,
      eligibleItems: []
    },
    {
      shelfId: "FREEZE-S2",
      itemSku: "—",
      itemName: "UNALLOCATED",
      tempZone: "F",
      bulkUOM: "Box",
      totalCapacity: 25,
      remainingUnits: 25,
      spaceLeftPercent: 100,
      eligibleItems: [
        { sku: "LAB-RGT-009", name: "COVID Test Kit" }
      ]
    },
    {
      shelfId: "A3-RACK-01",
      itemSku: "SYR-DIS-008",
      itemName: "Disposable Syringes",
      tempZone: "A",
      bulkUOM: "Box",
      totalCapacity: 120,
      remainingUnits: 20,
      spaceLeftPercent: 16.6,
      eligibleItems: []
    },
    {
      shelfId: "BULK-PAL-01",
      itemSku: "—",
      itemName: "UNALLOCATED",
      tempZone: "A",
      bulkUOM: "Pallet",
      totalCapacity: 10,
      remainingUnits: 10,
      spaceLeftPercent: 100,
      eligibleItems: [
        { sku: "MED-EQP-500", name: "Oxygen Concentrators" }
      ]
    }
  ];

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
        <td><strong class="grn-cell">${shelf.shelfId}</strong></td>
        <td>${displayItemName}</td>
        <td><span class="badge ${shelf.tempZone}">${shelf.tempZone}</span></td>
        <td>${shelf.bulkUOM}</td>
        <td>
          <div class="capacity-container">
            <div class="capacity-bar">
              <div class="fill" style="width: ${shelf.spaceLeftPercent}%;"></div>
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
        document.querySelector('.js-shelf-id').textContent = btnShelfId
        document.querySelector('.js-item-name').textContent = shelfDetails.itemName

        deleteItemOverlay.classList.add('active')

        xRemoveOverlay(deleteItemOverlay)
        clickToRemoveOverlay(deleteItemOverlay)
      }

      //Set up the assign shelf button and display items in the items to assign table
      const assignShelfNoMatchElem = document.getElementById('assignShelfNoMatchContainer')
      if (e.target.classList.contains('assign-shelf')) {
        document.getElementById('targetShelfId').textContent = shelfDetails.shelfId
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
    return warehouseInventoryMap.find(shelf => shelf.shelfId === btnShelfId)
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