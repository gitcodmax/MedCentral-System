import { renderSidebar, renderRequestItemsNavbar } from "../sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  renderRequestItemsNavbar()

  const hospitalRequestData = {
    // Top-Level Identifiers & Metadata
    requestId: "REQ-2026-05521",
    status: "draft",
    dateInitiated: "2026-01-31",
    defaultDepartment: "General Ward",
    totalOfAllItems: 110450.00, // Total now at the top level
    currency: "KES",

    // Comprehensive Line Items
    items: [
      {
        sku: "MED-001-P",
        name: "Paracetamol 500mg",
        uom: "tablet",
        storageTemp: "ambient",
        quantity: 500,
        unitPrice: 5.50,
        department: "General Ward",
        subtotal: 2750.00
      },
      {
        sku: "INS-GL-04",
        name: "Insulin Glargine",
        uom: "vial",
        storageTemp: "refrigerated",
        quantity: 12,
        unitPrice: 3400.00,
        department: "ICU",
        subtotal: 40800.00
      },
      {
        sku: "IV-FL-09",
        name: "Saline Solution 500ml",
        uom: "vial",
        storageTemp: "crt",
        quantity: 50,
        unitPrice: 1250.00,
        department: "General Ward",
        subtotal: 62500.00
      },
      {
        sku: "GS-992-M",
        name: "Surgical Gloves (Medium)",
        uom: "pair",
        storageTemp: "ambient",
        quantity: 200,
        unitPrice: 22.00,
        department: "Surgery",
        subtotal: 4400.00
      }
    ]
  };

  const summaryTbodyElem = document.getElementById('summaryTableBody')

  const summaryTbodyFragment = document.createDocumentFragment()

  hospitalRequestData.items.forEach(item => {
    const tblRow = document.createElement('tr')
    tblRow.className = 'summary-row'

    tblRow.innerHTML = `
      <td>
        <div class="item-info">
          <span class="row-sku">${item.sku}</span>
          <span class="row-name">${item.name}</span>
          <span class="row-uom">per ${item.uom}</span>
        </div>
      </td>
      <td class="row-storage">${item.storageTemp}</td>
      <td>
        <input type="number" class="row-qty" value="${item.quantity}">
      </td>
      <td class="row-price">KES ${item.unitPrice}</td>
      <td>
        <select class="row-dept">
          <option>General Ward</option>
          <option>ICU</option>
          <option selected>Pharmacy</option>
        </select>
      </td>
      <td class="row-subtotal">KES ${item.subtotal}</td>
      <td>
        <button class="btn-remove-row js-btn-remove" data-sku=${item.sku} title="Remove Item">
          <i class="fas fa-times"></i>
        </button>
      </td>
    `

    summaryTbodyFragment.appendChild(tblRow)
  })

  summaryTbodyElem.appendChild(summaryTbodyFragment)

  //Remove an item from the order summary
  const deleteConfirmOverlayElem = document.getElementById('deleteConfirmOverlay')
  summaryTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    const btnSku = btn.dataset.sku
    if (!btn) return;

    if (btn.classList.contains('js-btn-remove')) {
      hospitalRequestData.items.forEach(item => {
        if (btnSku === item.sku) {
          deleteConfirmOverlayElem.classList.add('active')
          document.getElementById('deleteItemName')
            .textContent = item.name

          document.querySelector('.js-btn-close-overlay')
            .addEventListener('click', () => {
              deleteConfirmOverlayElem.classList.remove('active')
            })

          deleteConfirmOverlayElem.addEventListener('click', (e) => {
            if(e.target === deleteConfirmOverlayElem){
              deleteConfirmOverlayElem.classList.remove('active')
            }
          })
        }
      })
    }
  })
})