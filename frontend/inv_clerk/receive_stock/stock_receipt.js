import { userId } from "../inv_clerk_dash.js";
import { getFormData } from "./receive_stock_functions.js";

const clerkId = userId

document.querySelector('.receipt-container')
  .innerHTML = `    
    <header class="receipt-header">
      <div class="header-left">
        <div class="logo">
          <img src="../../images/MedCentral_logo_small.png" class="dash-logo">
        </div>
      </div>
      <div class="header-right">
        <h1>GOODS RECEIVED NOTE (GRN)</h1>
      </div>
    </header>

    <div class="meta-data-grid">
      <div class="meta-item">
        <label>Date Generated:</label>
        <span id="dateGenerated">${dayjs().format('YYYY-MM-DD hh:mm A')}</span>
      </div>
      <div class="meta-item">
        <label>Clerk ID:</label>
        <span id="clerkId">${clerkId}</span>
      </div>
      <div class="meta-item">
        <label>Status:</label>
        <span id="status" class="status-verified">VERIFIED & POSTED</span>
      </div>
    </div>

    <section class="delivery-summary section-box">
      <h3 class="section-title"><i class="fas fa-truck-loading"></i> Delivery Details</h3>
      <div class="summary-grid">
        <div class="summary-item">
          <label>Supplier Name:</label>
          <span id="supplierName"></span>
        </div>

        <div class="summary-item">
          <label>Delivery Date & Time:</label>
          <span id="deliveryDateTime"></span>
        </div>
      </div>
    </section>

    <section class="items-summary section-box">
      <h3 class="section-title"><i class="fas fa-box-open"></i> Item Verification Summary</h3>

      <table class="item-table">
        <thead>
          <tr>
            <th>Item Code/SKU</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Storage Temp.</th>
            <th>Batch No.</th>
            <th>Expiry Date</th>
            <th>Unit</th>
            <th>Qty Delivered</th>
          </tr>
        </thead>
        <tbody id="itemDetailsBody"></tbody>
      </table>
    </section>

    <div class="btn-container">
      <button class="go-back-btn js-go-back-btn">Go Back</button>
      <button class="print-btn" id="receiveStockBtn">Confirm Details</button>
    </div>
  
  `

const stockReceipt = getFormData()
console.log(stockReceipt)

const deliveryDetails = stockReceipt.deliveryDetails
const items = stockReceipt.items

//Display the delivery details
const deliverySummaryContainer = document.querySelector('.delivery-summary')
deliverySummaryContainer.querySelectorAll('.summary-item span')
  .forEach((detailElem) => {
    for (const detail in deliveryDetails) {
      if (detail === detailElem.id) {
        if (detailElem.id.includes('deliveryDate')) {
          const savedDeliveryDate = deliveryDetails[detail]
          const deliveryDate = dayjs(savedDeliveryDate).format('YYYY-MM-DD hh:mm A')
          detailElem.innerText = deliveryDate
        } else {
          detailElem.innerText = deliveryDetails[detail]
        }
      }
    }
  })

//Go back to the previous page when clicked
document.querySelector('.js-go-back-btn')
  .addEventListener('click', () => {
    window.history.back()
  })

//Populate the table with the necessary item details
const itemDetailsContainer = document.getElementById('itemDetailsBody')

//Render HTML for the table data
function renderItemDetails(itemDetailsContainer, itemIndex) {
  itemDetailsContainer.innerHTML += `
      <tr>
        <td id="itemCode-${itemIndex}"></td>
        <td id="itemName-${itemIndex}"></td>
        <td id="itemCategory-${itemIndex}"></td>
        <td id="storageTemp-${itemIndex}"></td>
        <td id="batchNo-${itemIndex}"></td>
        <td id="expiryDate-${itemIndex}"></td>
        <td id="unitOfMeasure-${itemIndex}"></td>
        <td id="qtyDelivered-${itemIndex}"></td>
      </tr>
    `
}

//Display the right details in the items table
for (const itemIndex in items) {
  renderItemDetails(itemDetailsContainer, itemIndex)
  const itemObj = items[itemIndex]

  for (const itemId in itemObj) {
    const itemValue = itemObj[itemId]

    itemDetailsContainer.querySelectorAll('td')
      .forEach((tableData) => {
        if (tableData.id && tableData.id === itemId) {
          tableData.innerText = itemValue
        }
      })
  }
}

document.getElementById('receiveStockBtn')
  .addEventListener('click', () => {
    console.log(stockReceipt)
  })
