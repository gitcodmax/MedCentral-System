import { updateUnitOfMeasureOptions } from "./handle_item_category_unit_measure.js";
//This file contains specific functions for the receive stock page

export const getItemsContainer = () => document.getElementById('item-details-section');
//HTML for creating an Item Details Container
export const createAnotherItemDetailsContainer = (itemIndexed) => {
  return `
        <div class="form-section js-form-section-${itemIndexed}">
            <h2 class="section-title">Item Details</h2>

            <div class="item-entry-card js-item-entry-card" id="item-entry-card-${itemIndexed}">
                <div class="form-grid item-identity-grid">
                    <div class="input-group">
                        <label for="itemCode">Item Code:</label>
                        <input type="text" id="itemCode-${itemIndexed}" required>
                    </div>
                    <div class="input-group">
                        <label for="itemName">Item Name:</label>
                        <input type="text" id="itemName-${itemIndexed}">
                    </div>
                    <div class="input-group">
                        <label for="batchNo">Batch/Lot No.:</label>
                        <input type="text" id="batchNo-${itemIndexed}" required>
                    </div>
                    <div class="input-group">
                        <label for="expiryDate">Expiry Date:</label>
                        <input type="date" id="expiryDate-${itemIndexed}" required>
                    </div>

                    <div class="input-group">
                        <label for="itemCategory">Item Category:</label>
                        <select class="itemCategory" id="itemCategory-${itemIndexed}" required>
                            <option value="">Select Category</option>
                            <option value="pharmaceutical_packaged">Pharmaceuticals (Packaged)</option>
                            <option value="pharmaceutical_liquid">Pharmaceuticals (Liquid)</option>
                            <option value="medical_device">Medical Device / Equipment</option>
                            <option value="bulk_chemical">Bulk Chemical / Raw Material</option>
                            <option value="consumables">General Consumables / Supplies</option>
                            <option value="rolled_goods">Rolled Goods / Tubing</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="unitOfMeasure">Unit of Measure:</label>
                        <select class="unitOfMeasure" id="unitOfMeasure-${itemIndexed}" required>
                            <option value="">Select Unit</option>
                            <option value="BOX">Box</option>
                            <option value="CARTON">Carton/Case</option>
                            <option value="VIAL">Vial</option>
                            <option value="BOTTLE">Bottle</option>
                            <option value="KIT">Kit</option>
                            <option value="EACH">Each (Unit)</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="qtyDelivered">Quantity Delivered:</label>
                        <input type="number" id="qtyDelivered-${itemIndexed}" required min="1">
                    </div>
                </div>
            </div>

            <div class="center-button-container">
              <button type="button" id="clearDetailsBtn" data-item-index="${itemIndexed}" class="clear-details-btn js-clear-details-btn">Clear Item</button>
              <button type="button" id="addItemBtn" data-item-index="${itemIndexed}" class="add-item-btn js-add-item-btn">Add Another
                  Item</button>
            </div>
        </div>        
      `
}

// Get all the fields in a container
function getAllInputSelectFields(event, stockForm) {
  const btnItemIndex = event.target.dataset.itemIndex;
  const itemEntryCard = document.getElementById(`item-entry-card-${btnItemIndex}`)
  const fields = stockForm.querySelectorAll('input, select') || itemEntryCard.querySelectorAll('input, select')

  return fields
}

// Ensures all the input fields are entered
export function validateStockForm(event, stockForm, onSuccess) {
  const fields = getAllInputSelectFields(event, stockForm);

  for (const field of fields) {
    if (
      (field.tagName === 'SELECT' && !field.value) ||
      field.value.trim() === ""
    ) {
      alert("Please fill in all available fields to proceed.");
      return false;
    }
  }

  // If validation passes, run the success callback
  if (typeof onSuccess === "function") {
    onSuccess();
  }

  return true;
}

//Save the stock data/ Items details in the session storage
export function saveFormData(stockForm) {
  const deliveryReceipt = {
    deliveryDetails: {},
    items: {}
  }

  const deliveryDetailsFields = stockForm.querySelectorAll('.js-delivery-details input')

  deliveryDetailsFields.forEach(field => {
    deliveryReceipt.deliveryDetails[field.id] = field.value
  })

  const itemContainers = stockForm.querySelectorAll(".js-item-entry-card");

  itemContainers.forEach(container => {

    const itemId = container.id[container.id.length - 1];
    deliveryReceipt.items[itemId] = {};

    const fields = container.querySelectorAll("input, select, textarea");

    fields.forEach(field => {
      deliveryReceipt.items[itemId][field.id] = field.value;
    });
  });

  sessionStorage.setItem("stockReceipt", JSON.stringify(deliveryReceipt))
}

// Get form data from the session storage
export function getFormData() {
  return JSON.parse(sessionStorage.getItem('stockReceipt')) || {}
}

//Adds an item container in the page
export function handleAddingItem(itemIndexed) {
  itemIndexed++
  const container = getItemsContainer();

  if (container) {
    container.insertAdjacentHTML('beforeend',
      createAnotherItemDetailsContainer(itemIndexed)
    )
  }
}


//Get saved data from the sessionStorage and display
export function renderSavedFormData(itemIndexed) {
  const stockData = getFormData()

  if (stockData.deliveryDetails) {
    //Assign delivery details to their fields
    const deliveryDetails = stockData.deliveryDetails

    const deliveryDetailsContainer = document.querySelector('.js-delivery-details')
    deliveryDetailsContainer.querySelectorAll('.input-group input')
      .forEach((field) => {
        for (const detailId in deliveryDetails) {
          if (detailId === field.id) {
            field.value = deliveryDetails[detailId]
          }
        }
      })

    const itemDetailsSection = getItemsContainer()
    itemDetailsSection.innerHTML = ``
    const items = stockData.items
    const itemIndexes = Object.keys(stockData.items)

    //Update the itemIndexed variable
    if (itemIndexes.length > 0) {
      itemIndexed = Math.max(...itemIndexes)
    }

    //First create the empty containers for the items
    for (let i in itemIndexes) {
      itemDetailsSection.innerHTML += createAnotherItemDetailsContainer(i)
    }

    //Then populate the fields in the containers
    for (const k in itemIndexes) {
      const itemData = items[k]
      const itemContainer = document.getElementById(`item-entry-card-${k}`);
      const itemCategorySelect = document.getElementById(`itemCategory-${k}`);
      const unitOfMeasureSelect = document.getElementById(`unitOfMeasure-${k}`);

      const categoryId = `itemCategory-${k}`
      const savedCategory = itemData[categoryId]

      //Display the unit of measure depending on the category selected
      if (itemCategorySelect && unitOfMeasureSelect) {
        itemCategorySelect.value = savedCategory

        if (unitOfMeasureSelect) {
          updateUnitOfMeasureOptions(itemCategorySelect, unitOfMeasureSelect)
        }
      }

      //Display the details of the other fields
      if (itemContainer) {
        const fields = itemContainer.querySelectorAll("input, select");

        fields.forEach(field => {
          const savedValue = itemData[field.id];
          if (savedValue !== undefined) {
            field.value = savedValue;
          }
        });
      }
    }
  }
}