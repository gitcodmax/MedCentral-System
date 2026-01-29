import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

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
            sku: "MED-001-P",
            name: "Paracetamol 500mg",
            uom: "Tablet",
            tempZone: "ambient",
            price: 5.50
        },
        {
            sku: "IV-FL-09",
            name: "Saline Solution 500ml",
            uom: "Vial",
            tempZone: "crt",
            price: 1250.00
        },
        {
            sku: "GS-992-M",
            name: "Surgical Gloves (Medium)",
            uom: "Pair",
            tempZone: "ambient",
            price: 22.00
        },
        {
            sku: "ANT-772-L",
            name: "Amoxicillin 250mg",
            uom: "Capsule",
            tempZone: "crt",
            price: 15.00
        },
        {
            sku: "INS-GL-04",
            name: "Insulin Glargine",
            uom: "Vial",
            tempZone: "refrigerated",
            price: 3400.00
        },
        {
            sku: "SYR-2ML-G",
            name: "Syringe 2ml with Needle",
            uom: "Piece",
            tempZone: "ambient",
            price: 12.50
        },
        {
            sku: "LAB-TUBE-V",
            name: "Vacutainer Blood Tube",
            uom: "Tube",
            tempZone: "ambient",
            price: 45.00
        },
        {
            sku: "SUR-BLD-11",
            name: "Surgical Blade Size 11",
            uom: "Piece",
            tempZone: "ambient",
            price: 35.00
        },
        {
            sku: "VACC-BCG-1",
            name: "BCG Vaccine 0.1ml",
            uom: "Dose",
            tempZone: "frozen",
            price: 850.00
        },
        {
            sku: "CAN-18G-G",
            name: "IV Cannula 18G (Green)",
            uom: "Piece",
            tempZone: "crt",
            price: 110.00
        }
    ]
};

  //Display the products ihe page
  const productsCatalogFragment = document.createDocumentFragment()
  hospitalOrderData.catalog.forEach(product => {
    const itemCardDiv = document.createElement('div')
    itemCardDiv.className = 'item-card'

    let storageTempIcon = 'fa-solid fa-house-medical-circle-check'
    if(product.tempZone === 'crt'){
      storageTempIcon = `fas fa-thermometer-half`
    } else if(product.tempZone === 'refrigerated'){
      storageTempIcon = `fas fa-snowflake`
    } else if(product.tempZone === 'frozen'){
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
        <button class="btn-add">Add to Order</button>
      </div>        
    `

    productsCatalogFragment.appendChild(itemCardDiv)
  })

  document.querySelector('.js-product-grid')
    .appendChild(productsCatalogFragment)
})