import { renderSidebar } from "./sidebar.js";
import { handleOverlay } from "../global.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="dashboard-header">
      <div class="page-title">
        <h1>Inventory Management</h1>
      </div>
      <div class="left-header-actions">
        <button class="btn btn-open-config" id="openConfigBtn" title="System Configuration">
          <i class="fas fa-cog"></i>
        </button>
        <button class="btn btn-primary" id="openAddItemBtn">
          <i class="fas fa-plus"></i> Add New Item
        </button>
      </div>
    </div> 
  `

  // Open the overlay to define the item categories and storage temperature
  const configOverlayElem = document.getElementById('configOverlay')
  document.getElementById('openConfigBtn')
    .addEventListener('click', () => {
      handleOverlay(configOverlayElem)

      const categoriesListElem = document.getElementById('categoriesList')
      const storageTempListElem = document.getElementById('storageTempList')
      const bulkUnitsListElem = document.getElementById('bulkUnitsList')
      const sellUnitsListElem = document.getElementById('sellUnitsList')

      // Hide the storage temp list at first
      if (document.querySelector('.js-categories-tab-btn')
        .classList.contains('active')
      ) {
        bulkUnitsListElem.style.display = 'none'
        sellUnitsListElem.style.display = 'none'
        storageTempListElem.style.display = 'none'
      }

      configOverlayElem.addEventListener('click', (e) => {
        const categoriesTabBtnElem = document.querySelector('.js-categories-tab-btn')
        const storageTabBtnElem = document.querySelector('.js-storage-tab-btn')
        const bulkUnitsTabBtnElem = document.querySelector('.js-bulk-unit-tab-btn')
        const sellUnitsTabBtnElem = document.querySelector('.js-sell-unit-tab-btn')
        const newValueInputElem = document.getElementById('newValueInput')

        // Toggle storage temp tab btn
        if (e.target.classList.contains('js-storage-tab-btn')) {
          e.target.classList.add('active')
          categoriesTabBtnElem.classList.remove('active')
          bulkUnitsTabBtnElem.classList.remove('active')
          sellUnitsTabBtnElem.classList.remove('active')

          categoriesListElem.style.display = 'none'
          bulkUnitsListElem.style.display = 'none'
          sellUnitsListElem.style.display = 'none'
          storageTempListElem.style.display = 'flex'
        }

        // Toggle item categories tab btn
        if (e.target.classList.contains('js-categories-tab-btn')) {
          e.target.classList.add('active')
          storageTabBtnElem.classList.remove('active')
          bulkUnitsTabBtnElem.classList.remove('active')
          sellUnitsTabBtnElem.classList.remove('active')

          categoriesListElem.style.display = 'flex'
          bulkUnitsListElem.style.display = 'none'
          sellUnitsListElem.style.display = 'none'
          storageTempListElem.style.display = 'none'
        }

        // Toggle bulk units tab btn
        if(e.target.classList.contains('js-bulk-unit-tab-btn')){
          e.target.classList.add('active')
          storageTabBtnElem.classList.remove('active')
          categoriesTabBtnElem.classList.remove('active')
          sellUnitsTabBtnElem.classList.remove('active')

          bulkUnitsListElem.style.display = 'flex'
          categoriesListElem.style.display = 'none'
          sellUnitsListElem.style.display = 'none'
          storageTempListElem.style.display = 'none'
        }

        // Toggle sell units tab btn
        if(e.target.classList.contains('js-sell-unit-tab-btn')){
          e.target.classList.add('active')
          storageTabBtnElem.classList.remove('active')
          categoriesTabBtnElem.classList.remove('active')
          bulkUnitsTabBtnElem.classList.remove('active')

          bulkUnitsListElem.style.display = 'none'
          categoriesListElem.style.display = 'none'
          sellUnitsListElem.style.display = 'flex'
          storageTempListElem.style.display = 'none'
        }

        // Adding a new value for categories or storage temperature
        if (e.target.classList.contains('js-add-new-value')) {
          if (newValueInputElem.value === ``) {
            alert('Enter a new value')
          } else {
            if (document.querySelector('.js-categories-tab-btn')
              .classList.contains('active')
            ) {
              console.log('Categories Active')
              // Save the new category and display them in the categories list
            }

            if (document.querySelector('.js-storage-tab-btn')
              .classList.contains('active')
            ) {
              console.log('Storage Active')
              // Save the new category and display them in the storage list
            }
          }
        }
      })

    })

  // Open overlay to add a new item
  const addItemOverlayElem = document.getElementById('itemOverlay')
  document.getElementById('openAddItemBtn')
    .addEventListener('click', () => {
      handleOverlay(addItemOverlayElem)
    })

  const viewItemOverlayElem = document.getElementById('viewItemOverlay')
  const editItemOverlayElem = document.getElementById('editItemOverlay')
  const adjustStockOverlayElem = document.getElementById('adjustStockOverlay')
  const deleteItemOverlayElem = document.getElementById('deleteItemOverlay')
  document.getElementById('itemsTbody')
    .addEventListener('click', (e) => {

      // View item details
      if (e.target.classList.contains('fa-eye')) {
        handleOverlay(viewItemOverlayElem)
      }

      // Edit item details
      if (e.target.classList.contains('fa-edit')) {
        handleOverlay(editItemOverlayElem)
      }

      // Adjust the stock amount
      if (e.target.classList.contains('fa-balance-scale')) {
        handleOverlay(adjustStockOverlayElem)
      }

      // Delete an item
      if (e.target.classList.contains('fa-trash')) {
        handleOverlay(deleteItemOverlayElem)
      }
    })
})