import { renderSidebar, displayNoMatchFound, renderRequestItemsNavbar } from "../sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  displayNoMatchFound()
  renderRequestItemsNavbar()

  const hospitalOrderData = {
    departments: [
      "General Ward",
      "ICU",
      "Pharmacy",
      "Emergency Room",
      "Laboratory",
      "Maternity",
      "Surgery",
      "Outpatient"
    ],

    catalog: [
      {
        id: '1001',
        sku: "MED-001-P",
        name: "Paracetamol 500mg",
        uom: "tablet",
        tempZone: "ambient",
        price: 5.50
      },
      {
        id: '1002',
        sku: "IV-FL-09",
        name: "Saline Solution 500ml",
        uom: "vial",
        tempZone: "crt",
        price: 1250.00
      },
      {
        id: '1003',
        sku: "GS-992-M",
        name: "Surgical Gloves (Medium)",
        uom: "pair",
        tempZone: "ambient",
        price: 22.00
      },
      {
        id: '1004',
        sku: "ANT-772-L",
        name: "Amoxicillin 250mg",
        uom: "capsule",
        tempZone: "crt",
        price: 15.00
      },
      {
        id: '1005',
        sku: "INS-GL-04",
        name: "Insulin Glargine",
        uom: "vial",
        tempZone: "refrigerated",
        price: 3400.00
      },
      {
        id: '1006',
        sku: "SYR-2ML-G",
        name: "Syringe 2ml with Needle",
        uom: "piece",
        tempZone: "ambient",
        price: 12.50
      },
      {
        id: '1007',
        sku: "LAB-TUBE-V",
        name: "Vacutainer Blood Tube",
        uom: "tube",
        tempZone: "ambient",
        price: 45.00
      },
      {
        id: '1008',
        sku: "SUR-BLD-11",
        name: "Surgical Blade Size 11",
        uom: "piece",
        tempZone: "ambient",
        price: 35.00
      },
      {
        id: '1009',
        sku: "VACC-BCG-1",
        name: "BCG Vaccine 0.1ml",
        uom: "dose",
        tempZone: "frozen",
        price: 850.00
      },
      {
        id: '1010',
        sku: "CAN-18G-G",
        name: "IV Cannula 18G (Green)",
        uom: "piece",
        tempZone: "crt",
        price: 110.00
      }
    ]
  };

  const productGridElem = document.querySelector('.js-product-grid')

  //Display the products ihe page
  function displayProducts(catalog) {
    const productsCatalogFragment = document.createDocumentFragment()
    catalog.forEach(product => {
      const itemCardDiv = document.createElement('div')
      itemCardDiv.className = 'item-card'

      let storageTempIcon = 'fa-solid fa-house-medical-circle-check'
      if (product.tempZone === 'crt') {
        storageTempIcon = `fas fa-thermometer-half`
      } else if (product.tempZone === 'refrigerated') {
        storageTempIcon = `fas fa-snowflake`
      } else if (product.tempZone === 'frozen') {
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
        <input type="number" class="qty-input" value="1" min="1">
        <button class="btn-add" data-product-id=${product.id}>Add to Order</button>
      </div>        
    `

      productsCatalogFragment.appendChild(itemCardDiv)
    })

    productGridElem.appendChild(productsCatalogFragment)
  }

  displayProducts(hospitalOrderData.catalog)

  productGridElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    const btnProductId = btn.dataset.productId
    if (!btn) return

    if (btn.classList.contains('btn-add')) {
      hospitalOrderData.catalog.forEach(prd => {
        if (prd.id === btnProductId) {
          document.querySelector('.js-cart-list')
            .innerHTML += `
              <div class="cart-item">
                <div class="cart-item-info">
                  <div>
                    <span class="cart-item-name">Paracetamol 500mg</span>
                    <div class="cart-item-meta">100 Tablets × KES 4.50</div>
                  </div>
                  <span class="cart-item-price">KES 450.00</span>
                </div>

                <div class="line-assignment">
                  <label>Assign to Dept</label>
                  <select class="dept-select-item">
                    <option selected>General Ward</option>
                    <option>ICU</option>
                    <option>Pharmacy</option>
                  </select>
                </div>
              </div>
            `
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

    const searchResult = hospitalOrderData.catalog.filter(prd => {
      const searchMatch = prd.name.toLowerCase().includes(searchValue)
        || prd.sku.toLowerCase().includes(searchValue)

      const tempMatch = tempFilterElem.value === 'all' || prd.tempZone === tempFilterElem.value

      return searchMatch && tempMatch
    })

    document.querySelector('.no-products')
      .textContent = searchResult.length
    productGridElem.innerHTML = ``

    if(searchResult.length === 0){
      noMatchElem.classList.remove('hidden')
    }else{
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