import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `

  // Set up the overlay
  const overlayElem = document.getElementById('addHospitalOverlay')
  const deptListContainerElem = document.getElementById('deptListContainer')
  document.getElementById('btnAddHospital')
    .addEventListener('click', () => {
      handleOverlay(overlayElem)

      // What happens when the add department button is 
      let rowIdCount = 1 //Counter id to assign to each of the departments rows created
      document.getElementById('addDeptBtn')
        .addEventListener('click', () => {
          let allFieldsEntered = false
          document.querySelectorAll('.dept-name-input')
            .forEach(deptInputElem => {
              if(deptInputElem.value === ''){
                allFieldsEntered = false
              }else{
                allFieldsEntered = true
              }
            })

          if(allFieldsEntered){
            const elemRowId = rowIdCount++
            const div = document.createElement('div');
            div.className = 'dept-row'
            div.dataset.rowId = elemRowId
            div.innerHTML = `
              <input type="text" class="dept-name-input" name="depts[]" placeholder="e.g. Emergency Room" required>
              <button type="button" class="btn-remove" data-row-id=${elemRowId}>
                <i class="fas fa-trash-alt"></i>
              </button>
            `
  
            deptListContainerElem.appendChild(div);
          }else{
            alert('Enter department name in the field to add another one.')
          }
        })

      // What happens when a user deletes a department row when entering their names
        document.getElementById('modalBody')
        .addEventListener('click', (e) => {
          const btn = e.target.closest('button')
          if(!btn) return;

          if(btn.classList.contains('btn-remove')){
            const removeBtnRowId = btn.dataset.rowId
            const deptRowRowId = btn.parentElement.dataset.rowId

            if(removeBtnRowId === deptRowRowId && deptListContainerElem.children.length > 1){
              btn.parentElement.remove()
            }else{
              btn.parentElement.querySelector('input').value = ``
            }
          }
        })
    })
})