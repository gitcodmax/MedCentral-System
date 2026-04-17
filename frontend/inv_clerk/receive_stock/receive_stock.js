import { renderHeader } from "../header.js";
import {
  createAnotherItemDetailsContainer, validateStockForm,
  saveFormData, renderSavedFormData, getItemsContainer,
  getFormData, handleAddingItem, listenChangeInItemCodeName
} from "./receive_stock_functions.js";

renderHeader()

document.querySelector('.form-wrapper')
  .innerHTML = `
      <header class="form-header">
        <h1 class="main-title">Enter the following details to receive new stock</h1>
        <i>All the fields are required!!</i>
      </header>

      <form id="receiveStockForm">

        <div class="form-section js-delivery-details">
            <h2 class="section-title">Delivery Details</h2>
            <div class="form-grid">
                <div class="input-group">
                    <label for="supplierName">Supplier Name:</label>
                    <input type="text" id="supplierName" required>
                </div>

                <div class="input-group">
                    <label for="deliveryDateTime">Delivery Date and Time:</label>
                    <input type="datetime-local" id="deliveryDateTime" required>
                </div>
            </div>
        </div>

        <div id="item-details-section"></div>

        <div class="center-button-container">
            <button type="button" id="save-details-btn" class="submit-btn confirm-btn js-confirm-btn">Save Details</button>
        </div>
      </form>
    `

//Keeps track of the number of items created
let itemIndexed = 0;

getItemsContainer().innerHTML = createAnotherItemDetailsContainer(itemIndexed)
listenChangeInItemCodeName(itemIndexed)

const stockForm = document.getElementById('receiveStockForm')

// Set the clear details and add another item buttons
stockForm.addEventListener('click', (event) => {
  if (event.target.classList.contains('js-add-item-btn')) {
    validateStockForm(event, stockForm, () => {

      const stockData = getFormData()
      if (stockData.items) {
        const itemIndexesList = Object.keys(stockData.items)
        itemIndexed = Math.max(...itemIndexesList)
        itemIndexed += 1
        handleAddingItem(itemIndexed)
      } else {
        itemIndexed += 1
        handleAddingItem(itemIndexed)
      }
    })

    //Delete the item when clear details button is clicked
  } else if (event.target.classList.contains('js-clear-details-btn')) {
    const btnItemIndex = event.target.dataset.itemIndex
    const formSection = document.querySelector(`.js-form-section-${btnItemIndex}`)
    formSection.remove()
  }
})

// Clicking save details button opens the receipt page
document.getElementById('save-details-btn')
  .addEventListener('click', (event) => {

    saveFormData(stockForm)
    validateStockForm(event, stockForm, () => {
      window.location.href = 'stock_receipt.html';
    });

  })

renderSavedFormData(itemIndexed)
