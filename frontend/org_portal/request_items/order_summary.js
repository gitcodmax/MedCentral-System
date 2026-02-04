import { renderSidebar, renderRequestItemsNavbar } from "../sidebar.js";
import { handleOverlay } from "../overlay.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  renderRequestItemsNavbar()

  const hospitalDepartmentData = {
    departments: [
      { id: "dept_01", name: "General Ward" },
      { id: "dept_02", name: "ICU (Intensive Care)" },
      { id: "dept_03", name: "Emergency Room" },
      { id: "dept_04", name: "Pharmacy Storage" },
      { id: "dept_05", name: "Maternity Wing" },
      { id: "dept_06", name: "Surgery / Theatre" },
      { id: "dept_07", name: "Laboratory" },
      { id: "dept_08", name: "Outpatient Clinic" },
      { id: "dept_09", name: "Pediatrics" },
      { id: "dept_10", name: "Radiology" }
    ]
  };

  // Mock data for the order summary page
  const hospitalRequestData = {
    requestId: "REQ-2026-05521",
    status: "draft",
    dateInitiated: "2026-01-31",
    defaultDepartment: "dept_01", // Using ID for General Ward
    totalOfAllItems: 110450.00,
    currency: "KES",

    items: [
      {
        sku: "MED-001-P",
        name: "Paracetamol 500mg",
        uom: "tablet",
        storageTemp: "ambient",
        quantity: 500,
        unitPrice: 5.50,
        department: "dept_01", // ID for General Ward
        subtotal: 2750.00
      },
      {
        sku: "INS-GL-04",
        name: "Insulin Glargine",
        uom: "vial",
        storageTemp: "refrigerated",
        quantity: 12,
        unitPrice: 3400.00,
        department: "dept_02", // ID for ICU
        subtotal: 40800.00
      },
      {
        sku: "IV-FL-09",
        name: "Saline Solution 500ml",
        uom: "vial",
        storageTemp: "crt",
        quantity: 50,
        unitPrice: 1250.00,
        department: "dept_01", // ID for General Ward
        subtotal: 62500.00
      },
      {
        sku: "GS-992-M",
        name: "Surgical Gloves (Medium)",
        uom: "pair",
        storageTemp: "ambient",
        quantity: 200,
        unitPrice: 22.00,
        department: "dept_06", // ID for Surgery / Theatre
        subtotal: 4400.00
      }
    ]
  };

  document.getElementById('summaryRequestId')
    .textContent = hospitalRequestData.requestId
  document.getElementById('summaryDate')
    .textContent = hospitalRequestData.dateInitiated
  document.getElementById('summaryDefaultDept')
    .textContent = getDeptName(hospitalRequestData.defaultDepartment)
  document.querySelectorAll('.js-total-items')
    .forEach(elem => elem.textContent = hospitalRequestData.items.length)
  document.querySelectorAll('.js-grand-total')
    .forEach(elem => elem.textContent = hospitalRequestData.totalOfAllItems)   

  const summaryTbodyElem = document.getElementById('summaryTableBody')

  // Display the items in the table
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
        <input type="number" class="row-qty js-row-qty-${item.sku}" value="${item.quantity}" oninput="updateItemQuantity('${item.sku}', this.value)">
      </td>
      <td class="row-price">KES ${item.unitPrice}</td>
      <td>
        <select class="row-dept js-row-dept-${item.sku}"></select>
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

  //Display all the departments for the user to select
  hospitalRequestData.items.forEach(item => {
    hospitalDepartmentData.departments.forEach(dpt => {
      document.querySelector(`.js-row-dept-${item.sku}`)
        .innerHTML += `<option value=${dpt.id} 
        ${item.department === dpt.id ? 'selected' : ''} 
        >${dpt.name}</option>`
    })
  })

  //Returns the name of a department
  function getDeptName(deptId) {
    const dept = hospitalDepartmentData.departments.find(dept => dept.id === deptId)
    return dept.name
  }

  // Confirm the items in the order
  const confirmOrderOverlayElem = document.getElementById('confirmationModal')
  document.querySelector('.js-btn-confirm-order')
    .addEventListener('click', () => {
      handleOverlay(confirmOrderOverlayElem)
    })

  //Remove an item from the order summary
  const deleteConfirmOverlayElem = document.getElementById('deleteConfirmOverlay')
  summaryTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;
    const btnSku = btn.dataset.sku

    if (btn.classList.contains('js-btn-remove')) {
      hospitalRequestData.items.forEach(item => {
        if (btnSku === item.sku) {
          handleOverlay(deleteConfirmOverlayElem)
          document.getElementById('deleteItemName')
            .textContent = item.name
        }
      })
    }
  })

  // Display the final order details for confirmation
  const verificationGridElem = document.querySelector('.js-verification-grid')
  hospitalRequestData.items.forEach(item => {
    displayItemsforConfirmation(item)
  })

  function displayItemsforConfirmation(item) {
    verificationGridElem.innerHTML += `
      <div class="v-row"><span class="v-name">${item.name}</span></div>
      <div class="v-row">
        ${item.quantity} ${item.uom}
      </div>
      <div class="v-row"><span class="v-dept">${getDeptName(item.department)}</span></div>
      <div class="v-row text-right"><span class="v-sub-total">KES ${item.subtotal}</span></div>
    `
  }
})