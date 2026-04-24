import { renderSidebar } from "./sidebar.js";
import { handleOverlay, displayNoMatchFound, 
  renderSuccessErrorOverlay, triggerStatus, 
  adminPagesLink} from "../global.js";

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
    
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <main class="content">
        <div class="container">

          <section class="filters-card">
            <div class="filter-group">
              <label for="search">Search Item</label>
              <input type="text" id="search" class="input-field" placeholder="Search name or SKU...">
            </div>
            <div class="filter-group">
              <label for="cat-filter">Category</label>
              <select id="catFilter" class="input-field"></select>
            </div>
            <div class="filter-group">
              <label for="status-filter">Stock Status</label>
              <select id="status-filter" class="input-field">
                <option value="all">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="temp-filter">Storage Temp</label>
              <select id="tempFilter" class="input-field"></select>
            </div>
          </section>

          <section class="table-card">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Storage</th>
                  <th>Bulk / Selling</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="itemsTbody"></tbody>
            </table>

            <div class="no-match-container js-no-match-found hidden"></div>
          </section>
        </div>

        <div class="modal-overlay" id="itemOverlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>Add New Inventory Item</h3>
              <button class="modal-close-btn js-btn-close-overlay">&times;</button>
            </div>
            <div class="modal-body">
              <form class="form-grid">
                <div class="form-group full-width">
                  <label>Item Name</label>
                  <input type="text" class="input-field" required>
                </div>
                <div class="form-group">
                  <label>SKU</label>
                  <input type="text" class="input-field" required>
                </div>
                <div class="form-group">
                  <label>Category</label>
                  <select class="input-field" id="addItemCategoryInput" required></select>
                </div>
                <div class="form-group">
                  <label>Storage Temperature</label>
                  <select class="input-field" id="addItemStorageTempInput" required></select>
                </div>
                <div class="form-group">
                  <label>Bulk Unit</label>
                  <select class="input-field" id="addItemBulkUomInput" required></select>
                </div>
                <div class="form-group">
                  <label>Selling Unit</label>
                  <select class="input-field" id="addItemSellingUomInput" required></select>
                </div>
                <div class="form-group">
                  <label>Units per Bulk</label>
                  <input type="number" class="input-field">
                </div>
                <div class="form-group">
                  <label>Min. Stock Level</label>
                  <input type="number" class="input-field">
                </div>
                <div class="form-group">
                  <label>Price per selling unit</label>
                  <input type="number" class="input-field">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn discard-btn js-btn-close-overlay">Discard</button>
              <button class="btn btn-primary">Save to Inventory</button>
            </div>
          </div>
        </div>

        <div class="modal-overlay" id="configOverlay">
          <div class="modal-card">
            <div class="modal-header">
              <h3>System Configuration</h3>
              <button class="modal-close-btn js-btn-close-overlay">&times;</button>
            </div>
            <div class="tab-nav">
              <button class="tab-btn js-categories-tab-btn active">Categories</button>
              <button class="tab-btn js-storage-tab-btn">Storage Options</button>
              <button class="tab-btn js-uom-tab-btn">UOM</button>
            </div>
            <div class="modal-body">
              <div class="config-action-row">
                <input type="text" class="input-field" id="newValueInput" placeholder="Add new definition...">
                <button class="btn btn-primary js-add-new-value">Add</button>
              </div>

              <div class="config-list" id="categoriesList"></div>
              <div class="config-list" id="storageTempList"></div>
              <div class="config-list" id="uomList"></div>

            </div>
          </div>
        </div>

        <div class="modal-overlay" id="viewItemOverlay">
          <div class="modal-card detail-modal">
            <div class="modal-header detail-header">
              <div class="header-main">
                <span class="status-badge healthy" id="view-status">Healthy</span>
                <h3 class="global-item-name"></h3>
                <p class="sku-display">SKU: <span class="global-sku"></span></p>
              </div>
              <button class="modal-close-btn js-btn-close-overlay">&times;</button>
            </div>

            <div class="modal-body">
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Category</label>
                  <p id="viewCategory"></p>
                </div>
                <div class="detail-item">
                  <label>Storage Temperature</label>
                  <p id="viewTemp"><i class="fas fa-snowflake"></i></p>
                </div>

                <div class="detail-item">
                  <label>Bulk Unit</label>
                  <p id="viewBulkUnit"></p>
                </div>
                <div class="detail-item">
                  <label>Selling Unit</label>
                  <p id="viewSellingUnit"></p>
                </div>

                <div class="detail-item highlight">
                  <label>Current Stock</label>
                  <p id="viewCurrentStock"></p>
                </div>
                <div class="detail-item">
                  <label>Minimum Level</label>
                  <p id="viewMinLevel"></p>
                </div>

                <div class="detail-item">
                  <label>Price per Unit</label>
                  <p id="viewPrice"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-overlay" id="editItemOverlay">
          <div class="modal-card">
            <div class="modal-header edit-mode-header">
              <div>
                <span class="edit-badge"><i class="fas fa-pen"></i> Edit Mode</span>
                <h3 id="edit-modal-title">Edit Inventory Item</h3>
                <p class="sku-ref">Modifying SKU: <span class="global-sku"></span></p>
              </div>
              <button class="modal-close-btn js-btn-close-overlay">&times;</button>
            </div>

            <div class="modal-body">
              <form id="editItemForm" class="form-grid">
                <input type="hidden" id="edit-item-id">

                <div class="form-group full-width">
                  <label>Item Name</label>
                  <input type="text" id="edit-name" class="input-field">
                </div>

                <div class="form-group">
                  <label>SKU (Internal Tracking)</label>
                  <input type="text" id="edit-sku" class="input-field" readonly>
                  <small class="helper-text">SKU cannot be changed after creation.</small>
                </div>

                <div class="form-group">
                  <label>Category</label>
                  <select id="edit-category" class="input-field">
                    <option value="" disabled selected>Select category</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Storage Temperature</label>
                  <select id="edit-temp" class="input-field">
                    <option value="" disabled selected>Select storage temperature</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Price per Selling Unit ($)</label>
                  <input type="number" id="edit-price" class="input-field" step="0.01">
                </div>

                <div class="form-group">
                  <label>Bulk Unit (Packaging)</label>
                  <select id="edit-bulk" class="input-field">
                    <option value="" disabled selected>Select bulk unit</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Selling Unit (Smallest Unit)</label>
                  <select id="edit-selling" class="input-field">
                    <option value="" disabled selected>Select selling unit</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Units per Bulk</label>
                  <input type="number" id="edit-conversion" class="input-field">
                </div>

                <div class="form-group">
                  <label>Min. Stock Level (Alert Trigger)</label>
                  <input type="number" id="edit-min-level" class="input-field">
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button class="btn discard-btn js-btn-close-overlay">Cancel Changes</button>
              <button id="updateItemBtn" class="btn btn-primary">
                <i class="fas fa-check"></i> Update Item
              </button>
            </div>
          </div>
        </div>

        <div class="modal-overlay" id="adjustStockOverlay">
          <div class="modal-card adjust-modal">
            <div class="modal-header adjust-header">
              <div>
                <span class="adjust-badge"><i class="fas fa-balance-scale"></i> Inventory Reconciliation</span>
                <h3 class="global-item-name"></h3>
                <p class="sku-ref">SKU: <span class="global-sku"></span></p>
              </div>
              <button class="modal-close-btn js-btn-close-overlay">&times;</button>
            </div>

            <div class="modal-body">
              <div class="current-stock-display">
                <label>System Count (Before)</label>
                <div class="count-value"><span id="currentStockCount"></span> <small
                    id="adjustUnitLabel">Strips</small></div>
              </div>

              <form id="adjustmentForm">
                <div class="adjustment-action-grid">

                  <div class="form-group">
                    <label>New Quantity</label>
                    <input type="number" id="adjustQty" class="input-field qty-input" placeholder="0" min="1">
                  </div>
                </div>

                <div class="form-group" style="margin-top: 1.2rem;">
                  <label>Reason for Adjustment</label>
                  <textarea id="adjustReason" class="input-field" rows="3"
                    placeholder="Describe why this adjustment is being made..." required></textarea>
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button class="btn discard-btn js-btn-close-overlay">Cancel Changes</button>
              <button id="updateStockBtn" class="btn btn-primary">
                <i class="fas fa-check"></i> Update Stock Count
              </button>
            </div>
          </div>
        </div>

        <div class="modal-overlay" id="deleteItemOverlay">
          <div class="modal-card delete-modal">
            <div class="modal-body text-center">
              <div class="danger-icon-container">
                <i class="fas fa-exclamation-triangle"></i>
              </div>

              <h2>Delete Inventory Item?</h2>
              <p class="delete-warning">
                You are about to permanently remove <strong class="delete-item-name global-item-name"></strong> from the
                system.
                This action will archive all associated records and cannot be undone.
              </p>

              <div class="item-preview-card">
                <span class="delete-sku-label">SKU: <span class="global-sku"></span></span>
                <span>Current Stock: 
                  <span id="currentStockSellUom"></span> 
                </span>
              </div>

              <div class="delete-actions">
                <button class="btn delete-close-overlay-btn js-btn-close-overlay">
                  No, Keep Item
                </button>
                <button class="btn btn-danger-action" id="confirmDeleteBtn">
                  Yes, Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  
    `

  renderSuccessErrorOverlay()
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="dashboard-header">
      <div class="page-title">
        <h2>Inventory Management</h2>
      </div>
      <div class="left-header-actions">
        <button class="btn btn-open-config" id="openConfigBtn" title="System Configuration">
          <i class="fas fa-cog"></i>
        </button>
        <button class="btn btn-primary" id="openAddItemBtn">
          <i class="fas fa-plus"></i> Add New Item
        </button>
      </div>
    </div> 
  `
  displayNoMatchFound()

  const itemsDetails = await getItemsDetails()
  console.log(itemsDetails)
  const SystemConfig = await getSystemConfig()

  // Get Category Name
  const getCatName = (id) => SystemConfig.categories.find(c => c.id === id)?.name || "N/A";

  // Get Unit Name
  const getUnitName = (id) => SystemConfig.units.find(u => u.id === id)?.name || "N/A";

  const itemsTbodyElem = document.getElementById('itemsTbody')
  function displayTableItems(itemsData) {
    itemsTbodyElem.innerHTML = ''

    const itemsTableFrag = document.createDocumentFragment()
    itemsData.forEach(item => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
      <td>
        <strong>${item.name}</strong><br>
        <span class="sku">SKU: ${item.sku_code}</span>
      </td>
      <td>${getCatName(item.category_id)}</td>
      <td><span class="badge ${item.storage_temp_code}">${item.storage_temp_code}</span></td>
      <td>${getUnitName(item.bulk_uom_id)} / ${getUnitName(item.selling_uom_id)} (${item.units_per_bulk} units)</td>
      <td>${item.current_stock} ${getUnitName(item.bulk_uom_id)}</td>
      <td><span class="status-badge 
        ${item.status.toLowerCase() === 'out of stock' ? 'out' : item.status.toLowerCase()}"
        >${item.status}</span>
      </td>
      <td class="actions-cell" data-item-id=${item.item_id}>
        <i class="fas fa-eye" title="View"></i>
        <i class="fas fa-edit" title="Edit"></i>
        <i class="fas fa-balance-scale" title="Adjust Stock Amount"></i>
        <i class="fas fa-trash" title="Delete"></i>
      </td>
    `

      itemsTableFrag.appendChild(tblRow)
    })

    itemsTbodyElem.appendChild(itemsTableFrag)
  }
  displayTableItems(itemsDetails)

  // Create an array that matches other system config arrays for storage options
  // Used to display system config data
  const storageTempArr = SystemConfig.storageOptions
    .map(temp => ({
      id: temp.code,
      name: `${temp.label} (${temp.range})`
    })
    )

  // Arrays used to populate data in the select tags
  const categoryItems = (SystemConfig.categories || [])
    .map(c => ({ value: c.id, label: c.name }))

  const storageItems = (SystemConfig.storageOptions || [])
    .map(t => ({ value: t.code, label: `${t.description} (${t.temp_range})` }))

  const uomItems = (SystemConfig.units || [])
    .map(u => ({ value: u.id, label: u.name }))

  setSelectOptions(document.getElementById('catFilter'), categoryItems)
  setSelectOptions(document.getElementById('tempFilter'), storageItems)

  // Display the system config data on the overlay
  function displaySystemConfigData(SystemConfigArr, SystemConfigListElem) {
    SystemConfigListElem.innerHTML = ``
    const configListFrag = document.createDocumentFragment()
    SystemConfigArr.forEach(cat => {
      const div = document.createElement('div')
      div.className = 'config-item'

      div.innerHTML = `
        <span>${cat.name}</span>
        <div class="item-tools">
          <i class="fas fa-trash" title="Delete" data-field-id=${cat.id}></i>
        </div>
      `
      configListFrag.appendChild(div)
    })
    SystemConfigListElem.appendChild(configListFrag)
  }

  // Open the overlay to define the item categories and storage temperature
  const configOverlayElem = document.getElementById('configOverlay')
  document.getElementById('openConfigBtn')
    .addEventListener('click', () => {
      handleOverlay(configOverlayElem)

      const categoriesListElem = document.getElementById('categoriesList')
      const storageTempListElem = document.getElementById('storageTempList')
      const uomListElem = document.getElementById('uomList')

      // Hide the storage temp list at first
      if (document.querySelector('.js-categories-tab-btn')
        .classList.contains('active')
      ) {
        uomListElem.style.display = 'none'
        storageTempListElem.style.display = 'none'

        displaySystemConfigData(SystemConfig.categories, categoriesListElem)
      }

      configOverlayElem.addEventListener('click', (e) => {
        const categoriesTabBtnElem = document.querySelector('.js-categories-tab-btn')
        const storageTabBtnElem = document.querySelector('.js-storage-tab-btn')
        const uomTabBtnElem = document.querySelector('.js-uom-tab-btn')
        const newValueInputElem = document.getElementById('newValueInput')

        // Toggle storage temp tab btn
        if (e.target.classList.contains('js-storage-tab-btn')) {
          e.target.classList.add('active')
          categoriesTabBtnElem.classList.remove('active')
          uomTabBtnElem.classList.remove('active')

          categoriesListElem.style.display = 'none'
          uomListElem.style.display = 'none'
          storageTempListElem.style.display = 'flex'

          displaySystemConfigData(storageTempArr, storageTempListElem)
        }

        // Toggle item categories tab btn
        if (e.target.classList.contains('js-categories-tab-btn')) {
          e.target.classList.add('active')
          storageTabBtnElem.classList.remove('active')
          uomTabBtnElem.classList.remove('active')

          categoriesListElem.style.display = 'flex'
          uomListElem.style.display = 'none'
          storageTempListElem.style.display = 'none'
        }

        // Toggle bulk units tab btn
        if (e.target.classList.contains('js-uom-tab-btn')) {
          e.target.classList.add('active')
          storageTabBtnElem.classList.remove('active')
          categoriesTabBtnElem.classList.remove('active')

          uomListElem.style.display = 'flex'
          categoriesListElem.style.display = 'none'
          storageTempListElem.style.display = 'none'

          displaySystemConfigData(SystemConfig.units, uomListElem)
        }

        // Adding a new value for categories or storage temperature
        if (e.target.classList.contains('js-add-new-value')) {
          if (newValueInputElem.value === ``) {
            alert('Enter a new value')
          } else {
            if (document.querySelector('.js-categories-tab-btn')
              .classList.contains('active')
            ) {
              console.log('Categories Active')
              // Save the new category and display them in the categories list
            }

            if (document.querySelector('.js-storage-tab-btn')
              .classList.contains('active')
            ) {
              console.log('Storage Active')
              // Save the new category and display them in the storage list
            }
          }
        }
      })

    })

  // Open overlay to add a new item
  const addItemOverlayElem = document.getElementById('itemOverlay')
  document.getElementById('openAddItemBtn')
    .addEventListener('click', () => {
      handleOverlay(addItemOverlayElem)

      const selectCategoryInputElem = document.getElementById('addItemCategoryInput')
      setSelectOptions(selectCategoryInputElem, categoryItems)
      const selectStorageTempInputElem = document.getElementById('addItemStorageTempInput')
      setSelectOptions(selectStorageTempInputElem, storageItems)
      const bulkUomInputElem = document.getElementById('addItemBulkUomInput')
      setSelectOptions(bulkUomInputElem, uomItems)
      const sellingUomInputElem = document.getElementById('addItemSellingUomInput')
      setSelectOptions(sellingUomInputElem, uomItems)
    })

  // Get an item
  function getItemDetails(itemId) {
    return itemsDetails.find(item => item.item_id === Number(itemId))
  }

  // Return a string without spaces and only lowercase
  function normalizeText(value) {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
  }

  // Set up the select options
  function setSelectOptions(selectElem, items) {
    if (!selectElem) return

    // How the default option appears in the select tags
    let defaultPlaceholder = ``
    if (items === categoryItems) {
      if (selectElem.id === 'catFilter') {
        defaultPlaceholder = `<option value="" selected>All Categories</option>`
      } else {
        defaultPlaceholder = `<option value="" disabled selected>Select Category</option>`
      }
    } else if (items === storageItems) {
      if (selectElem.id === 'tempFilter') {
        defaultPlaceholder = `<option value="" selected>All Temp.</option>`
      } else {
        defaultPlaceholder = `<option value="" disabled selected>Select Storage Temp...</option>`
      }
    } else if (items === uomItems) {
      defaultPlaceholder = `<option value="" disabled selected>Select UOM</option>`
    }

    const prevValue = selectElem.value
    selectElem.innerHTML = `${defaultPlaceholder}`

    const frag = document.createDocumentFragment()
    items.forEach(({ value, label }) => {
      const opt = document.createElement('option')
      opt.value = value
      opt.textContent = label
      frag.appendChild(opt)
    })
    selectElem.appendChild(frag)

    // If the select already had a value and it's still present, restore it.
    if (prevValue && Array.from(selectElem.options).some(o => o.value === prevValue)) {
      selectElem.value = prevValue
    }
  }

  // Set up the selected value in the item
  function selectByLabel(selectElem, items, targetLabel) {
    if (!selectElem) return
    const target = normalizeText(targetLabel)
    const match = items.find(i => normalizeText(i.value) === target)
    if (match) selectElem.value = match.value
  }

  const viewItemOverlayElem = document.getElementById('viewItemOverlay')
  const editItemOverlayElem = document.getElementById('editItemOverlay')
  const adjustStockOverlayElem = document.getElementById('adjustStockOverlay')
  const deleteItemOverlayElem = document.getElementById('deleteItemOverlay')
  itemsTbodyElem.addEventListener('click', (e) => {
    const btnItemId = e.target.parentElement.dataset.itemId
    const item = getItemDetails(btnItemId)

    document.querySelectorAll('.global-item-name')
      .forEach(itemNameElem => {
        itemNameElem.textContent = item.name
      })
    document.querySelectorAll('.global-sku')
      .forEach(skuElem => {
        skuElem.textContent = item.sku_code
      })

    // View item details
    if (e.target.classList.contains('fa-eye')) {
      handleOverlay(viewItemOverlayElem)

      document.getElementById('viewCategory')
        .textContent = getCatName(item.category_id)
      document.getElementById('viewTemp')
        .textContent = item.storage_temp_code
      document.getElementById('viewBulkUnit')
        .textContent = getUnitName(item.bulk_uom_id)
      document.getElementById('viewSellingUnit')
        .textContent = getUnitName(item.selling_uom_id)
      const viewStatusElem = document.getElementById('view-status')
      viewStatusElem.textContent = item.status
      viewStatusElem.className = `status-badge ${item.status.toLowerCase() === 'out of stock'
        ? 'out'
        : item.status.toLowerCase()
        }`
      document.getElementById('viewCurrentStock')
        .textContent = `${item.total_selling_units} ${getUnitName(item.selling_uom_id)}${item.total_selling_units > 1 ? 's' : ''}`
      document.getElementById('viewMinLevel')
        .textContent = `${item.min_stock_level} ${getUnitName(item.bulk_uom_id)}${item.min_stock_level !== 1 ? 's' : ''}`
      document.getElementById('viewPrice')
        .textContent = `$${Number(item.price_per_selling).toFixed(2)}`
    }

    // Edit item details
    if (e.target.classList.contains('fa-edit')) {
      handleOverlay(editItemOverlayElem)

      // Populate edit form fields from InventoryMockData
      const editItemIdInput = document.getElementById('edit-item-id')
      const editNameInput = document.getElementById('edit-name')
      const editSkuInput = document.getElementById('edit-sku')
      const editPriceInput = document.getElementById('edit-price')
      const editUnitsPerBulkInput = document.getElementById('edit-conversion')
      const editMinLevelInput = document.getElementById('edit-min-level')

      if (editItemIdInput) editItemIdInput.value = item.item_id
      if (editNameInput) editNameInput.value = item.name
      if (editSkuInput) editSkuInput.value = item.sku_code
      if (editPriceInput) editPriceInput.value = Number(item.price_per_selling).toFixed(2)
      if (editUnitsPerBulkInput) editUnitsPerBulkInput.value = item.bulk_uom_id
      if (editMinLevelInput) editMinLevelInput.value = item.min_stock_level

      // Populate select options from SystemConfig, then select current values
      const editCategorySelect = document.getElementById('edit-category')
      if (editCategorySelect) {
        setSelectOptions(editCategorySelect, categoryItems)
        selectByLabel(editCategorySelect, categoryItems, item.category_id)
      }

      const editTempSelect = document.getElementById('edit-temp')
      if (editTempSelect) {
        setSelectOptions(editTempSelect, storageItems)
        // Inventory items store the storage code directly (C/R/A/F)
        if (item.storage_temp_code) editTempSelect.value = item.storage_temp_code
      }

      const editBulkSelect = document.getElementById('edit-bulk')
      if (editBulkSelect) {
        // Bulk Unit and Selling Unit share the same UOM options
        setSelectOptions(editBulkSelect, uomItems)
        selectByLabel(editBulkSelect, uomItems, item.bulk_uom_id)
      }

      const editSellingSelect = document.getElementById('edit-selling')
      if (editSellingSelect) {
        // Bulk Unit and Selling Unit share the same UOM options
        setSelectOptions(editSellingSelect, uomItems)
        selectByLabel(editSellingSelect, uomItems, item.selling_uom_id)
      }

      document.getElementById('updateItemBtn')
        .addEventListener('click', async () => {
          const response = await fetch(`${adminPagesLink}/updateItemsDetails`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                itemId: btnItemId,
                name: editNameInput.value,
                cat: editCategorySelect.value,
                storageTemp: editTempSelect.value,
                bulkUom: editBulkSelect.value,
                sellingUom: editSellingSelect.value,
                unitsPerBulk: editUnitsPerBulkInput.value,
                pricePerSelling: editPriceInput.value,
                minStockLevel: editMinLevelInput.value
              })
            }
          )

          const result = await response.json()
          triggerStatus(result.msg)
        }, { once: true })
    }

    // Adjust the stock amount
    if (e.target.classList.contains('fa-balance-scale')) {
      handleOverlay(adjustStockOverlayElem)

      document.getElementById('currentStockCount')
        .textContent = item.total_selling_units
      document.getElementById('adjustUnitLabel')
        .textContent = getUnitName(item.selling_uom_id)

      document.getElementById("updateStockBtn")
        .addEventListener('click', async () => {
          const newQtyElem = document.getElementById('adjustQty')
          const adjustReasonElem = document.getElementById('adjustReason')

          if(newQtyElem.value === '' || adjustReasonElem.value === ''){
            alert('All the fields should be filled!')
          }else{
            const response = await fetch(`${adminPagesLink}/updateCurrentStock`, 
              {
                method: 'PATCH', 
                headers: {
                  'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                  itemId: btnItemId, 
                  newStockQty: newQtyElem.value, 
                  adjustReason: adjustReasonElem.value
                })
              }
            )

            const result = await response.json()
            triggerStatus(result.msg)
          }

        })
    }

    // Delete an item
    if (e.target.classList.contains('fa-trash')) {
      handleOverlay(deleteItemOverlayElem)

      document.getElementById('currentStockSellUom')
        .textContent = `${item.total_selling_units} ${getUnitName(item.selling_uom_id)}`

      document.getElementById('confirmDeleteBtn')
        .addEventListener('click', async () => {
          const response = await fetch(`${adminPagesLink}/deleteItem`, 
            {
              method: 'DELETE', 
              headers: {
                'Content-Type': 'application/json'
              }, 
              body: JSON.stringify({itemId: btnItemId})
            }
          )
          const result = await response.json()
          triggerStatus(result.msg)
        })
    }
  })

  // Search & filter inventory Logic
  const searchInputElem = document.getElementById('search')
  const categoryFilterElem = document.getElementById('catFilter')
  const statusFilterElem = document.getElementById('status-filter')
  const tempFilterElem = document.getElementById('tempFilter')

  function applyFilters() {
    const searchTerm = normalizeText(searchInputElem?.value || '')
    const selectedCategory = categoryFilterElem?.value || ''
    const selectedStatus = statusFilterElem?.value || 'all'
    const selectedTemp = tempFilterElem?.value || ''

    const filtered = itemsDetails.filter(item => {
      if (searchTerm) {
        const name = normalizeText(item.name)
        const sku = normalizeText(item.sku_code)
        if (!name.includes(searchTerm) && !sku.includes(searchTerm)) {
          return false
        }
      }

      // Category filter (matches category id)
      if (selectedCategory && item.category_id !== Number(selectedCategory)) {
        return false
      }

      // Storage temperature filter (matches storage code C/R/A/F)
      if (selectedTemp && item.storage_temp_code !== selectedTemp) {
        return false
      }

      // Stock status filter
      if (selectedStatus && selectedStatus !== 'all') {
        const statusNorm = normalizeText(item.status)
        if (selectedStatus === 'out') {
          // Match "Out of Stock" and similar
          if (!statusNorm.startsWith('out')) return false
        } else if (statusNorm !== selectedStatus) {
          return false
        }
      }

      return true
    })

    if (filtered.length === 0) {
      itemsTbodyElem.innerHTML = ``
      document.querySelector('.js-no-match-found')
        .classList.remove('hidden')
    } else {
      displayTableItems(filtered)
      document.querySelector('.js-no-match-found')
        .classList.add('hidden')
    }
  }

  if (searchInputElem) searchInputElem.addEventListener('input', applyFilters)
  if (categoryFilterElem) categoryFilterElem.addEventListener('change', applyFilters)
  if (statusFilterElem) statusFilterElem.addEventListener('change', applyFilters)
  if (tempFilterElem) tempFilterElem.addEventListener('change', applyFilters)

})

// Get the System Config data: Categories, Storage Temp, Uom
async function getSystemConfig() {
  const response = await fetch(`${adminPagesLink}/getCatStorageUom`)
  const result = await response.json()
  return result.catStorageUomDetails
}

// Get all item details
async function getItemsDetails() {
  const response = await fetch(`${adminPagesLink}/getAllItems`)
  const result = await response.json()
  return result.itemsWithStatus
}