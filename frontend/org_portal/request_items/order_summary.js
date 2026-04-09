import { orgPortalPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../../global.js";
import { hosId } from "../dash.js";
import { renderSidebar, renderRequestItemsNavbar } from "../sidebar.js";
import { handleOverlay } from "/global.js";

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelector('.app-container')
    .innerHTML = `
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <nav class="view-navigation js-view-navigation"></nav>

      <section id="summaryView" class="view-section">
        <div class="summary-layout">

          <div class="view-header">
            <h2>Review Requisition</h2>
            <p>Verify quantities and departmental allocations below.</p>
          </div>

          <div class="items-review-container">

            <table class="summary-table">
              <thead>
                <tr>
                  <th>Item Details</th>
                  <th>Storage</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Department Assignment</th>
                  <th>Subtotal</th>
                  <th>Remove</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="summaryTableBody"></tbody>
            </table>
            <div class="update-btn-container">
              <button class="update-cart-btn" id="updateCartBtn">Update Cart Details</button>
            </div>

            <div id="deleteConfirmOverlay" class="modal-overlay">
              <div class="delete-card">
                <div class="delete-icon-circle">
                  <i class="fas fa-trash-alt"></i>
                </div>
                <div class="delete-content">
                  <h3>Remove Item?</h3>
                  <p>Remove <span id="deleteItemName" class="highlight">Paracetamol 500mg</span> from the order?</p>
                </div>
                <div class="delete-actions">
                  <button class="btn-cancel-delete js-btn-close-overlay">No, Keep it</button>
                  <button class="btn-confirm-delete" id="finalDeleteBtn">Yes, Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div class="submission-container">
            <div class="checkout-card">
              <h3>Order Totals</h3>
              <div class="totals-breakdown">
                <div class="total-row">
                  <span>Total Number of Items</span>
                  <span class="total-items js-total-items"></span>
                </div>
                <hr>
                <div class="total-row final-price">
                  <span>Estimated Total</span>
                  <span class="grand-total js-grand-total"></span>
                </div>
              </div>

              <button class="btn-confirm-order js-btn-confirm-order">
                Confirm Requisition Details
              </button>
              <button class="btn-back-catalog">
                <i class="fas fa-arrow-left"></i> Back to Catalog
              </button>
            </div>
          </div>

          <div id="confirmationModal" class="modal-overlay">
            <div class="modal-container">
              <div class="modal-header">
                <div class="header-content">
                  <i class="fas fa-check-circle modal-icon"></i>
                  <div>
                    <h3>Confirm Final Requisition</h3>
                    <p>Please perform a final check of the line items below.</p>
                  </div>
                </div>
                <button class="close-modal-btn js-btn-close-overlay">&times;</button>
              </div>

              <div class="modal-body">
                <div class="verification-grid js-verification-grid">
                  <div class="v-header">Item</div>
                  <div class="v-header">Qty</div>
                  <div class="v-header">Allocation</div>
                  <div class="v-header text-right">Subtotal</div>
                </div>

                <div class="confirmation-summary">
                  <div class="summary-line">
                    <span>Total Unique Items:</span>
                    <strong class="total-items js-total-items"></strong>
                  </div>
                  <div class="summary-line">
                    <span>Grand Total:</span>
                    <strong class="grand-total-text js-grand-total"></strong>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn-cancel js-btn-close-overlay">Make Changes</button>
                <button class="btn-final-submit" id="submitRequestBtn">
                  Yes, Submit to Warehouse
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
    `

  renderSidebar('request_items')
  renderRequestItemsNavbar()
  renderSuccessErrorOverlay()

  const hospitalDepartmentData = await getAllDept();
  const hospitalRequestData = await getHospCartItems(hosId)

  const cartItems = hospitalRequestData.items
  const cartItemsCopy = structuredClone(cartItems)

  document.querySelectorAll('.js-total-items')
    .forEach(elem => { if (hospitalRequestData.items) elem.textContent = hospitalRequestData.items.length })
  document.querySelectorAll('.js-grand-total')
    .forEach(elem => elem.textContent = hospitalRequestData.totalOfAllItems)

  const summaryTbodyElem = document.getElementById('summaryTableBody')

  // Display the items in the table
  const summaryTbodyFragment = document.createDocumentFragment()
  if (hospitalRequestData.items !== null) {
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
      <td class="row-storage">${item.storage_temp}</td>
      <td>
        <input type="number" class="row-qty js-row-qty-${item.sku}" data-c-item-id=${item.cart_item_id}
        value="${item.quantity}">
      </td>
      <td class="row-price">KES ${item.unit_price}</td>
      <td>
        <select class="row-dept js-row-dept-${item.sku}" data-c-item-id=${item.cart_item_id}></select>
      </td>
      <td class="row-subtotal">KES ${item.subtotal}</td>
      <td>
        <button class="btn-remove-row js-btn-remove" data-c-item-id=${item.cart_item_id} title="Remove Item">
          <i class="fas fa-times"></i>
        </button>
      </td>
    `

      summaryTbodyFragment.appendChild(tblRow)
    })
  }

  if (summaryTbodyElem !== null) { summaryTbodyElem.appendChild(summaryTbodyFragment) }

  document.querySelectorAll('.row-qty')
    .forEach(qtyInputElem => {
      qtyInputElem.addEventListener('input', () => {
        const itemElemCartItemId = qtyInputElem.dataset.cItemId
        const itemElemValue = qtyInputElem.value

        const itemObj = cartItemsCopy.find(item => item.cart_item_id === Number(itemElemCartItemId))
        itemObj.quantity = Number(itemElemValue)
      })
    })

  //Display all the departments for the user to select
  if (hospitalRequestData.items) {
    hospitalRequestData.items.forEach(item => {
      hospitalDepartmentData.departments.forEach(dpt => {
        document.querySelector(`.js-row-dept-${item.sku}`)
          .innerHTML += `<option value=${dpt.id} 
        ${item.department === dpt.id ? 'selected' : ''} 
        >${dpt.name}</option>`
      })
    })
  }

  document.querySelectorAll('.row-dept')
    .forEach(deptInputElem => {
      deptInputElem.addEventListener('change', () => {
        const deptInputElemValue = deptInputElem.value
        const deptElemCartItemId = deptInputElem.dataset.cItemId

        const itemObj = cartItemsCopy.find(item => item.cart_item_id === Number(deptElemCartItemId))
        itemObj.department = Number(deptInputElemValue)
      })
    })

  // Function to modify the keys and values in the cart items array objects
  // The objects in the array are updated to have only three keys: sku, department and quantity
  const updateCartItemsObj = (cartItemsArr) => {
    const cartItemsArrUpd = []
    cartItemsArr.forEach(cartItem => {
      const { cart_item_id, item_id, department, quantity } = cartItem
      const cartItemsUpd = { cart_item_id, item_id, department, quantity }
      cartItemsArrUpd.push(cartItemsUpd)
    })

    return cartItemsArrUpd
  }

  const getChangedItems = (cartItems, cartItemsCopy) => {
    return cartItemsCopy.filter(copyItem => {
      const originCartItem = cartItems.find(item => item.cart_item_id === copyItem.cart_item_id)

      const hasQtyChanged = copyItem.quantity !== originCartItem.quantity
      const hasDeptChanged = copyItem.department !== originCartItem.department

      return hasQtyChanged || hasDeptChanged
    })
  }

  document.getElementById('updateCartBtn')
    .addEventListener('click', async () => {
      const updCartItems = updateCartItemsObj(cartItems)
      const updCartItemsCopy = updateCartItemsObj(cartItemsCopy)
      const changeItemsArr = getChangedItems(updCartItems, updCartItemsCopy)

      if (changeItemsArr.length === 0) {
        alert('No updates made on the cart items!')
        location.reload()
      }

      const response = await fetch(`${orgPortalPagesLink}/updateCartItems`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ changeItemsArr })
        }
      )

      const res = await response.json()
      triggerStatus(res.msg)
    }, { once: true })

  //Returns the name of a department
  function getDeptName(deptId) {
    const dept = hospitalDepartmentData.departments.find(dept => dept.id === Number(deptId))
    return dept.name
  }

  // Confirm the items in the order
  const confirmOrderOverlayElem = document.getElementById('confirmationModal')
  document.querySelector('.js-btn-confirm-order')
    .addEventListener('click', () => {
      handleOverlay(confirmOrderOverlayElem)

      document.getElementById('submitRequestBtn')
        .addEventListener('click', async () => {
          const response = await fetch(`${orgPortalPagesLink}/updateCartItemsToRequest`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                hosId,
                totalItemsValue: hospitalRequestData.totalOfAllItems
              })
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)
        }, { once: true })
    })

  //Remove an item from the order summary
  const deleteConfirmOverlayElem = document.getElementById('deleteConfirmOverlay')
  summaryTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;
    const btnCartItemId = btn.dataset.cItemId

    if (btn.classList.contains('js-btn-remove')) {
      hospitalRequestData.items.forEach(item => {
        if (Number(btnCartItemId) === item.cart_item_id) {
          handleOverlay(deleteConfirmOverlayElem)
          document.getElementById('deleteItemName')
            .textContent = item.name

          document.getElementById('finalDeleteBtn')
            .addEventListener('click', async () => {
              const response = await fetch(`${orgPortalPagesLink}/deleteCartItem`,
                {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    cartItemId: Number(btnCartItemId),
                    hosId: 3
                  })
                }
              )

              const res = await response.json()
              triggerStatus(res.msg)
            }, { once: true })
        }
      })
    }
  })

  // Display the final order details for confirmation
  const verificationGridElem = document.querySelector('.js-verification-grid')
  if(hospitalRequestData.items)
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

const getAllDept = async () => {
  const response = await fetch(`${orgPortalPagesLink}/getAllDept`)
  const res = await response.json()
  return res
}

const getHospCartItems = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getHospCartItems`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hosId })
    }
  )

  const res = await response.json()
  return res.hospital_cart
}

export const noHospCartItems = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getNoHospCartItems`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hosId })
    }
  )

  const res = await response.json()
  return res.count
}