import { renderSidebar } from "./sidebar.js";
import { handleOverlay, displayNoMatchFound } from "../global.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="dashboard-header">
      <div class="page-title">
        <h1>Inventory Management</h1>
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

  const InventoryMockData = [
    {
      id: "INV-001",
      name: "Amoxicillin 500mg Capsules",
      sku: "PHARM-AMX-500",
      category: "cat_01", // Antibiotics
      storage: "C",       // Common Room
      bulkUnit: "u_01",    // Carton
      sellingUnit: "u_04", // Strip
      unitsPerBulk: 50,
      price: 12.50,
      currentStock: 450,
      minLevel: 100,
      status: "healthy",
      lastUpdated: "2026-02-24 09:15 AM"
    },
    {
      id: "INV-002",
      name: "Insulin Glargine (Lantus)",
      sku: "COLD-INS-GLA",
      category: "cat_02", // Vaccines
      storage: "R",       // Refrigerated
      bulkUnit: "u_02",    // Box
      sellingUnit: "u_03", // Vial
      unitsPerBulk: 5,
      price: 85.00,
      currentStock: 12,
      minLevel: 25,
      status: "low",
      lastUpdated: "2026-02-25 14:30 PM"
    },
    {
      id: "INV-003",
      name: "Surgical Face Masks (3-Ply)",
      sku: "PPE-MSK-003",
      category: "cat_03", // Surgical Supplies
      storage: "A",       // Ambient
      bulkUnit: "u_02",    // Box
      sellingUnit: "u_05", // Piece
      unitsPerBulk: 100,
      price: 0.50,
      currentStock: 0,
      minLevel: 500,
      status: "out of stock",
      lastUpdated: "2026-02-20 11:00 AM"
    },
    {
      id: "INV-004",
      name: "Normal Saline 0.9% (500ml)",
      sku: "IVF-NS-500",
      category: "cat_04", // IV Fluids
      storage: "C",       // Common Room
      bulkUnit: "u_09",    // Crate
      sellingUnit: "u_06", // Bottle
      unitsPerBulk: 24,
      price: 4.20,
      currentStock: 156,
      minLevel: 48,
      status: "healthy",
      lastUpdated: "2026-02-24 16:45 PM"
    },
    {
      id: "INV-005",
      name: "Paracetamol 500mg",
      sku: "PHARM-PCM-500",
      category: "cat_05", // Analgesics
      storage: "C",       // Common Room
      bulkUnit: "u_02",    // Box
      sellingUnit: "u_04", // Strip
      unitsPerBulk: 10,
      price: 2.00,
      currentStock: 85,
      minLevel: 100,
      status: "low",
      lastUpdated: "2026-02-25 08:20 AM"
    },
    {
      id: "INV-006",
      name: "Latex Examination Gloves (M)",
      sku: "PPE-GLV-LAT-M",
      category: "cat_07", // Consumables
      storage: "A",       // Ambient
      bulkUnit: "u_01",    // Carton
      sellingUnit: "u_05", // Piece
      unitsPerBulk: 1000,
      price: 0.15,
      currentStock: 2400,
      minLevel: 1000,
      status: "healthy",
      lastUpdated: "2026-02-22 13:10 PM"
    },
    {
      id: "INV-007",
      name: "Oxytocin 10IU Injection",
      sku: "MAT-OXY-010",
      category: "cat_02", // Vaccines/Maternity
      storage: "R",       // Refrigerated
      bulkUnit: "u_08",    // Pack
      sellingUnit: "u_07", // Ampoule
      unitsPerBulk: 10,
      price: 15.00,
      currentStock: 45,
      minLevel: 50,
      status: "low",
      lastUpdated: "2026-02-25 10:55 AM"
    },
    {
      id: "INV-008",
      name: "Frozen Plasma Units",
      sku: "BLD-PLM-FZ",
      category: "cat_06", // Controlled/Blood
      storage: "F",       // Frozen
      bulkUnit: "u_09",    // Crate/Cooler
      sellingUnit: "u_10", // Unit
      unitsPerBulk: 10,
      price: 120.00,
      currentStock: 8,
      minLevel: 5,
      status: "healthy",
      lastUpdated: "2026-02-24 15:00 PM"
    },
    {
      id: "INV-009",
      name: "Disposable Syringes (5ml)",
      sku: "CONS-SYR-005",
      category: "cat_07", // Consumables
      storage: "C",       // Common Room
      bulkUnit: "u_02",    // Box
      sellingUnit: "u_05", // Piece
      unitsPerBulk: 100,
      price: 0.10,
      currentStock: 1250,
      minLevel: 500,
      status: "healthy",
      lastUpdated: "2026-02-21 09:30 AM"
    },
    {
      id: "INV-010",
      name: "Diazepam 5mg Tablets",
      sku: "PHARM-DZP-005",
      category: "cat_06", // Controlled Substances
      storage: "C",       // Common Room
      bulkUnit: "u_06",    // Bottle
      sellingUnit: "u_10", // Unit (Tablet)
      unitsPerBulk: 1000,
      price: 0.08,
      currentStock: 0,
      minLevel: 500,
      status: "out of stock",
      lastUpdated: "2026-01-15 12:00 PM"
    }
  ];

  const SystemConfig = {
    categories: [
      { id: "cat_01", name: "Antibiotics" },
      { id: "cat_02", name: "Vaccines" },
      { id: "cat_03", name: "Surgical Supplies" },
      { id: "cat_04", name: "IV Fluids" },
      { id: "cat_05", name: "Analgesics" },
      { id: "cat_06", name: "Controlled Substances" },
      { id: "cat_07", name: "Consumables" }
    ],

    storageOptions: [
      { code: "C", label: "Common Room Temp", range: "20-25°C" },
      { code: "R", label: "Refrigerated", range: "2-8°C" },
      { code: "A", label: "Ambient", range: "15-25°C" },
      { code: "F", label: "Frozen", range: "-20°C" }
    ],

    units: [
      { id: "u_01", name: "Carton" },
      { id: "u_02", name: "Box" },
      { id: "u_03", name: "Vial" },
      { id: "u_04", name: "Strip" },
      { id: "u_05", name: "Piece" },
      { id: "u_06", name: "Bottle" },
      { id: "u_07", name: "Ampoule" },
      { id: "u_08", name: "Pack" },
      { id: "u_09", name: "Crate" },
      { id: "u_10", name: "Unit" }
    ]
  };

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
        <span class="sku">SKU: ${item.sku}</span>
      </td>
      <td>${getCatName(item.category)}</td>
      <td><span class="badge ${item.storage}">${item.storage}</span></td>
      <td>${getUnitName(item.bulkUnit)} / ${getUnitName(item.sellingUnit)} (${item.unitsPerBulk} units)</td>
      <td>${item.currentStock} ${getUnitName(item.sellingUnit)}</td>
      <td><span class="status-badge 
        ${item.status.toLowerCase() === 'out of stock' ? 'out' : item.status.toLowerCase()}"
        >${item.status}</span>
      </td>
      <td>${item.lastUpdated}</td>
      <td class="actions-cell" data-item-id=${item.id}>
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
  displayTableItems(InventoryMockData)

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
    .map(t => ({ value: t.code, label: `${t.label} (${t.range})` }))

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
    return InventoryMockData.find(item => item.id === itemId)
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
        skuElem.textContent = item.sku
      })

    // View item details
    if (e.target.classList.contains('fa-eye')) {
      handleOverlay(viewItemOverlayElem)

      document.getElementById('viewCategory')
        .textContent = getCatName(item.category)
      document.getElementById('viewTemp')
        .textContent = item.storage
      document.getElementById('viewBulkUnit')
        .textContent = getUnitName(item.bulkUnit)
      document.getElementById('viewSellingUnit')
        .textContent = getUnitName(item.sellingUnit)
      const viewStatusElem = document.getElementById('view-status')
      viewStatusElem.textContent = item.status
      viewStatusElem.className = `status-badge ${item.status.toLowerCase() === 'out of stock'
        ? 'out'
        : item.status.toLowerCase()
        }`
      document.getElementById('viewCurrentStock')
        .textContent = `${item.currentStock} ${getUnitName(item.sellingUnit)}${item.currentStock > 1 ? 's' : ''}`
      document.getElementById('viewMinLevel')
        .textContent = `${item.minLevel} ${getUnitName(item.sellingUnit)}${item.minLevel !== 1 ? 's' : ''}`
      document.getElementById('viewPrice')
        .textContent = `$${item.price.toFixed(2)}`
      document.getElementById('viewLastUpdated')
        .textContent = item.lastUpdated
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

      if (editItemIdInput) editItemIdInput.value = item.id
      if (editNameInput) editNameInput.value = item.name
      if (editSkuInput) editSkuInput.value = item.sku
      if (editPriceInput) editPriceInput.value = item.price.toFixed(2)
      if (editUnitsPerBulkInput) editUnitsPerBulkInput.value = item.unitsPerBulk
      if (editMinLevelInput) editMinLevelInput.value = item.minLevel

      // Populate select options from SystemConfig, then select current values
      const editCategorySelect = document.getElementById('edit-category')
      if (editCategorySelect) {
        setSelectOptions(editCategorySelect, categoryItems)
        selectByLabel(editCategorySelect, categoryItems, item.category)
      }

      const editTempSelect = document.getElementById('edit-temp')
      if (editTempSelect) {
        setSelectOptions(editTempSelect, storageItems)
        // Inventory items store the storage code directly (C/R/A/F)
        if (item.storage) editTempSelect.value = item.storage
      }

      const editBulkSelect = document.getElementById('edit-bulk')
      if (editBulkSelect) {
        // Bulk Unit and Selling Unit share the same UOM options
        setSelectOptions(editBulkSelect, uomItems)
        selectByLabel(editBulkSelect, uomItems, item.bulkUnit)
      }

      const editSellingSelect = document.getElementById('edit-selling')
      if (editSellingSelect) {
        // Bulk Unit and Selling Unit share the same UOM options
        setSelectOptions(editSellingSelect, uomItems)
        selectByLabel(editSellingSelect, uomItems, item.sellingUnit)
      }
    }

    // Adjust the stock amount
    if (e.target.classList.contains('fa-balance-scale')) {
      handleOverlay(adjustStockOverlayElem)

      document.getElementById('currentStockCount')
        .textContent = item.currentStock
      document.getElementById('adjustUnitLabel')
        .textContent = item.sellingUnit
    }

    // Delete an item
    if (e.target.classList.contains('fa-trash')) {
      handleOverlay(deleteItemOverlayElem)

      document.getElementById('currentStockSellUom')
        .textContent = `${item.currentStock} ${item.sellingUnit}`
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

    const filtered = InventoryMockData.filter(item => {
      if (searchTerm) {
        const name = normalizeText(item.name)
        const sku = normalizeText(item.sku)
        if (!name.includes(searchTerm) && !sku.includes(searchTerm)) {
          return false
        }
      }

      // Category filter (matches category id)
      if (selectedCategory && item.category !== selectedCategory) {
        return false
      }

      // Storage temperature filter (matches storage code C/R/A/F)
      if (selectedTemp && item.storage !== selectedTemp) {
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

  applyFilters()
})