import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  const hospitalOrderData = {
    // Departments available for line-item assignment
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

    // Comprehensive Catalog of 10 Items
    catalog: [
      {
        sku: "MED-001-P",
        name: "Paracetamol 500mg",
        uom: "Tablet",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 5.50
      },
      {
        sku: "IV-FL-09",
        name: "Saline Solution 500ml",
        uom: "Vial",
        tempZone: "Cold Chain",
        tempClass: "cold",
        price: 1250.00
      },
      {
        sku: "GS-992-M",
        name: "Surgical Gloves (Medium)",
        uom: "Pair",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 22.00
      },
      {
        sku: "ANT-772-L",
        name: "Amoxicillin 250mg",
        uom: "Capsule",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 15.00
      },
      {
        sku: "INS-GL-04",
        name: "Insulin Glargine",
        uom: "Vial",
        tempZone: "Cold Chain",
        tempClass: "cold",
        price: 3400.00
      },
      {
        sku: "SYR-2ML-G",
        name: "Syringe 2ml with Needle",
        uom: "Piece",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 12.50
      },
      {
        sku: "LAB-TUBE-V",
        name: "Vacutainer Blood Tube",
        uom: "Tube",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 45.00
      },
      {
        sku: "SUR-BLD-11",
        name: "Surgical Blade Size 11",
        uom: "Piece",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 35.00
      },
      {
        sku: "VACC-BCG-1",
        name: "BCG Vaccine 0.1ml",
        uom: "Dose",
        tempZone: "Cold Chain",
        tempClass: "cold",
        price: 850.00
      },
      {
        sku: "CAN-18G-G",
        name: "IV Cannula 18G (Green)",
        uom: "Piece",
        tempZone: "Ambient",
        tempClass: "ambient",
        price: 110.00
      }
    ]
  };

  //Display the products ihe page
  const productsCatalogFragment = document.createDocumentFragment()
  hospitalOrderData.catalog.forEach(product => {
    const itemCardDiv = document.createElement('div')
    itemCardDiv.className = 'item-card'

    itemCardDiv.innerHTML = `  
      <div class="card-meta">
        <span class="item-sku">SKU: ${product.sku}</span>
        <span class="temp-pill ambient">${product.tempZone}</span>
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