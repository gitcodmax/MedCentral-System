import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { populateDropdowns } from "../standards.js";
import { renderSuccessErrorOverlay, triggerStatus, whManagerPagesLink } from "../../global.js";

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.page-container')
    .innerHTML = `
            <nav class="sidebar"></nav>

            <div class="registry-container">
                <header class="logo-container"></header>

                <section class="form-panel">
                    <div class="header">
                        <h2><i class="fas fa-plus-circle"></i> Register New Item</h2>
                        <p>Classify stock based on Admin-defined standards.</p>
                    </div>

                    <form id="itemForm">
                        <div class="input-grid">

                            <div class="form-group margin-set">
                                <label>Item Name</label>
                                <input type="text" id="itemName" placeholder="e.g. Amoxicillin 500mg" required>
                            </div>

                            <div class="form-group margin-set">
                                <label>SKU Code</label>
                                <input type="text" id="sku" placeholder="REF-00123" required>
                            </div>

                            <div class="form-group">
                                <label>Category <small>(Admin Standard)</small></label>
                                <select id="categorySelect" required>
                                    <option value="">Select category...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Storage Temp <small>(Admin Standard)</small></label>
                                <select id="tempSelect" required>
                                    <option value="">Select Storage Temp...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>UOM <small>(Bulk Unit)</small></label>
                                <select id="uomSelect" required>
                                    <option value="">Select Unit of Measurement...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Selling Unit <small>(Retail Unit)</small></label>
                                <select id="sellingUnitSelect" required>
                                    <option value="">Select Selling Unit...</option>
                                </select>
                            </div>

                            <div class="form-group margin-set">
                                <label>Price per Selling Unit (Ksh)</label>
                                <input type="number" id="pricePerUnit" placeholder="0.00" min='1' required>
                            </div>

                            <div class="form-group margin-set">
                                <label>Units per Bulk</label>
                                <input type="number" id="unitsPerBulk" placeholder="0" min=1 required>
                            </div>

                            <div class="form-group margin-set">
                                <label>Minimum Stock Level</label>
                                <input type="number" id="minStockLevel" placeholder="0" min=1 required>
                            </div>

                            <div class="form-group margin-set note-container">
                                <p class="form-note"><i>*Choose shelf location for the new item in Shelf Details Page.</i></p>
                            </div>

                            <button type="submit" class="submit-btn">Add to Registry</button>   
                        </div>
                    </form>
                </section>

                <div class="overlay" id="confirmItemOverlay">
                    <div class="confirmation-card">
                        <div class="confirm-header">
                            <h3><i class="fas fa-check-double"></i> Confirm Item Details</h3>
                            <p>Please verify the information below before finalizing the registry entry.</p>
                        </div>
                
                        <div class="confirm-body">
                            <div class="confirm-section">
                                <span class="label">Product Name</span>
                                <div class="value large" id="conf-name"></div>
                            </div>
                
                            <div class="confirm-row">
                                <div class="confirm-section">
                                    <span class="label">SKU Code</span>
                                    <div class="value" id="conf-sku"></div>
                                </div>
                                <div class="confirm-section">
                                    <span class="label">Category</span>
                                    <div class="value" id="conf-category"></div>
                                </div>
                            </div>
                
                            <div class="confirm-row">
                                <div class="confirm-section">
                                    <span class="label">Storage Temperature</span>
                                    <div class="value" id="conf-temp"></div>
                                </div>
                                <div class="confirm-section">
                                    <span class="label">Unit Price (Ksh)</span>
                                    <div class="value highlight" id="conf-price"></div>
                                </div>
                            </div>
                
                            <div class="confirm-row">
                                <div class="confirm-section">
                                    <span class="label">Units Per Bulk</span>
                                    <div class="value" id="conf-bunits"></div>
                                </div>
                                <div class="confirm-section">
                                    <span class="label">Minimum Stock Level</span>
                                    <div class="value" id="conf-minstock"></div>
                                </div>
                            </div>
                
                            <div class="confirm-unit-logic">
                                <div class="unit-box">
                                    <span class="label">Bulk UOM</span>
                                    <div class="value" id="conf-uom">Carton</div>
                                </div>
                                <i class="fas fa-arrow-right"></i>
                                <div class="unit-box">
                                    <span class="label">Selling Unit</span>
                                    <div class="value" id="conf-sell">Strip</div>
                                </div>
                            </div>
                        </div>
                
                        <div class="confirm-footer">
                            <button class="btn-edit js-btn-no">Back to Edit</button>
                            <button class="btn-confirm" id="saveNewItemBtn">Confirm & Save</button>
                        </div>
                    </div>
                </div>

                <section class="catalog-panel">
                    <div class="catalog-header">
                        <div class="left-catalog-header">
                            <h3><i class="fas fa-list"></i> Current Catalog</h3>
                        </div>
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="search-input" placeholder="Search SKU/Name...">
                        </div>
                    </div>

                    <div class="table-scroll">
                        <table class="catalog-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>UOM / Selling Unit</th>
                                    <th>Temp</th>
                                    <th>Price</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody class="js-items-tbody"></tbody>
                        </table>
                    </div>

                    <div class="no-match-container hidden js-no-match-container"></div>
                </section>

                <div class="overlay" id="delete-item-overlay">
                    <div class="notification-container">
                        <div class="modal-content">
                        <h3>Confirm Deletion</h3>
                        
                        <p class="item-info">
                            Delete <strong>SKU: <span class="confirm-sku js-confirm-sku"></span> </strong>
                            Name: <span class="confirm-name js-confirm-name"></span>?
                        </p>
                    
                        <div class="buttons">
                            <button class="btn-no js-btn-no" id="cancelDelete">No, Cancel</button>
                            <button class="btn-yes" id="confirmItemDelete">Yes, Delete</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        `

  renderSidebar('item_registry')
  displayNoMatch()
  renderSuccessErrorOverlay()

  const catalogItems = await getCatalogItems()
  const itemsTbody = document.querySelector('.js-items-tbody')

  function displayItems(catalogItems) {
    const itemsFragment = document.createDocumentFragment()
    catalogItems.forEach(item => {
      const tblRow = document.createElement('tr')
      const tempLetter = (item.temp).slice(0, 1)

      tblRow.innerHTML = `
                <td class="sku-code"><strong>${item.sku}</strong></td>
                <td>${item.name}</td>
                <td>${item.uom} / ${item.sellingUnit}</td>
                <td><span class="badge ${tempLetter}">${tempLetter}</span></td>
                <td>${item.price}</td>
                <td class="btn-td"><button 
                class="delete-item-btn" 
                data-sku="${item.sku}">
                DELETE</button></td>
            `

      itemsFragment.appendChild(tblRow)
    })

    return itemsFragment
  }

  itemsTbody.appendChild(displayItems(catalogItems))

  await populateDropdowns()

  //Populating the overlay with data from the inputs for confirmation
  const form = document.getElementById('itemForm')
  const confirmItemOverlay = document.getElementById('confirmItemOverlay')
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemName = form.elements.itemName.value.trim()
    const sku = form.elements.sku.value.trim()
    const categorySelectedElem = form.elements.categorySelect
    const tempSelectedElem = form.elements.tempSelect
    const uomSelectedElem = form.elements.uomSelect
    const sellingUnitSelectedElem = form.elements.sellingUnitSelect
    const pricePerUnit = form.elements.pricePerUnit.value
    const unitsPerBulk = form.elements.unitsPerBulk.value
    const minStockLevel = form.elements.minStockLevel.value

    document.getElementById('conf-name').textContent = itemName
    document.getElementById('conf-sku').textContent = sku
    document.getElementById('conf-category').textContent = categorySelectedElem.selectedOptions[0].text
    document.getElementById('conf-temp').textContent = tempSelectedElem.selectedOptions[0].text
    document.getElementById('conf-price').textContent = pricePerUnit
    document.getElementById('conf-uom').textContent = uomSelectedElem.selectedOptions[0].text
    document.getElementById('conf-sell').textContent = sellingUnitSelectedElem.selectedOptions[0].text
    document.getElementById('conf-bunits').textContent = unitsPerBulk
    document.getElementById('conf-minstock').textContent = minStockLevel

    const categoryId = categorySelectedElem.value
    const storageTempCode = tempSelectedElem.value
    const bulkUom = uomSelectedElem.value
    const sellingUom = sellingUnitSelectedElem.value

    confirmItemOverlay.classList.add('active')

    document.getElementById('saveNewItemBtn')
      .addEventListener('click', async () => {
        await saveNewInvItem(
          itemName, sku, categoryId, storageTempCode, bulkUom,
          sellingUom, unitsPerBulk, pricePerUnit, minStockLevel
        )
      }, { once: true })

    xRemoveOverlay(confirmItemOverlay)
    clickToRemoveOverlay(confirmItemOverlay)
  })

  // Search logic
  const noMatchContainerElem = document.querySelector('.no-match-container')
  const searchTerm = document.getElementById('search-input')
  searchTerm.addEventListener('keyup', handleSearch)
  function handleSearch() {
    const searchValue = searchTerm.value.toLowerCase().trim()
    const searchResult = catalogItems.filter(item => {
      const searchMatch = item.sku.toLowerCase().includes(searchValue)
        || item.name.toLowerCase().includes(searchValue)
      return searchMatch
    })

    itemsTbody.innerHTML = ``
    if (searchResult.length > 0) {
      itemsTbody.appendChild(displayItems(searchResult))
      noMatchContainerElem.classList.add('hidden')
    } else {
      noMatchContainerElem.classList.remove('hidden')
    }
  }

  // Notification Message to delete item
  const overlay = document.getElementById('delete-item-overlay')
  itemsTbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-item-btn')) {
      const deleteBtn = e.target
      const btnSku = deleteBtn.dataset.sku

      catalogItems.forEach(item => {
        if (item.sku === btnSku) {
          document.querySelector('.js-confirm-sku')
            .textContent = btnSku
          document.querySelector('.js-confirm-name')
            .textContent = item.name
          overlay.classList.add('active')

          document.getElementById('confirmItemDelete')
            .addEventListener('click', async () => {
              const sku = item.sku

              const response = await fetch(`${whManagerPagesLink}/deleteItem`, 
                {
                  method: 'PUT', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({sku})
                }
              )

              const res = await response.json()
              triggerStatus(res.msg)
            }, {once: true})

          clickToRemoveOverlay(overlay)
          xRemoveOverlay(overlay)
        }
      })
    }
  })
})

const getCatalogItems = async () => {
  const response = await fetch(`${whManagerPagesLink}/getCatalogItems`)
  const res = await response.json()
  return res.catalog_items
}

// Used in item registry page in wh manager portal and admin's inventory page
// to add a new item to the inventory
export async function saveNewInvItem(itemName, sku, categoryId, storageTempCode, bulkUom,
  sellingUom, unitsPerBulk, pricePerUnit, minStockLevel
) {
  const response = await fetch(`${whManagerPagesLink}/saveNewItem`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName, sku, categoryId, storageTempCode, bulkUom,
        sellingUom, unitsPerBulk, pricePerUnit, minStockLevel
      })
    }
  )
  const res = await response.json()
  triggerStatus(res.msg)
}