import { renderSidebar, renderRequestItemsNavbar } from "../sidebar.js";
import { displayNoMatchFound, orgPortalPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../../global.js";
import { hosId } from "../dash.js";
import { getHospDept } from "./order_summary.js";

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <nav class="view-navigation js-view-navigation"></nav>

      <div class="app-grid-content">
        <section class="catalog-container">
          <div class="dept-selector-container">
            <div class="dept-main-controls">
              <div class="dept-input-group">
                <i class="fas fa-hospital-user dept-icon"></i>
                <div class="dept-label-wrapper">
                  <label for="globalDeptSelect">Default Destination Department</label>
                  <select id="globalDeptSelect" class="global-dept-dropdown">
                    <option value="">Select Department...</option>
                  </select>
                </div>
              </div>

              <div class="dept-info-message">
                <i class="fas fa-info-circle"></i>
                <span>All items added will be assigned to this department by default. <strong>Individual items can be
                    re-assigned in the Order Summary.</strong></span>
              </div>
            </div>
          </div>


          <div class="filter-container">
            <div class="search-group">
              <label for="searchTerm">Search by Item Name/sku</label>
              <i class="fas fa-search search-icon"></i>
              <input type="text" id="catalogSearch" placeholder="Search by item name or SKU (e.g. MED-001)...">
            </div>

            <div class="filter-group">
              <div class="filter-item">
                <label for="tempFilter">Storage Temp</label>
                <select id="tempFilter">
                  <option value="all">All Temperatures</option>
                  <option value="ambient">Ambient</option>
                  <option value="crt">CRT</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>

              <div class="show-no-products">
                <p>Showing <span class="no-products">All</span> products</p>
              </div>

              <button class="btn-reset js-btn-reset" title="Reset Filters">
                <i class="fas fa-undo"></i>
              </button>
            </div>
          </div>

          <div class="product-grid js-product-grid"></div>

          <div class="no-match-container hidden js-no-match-found"></div>
        </section>
      </div>
    </main>
    `

  renderSidebar('request_items')
  displayNoMatchFound()
  renderRequestItemsNavbar()
  renderSuccessErrorOverlay()

  const productCatalogData = await getProductCatalogData()
  const hosDeparts = await getHospDept(hosId)

  // Populate the data to select a global department for the items selected
  const globalDeptSelectFrag = document.createDocumentFragment()
  hosDeparts.forEach(dept => {
    const option = document.createElement('option')
    option.value = dept.id
    option.textContent = dept.name

    globalDeptSelectFrag.appendChild(option)
  })
  document.getElementById('globalDeptSelect')
    .appendChild(globalDeptSelectFrag)

  const productGridElem = document.querySelector('.js-product-grid')

  //Display the products ihe page
  function displayProducts(catalog) {
    const productsCatalogFragment = document.createDocumentFragment()
    catalog.forEach(product => {
      const itemCardDiv = document.createElement('div')
      itemCardDiv.className = 'item-card'

      let storageTempIcon = 'fa-solid fa-house-medical-circle-check'
      if (product.tempzone === 'crt') {
        storageTempIcon = `fas fa-thermometer-half`
      } else if (product.tempzone === 'refrigerated') {
        storageTempIcon = `fas fa-snowflake`
      } else if (product.tempzone === 'frozen') {
        storageTempIcon = `fas fa-icicles`
      }

      itemCardDiv.innerHTML = `  
      <div class="card-meta">
        <span class="item-sku">SKU: ${product.sku}</span>
        <span class="temp-pill"><i class="${storageTempIcon}"></i></span>
      </div>

      <h4 class="item-name">${product.name}</h4>

      <div class="uom-tag">
        Unit: <strong>${product.uom}</strong>
      </div>

      <div class="item-price">KES ${product.price}</div>

      <div class="item-actions">
        <input type="number" class="qty-input js-qty-input-${product.id}" value="1" min="1">
        <button class="btn-add" data-product-id=${product.id}>Add to Order</button>
      </div>        
    `

      productsCatalogFragment.appendChild(itemCardDiv)
    })

    productGridElem.appendChild(productsCatalogFragment)
  }

  displayProducts(productCatalogData)

  const globalDeptSelectElem = document.getElementById('globalDeptSelect')
  const globalDeptValue = localStorage.getItem('globalDept')
  globalDeptSelectElem.value = globalDeptValue
  globalDeptSelectElem.addEventListener('change', (e) => {
    const deptId = e.target.value
    if (!localStorage.getItem('globalDept') !== null) {
      localStorage.removeItem('globalDept')
    }
    localStorage.setItem('globalDept', deptId)
  })

  productGridElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return

    const btnProductId = btn.dataset.productId

    if (btn.classList.contains('btn-add')) {
      productCatalogData.forEach(async (prd) => {
        if (prd.id === Number(btnProductId)) {
          const itemQty = document.querySelector(`.js-qty-input-${prd.id}`).value
          if (globalDeptValue === '') {
            alert('Enter default department')
          } else {
            const response = await fetch(`${orgPortalPagesLink}/saveItemToCart`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  hosId,
                  itemId: prd.id,
                  deptId: globalDeptValue,
                  qty: itemQty
                })
              }
            )

            const res = await response.json()
            triggerStatus(res.msg)
          }
        }
      })
    }
  })

  //Filtering logic
  const searchBarElem = document.getElementById('catalogSearch')
  const tempFilterElem = document.getElementById('tempFilter')
  const noMatchElem = document.querySelector('.js-no-match-found')

  function handleSearchTempFilter() {
    const searchValue = searchBarElem.value.toLowerCase().trim()

    const searchResult = productCatalogData.filter(prd => {
      const searchMatch = prd.name.toLowerCase().includes(searchValue)
        || prd.sku.toLowerCase().includes(searchValue)

      const tempMatch = tempFilterElem.value === 'all' || prd.tempzone === tempFilterElem.value

      return searchMatch && tempMatch
    })

    document.querySelector('.no-products')
      .textContent = searchResult.length
    productGridElem.innerHTML = ``

    if (searchResult.length === 0) {
      noMatchElem.classList.remove('hidden')
    } else {
      displayProducts(searchResult)
      noMatchElem.classList.add('hidden')
    }
  }

  document.querySelector('.js-btn-reset')
    .addEventListener('click', () => {
      searchBarElem.value = ''
      tempFilterElem.value = 'all'
      handleSearchTempFilter()
    })

  searchBarElem.addEventListener('keyup', () => handleSearchTempFilter())
  tempFilterElem.addEventListener('change', () => handleSearchTempFilter())
})

async function getProductCatalogData() {
  const response = await fetch(`${orgPortalPagesLink}/getProductCatalogData`)
  const res = await response.json()
  return res.product_catalog
}