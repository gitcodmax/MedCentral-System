//This file contains specific functions for the receive stock page

export const getItemsContainer = () => document.getElementById('item-details-section');

// Mock data containing all the items details in the system
const masterItems = [
  {
    sku: "AMOX-250-BT",
    itemName: "Amoxicillin 250mg",
    category: "Antibiotics",
    bulkUom: "Box (100 Units)",
    storageTemp: "Room Temp",
    shelfId: "B-02-11",
    storageCode: "A"
  },
  {
    sku: "INS-V10-VL",
    itemName: "Insulin Vials (Fast Acting)",
    category: "Diabetes Care",
    bulkUom: "Carton (50 Vials)",
    storageTemp: "Refrigerated",
    shelfId: "REF-01-A",
    storageCode: "R"
  },
  {
    sku: "GLOV-LAT-M",
    itemName: "Latex Gloves (Size M)",
    category: "Consumables",
    bulkUom: "Case (10 Boxes)",
    storageTemp: "Room Temp",
    shelfId: "C-05-22",
    storageCode: "A"
  },
  {
    sku: "VAC-COV-05",
    itemName: "Standard Vaccine Vials",
    category: "Immunization",
    bulkUom: "Tray (25 Vials)",
    storageTemp: "Frozen",
    shelfId: "FRZ-03-B",
    storageCode: "F"
  },
  {
    sku: "PAR-500-BX",
    itemName: "Paracetamol 500mg Tablets",
    category: "Analgesics",
    bulkUom: "Bulk Pack (5000 Tabs)",
    storageTemp: "Room Temp",
    shelfId: "A-12-04",
    storageCode: "A"
  }
];

//HTML for creating an Item Details Container
export const createAnotherItemDetailsContainer = (itemIndexed) => {

  const skuCodeOptions = masterItems.map(item => `<option value="${item.sku}">${item.sku}</option>`).join()
  const itemNameOptions = masterItems.map(item => `<option value="${item.sku}">${item.itemName}</option>`).join()

  return `
        <div class="form-section js-form-section-${itemIndexed}">
            <h2 class="section-title">Item Details</h2>

            <div class="item-entry-card js-item-entry-card" id="item-entry-card-${itemIndexed}">
                <div class="form-grid item-identity-grid">
                    <div class="input-group">
                        <label for="itemCode">Item SKU Code:</label>
                        <select class="itemCode" id="itemCode-${itemIndexed}" required>
                            <option value="">Select Item SKU Code</option>
                            ${skuCodeOptions}
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="itemName">Item Name:</label>
                        <select class="itemName" id="itemName-${itemIndexed}" required>
                            <option value="">Select Item Name</option>
                            ${itemNameOptions}
                        </select>
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
                      <label for="qtyDelivered">Quantity Delivered:</label>
                      <input type="number" id="qtyDelivered-${itemIndexed}" required min="1">
                    </div>

                    <div class="input-group">
                        <label for="itemCategory">Item Category:</label>
                        <input type="text" id="itemCategory-${itemIndexed}" readonly>
                    </div>

                    <div class="input-group">
                        <label for="unitOfMeasure">Bulk Unit of Measure:</label>
                        <input type="text" id="unitOfMeasure-${itemIndexed}" readonly>
                    </div>

                    <div class="input-group">
                        <label for="storageTemp">Storage Temperature:</label>
                        <input type="text" id="storageTemp-${itemIndexed}" readonly>
                    </div>

                    <div class="input-group">
                        <label for="shelfId">Shelf ID:</label>
                        <input type="text" id="shelfId-${itemIndexed}" readonly>
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
      // Save itemName using the visible text instead of the SKU value
      if (field.tagName === 'SELECT' && field.id.startsWith('itemName-')) {
        const selectedOption = field.options[field.selectedIndex];
        deliveryReceipt.items[itemId][field.id] = selectedOption ? selectedOption.text : field.value;
      } else {
        deliveryReceipt.items[itemId][field.id] = field.value;
      }
    });
  });

  sessionStorage.setItem("stockReceipt", JSON.stringify(deliveryReceipt))
}

// Get form data from the session storage
export function getFormData() {
  return JSON.parse(sessionStorage.getItem('stockReceipt')) || {}
}

// Enables automatic entry of item details when the user chooses the item name or sku
function handleItemSelection(selectedValue, itemIndexed) {
  const item = masterItems.find(i => i.sku === selectedValue || i.itemName === selectedValue);

  if (item) {
    document.getElementById(`itemName-${itemIndexed}`).value = item.sku;
    document.getElementById(`itemCode-${itemIndexed}`).value = item.sku;
    document.getElementById(`itemCategory-${itemIndexed}`).value = item.category;
    document.getElementById(`unitOfMeasure-${itemIndexed}`).value = item.bulkUom;
    document.getElementById(`storageTemp-${itemIndexed}`).value = item.storageTemp;
    document.getElementById(`shelfId-${itemIndexed}`).value = item.shelfId;

    const itemsCardElem = document.getElementById(`item-entry-card-${itemIndexed}`)
    itemsCardElem.querySelectorAll('input')
      .forEach(elem => {
        const addInputStyling = elem.value ? elem.classList.add('input-select-filled') : ''
        elem.addEventListener('change', () => {
          addInputStyling
        })
        addInputStyling
      })

  }
}

// Listens for a change in the item sku and name inputs
export function listenChangeInItemCodeName(itemIndexed) {
  const itemCodeElem = document.getElementById(`itemCode-${itemIndexed}`)
  const itemNameElem = document.getElementById(`itemName-${itemIndexed}`)
  itemCodeElem.addEventListener('change', () => handleItemSelection(itemCodeElem.value, itemIndexed))
  itemNameElem.addEventListener('change', () => handleItemSelection(itemNameElem.value, itemIndexed))
}

//Adds an item container in the page
export function handleAddingItem(itemIndexed) {
  const container = getItemsContainer();

  if (container) {
    container.insertAdjacentHTML('beforeend',
      createAnotherItemDetailsContainer(itemIndexed)
    )
    listenChangeInItemCodeName(itemIndexed)
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
    const itemIndexes = Object.keys(stockData.items).map(Number)

    //Update the itemIndexed variable
    if (itemIndexes.length > 0) {
      itemIndexed = Math.max(...itemIndexes)
    }

    //First create the empty containers for the items and attach listeners
    for (const index of itemIndexes) {
      itemDetailsSection.innerHTML += createAnotherItemDetailsContainer(index)
      listenChangeInItemCodeName(index)
    }

    //Then populate the fields in the containers
    for (const index of itemIndexes) {
      const itemData = items[index]
      const itemContainer = document.getElementById(`item-entry-card-${index}`);
      const itemCategorySelect = document.getElementById(`itemCategory-${index}`);
      const unitOfMeasureSelect = document.getElementById(`unitOfMeasure-${index}`);

      const categoryId = `itemCategory-${index}`
      const savedCategory = itemData[categoryId]

      //Display the unit of measure depending on the category selected
      if (itemCategorySelect && unitOfMeasureSelect) {
        itemCategorySelect.value = savedCategory

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