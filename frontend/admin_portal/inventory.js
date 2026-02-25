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

  const configOverlayElem = document.getElementById('configOverlay')
  document.getElementById('openConfigBtn')
    .addEventListener('click', () => {
      handleOverlay(configOverlayElem)

      // Hide the storage temp list at first
      if (document.querySelector('.js-categories-tab-btn')
        .classList.contains('active')
      ) {
        document.getElementById('storageTempList')
          .style.display = 'none'
      }

      configOverlayElem.addEventListener('click', (e) => {
        const categoriesListElem = document.getElementById('categoriesList')
        const storageTempListElem = document.getElementById('storageTempList')
        const newValueInputElem = document.getElementById('newValueInput')

        // Toggle tab btn
        if (e.target.classList.contains('js-storage-tab-btn')) {
          e.target.classList.add('active')
          document.querySelector('.js-categories-tab-btn')
            .classList.remove('active')

          categoriesListElem.style.display = 'none'
          storageTempListElem.style.display = 'flex'
        }

        // Toggle tab btn
        if (e.target.classList.contains('js-categories-tab-btn')) {
          e.target.classList.add('active')
          document.querySelector('.js-storage-tab-btn')
            .classList.remove('active')

          categoriesListElem.style.display = 'flex'
          storageTempListElem.style.display = 'none'
        }

        // Adding a new value for categories or storage temperature
        if (e.target.classList.contains('js-add-new-value')) {
          if(newValueInputElem.value === ``){
            alert('Enter a new value')
          }else{
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
})