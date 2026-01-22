import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "../overlay.js";
import { populateDropdowns } from "../standards.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  populateDropdowns()

  const shelfDetailsOverlay = document.getElementById('shelfConfirmOverlay')
  const form = document.getElementById('shelfCreationForm')
  form.addEventListener('submit', (e) => {
      e.preventDefault()

      const shelfId = document.getElementById('shelfId').value
      const storageZone = document.getElementById('tempSelect').value
      const targetUOM = document.getElementById('uomSelect').value
      const binCapacity = document.getElementById('binCapacity').value
      const wtLimitElem = document.getElementById('weightLimit')
      const wtLimit = Number(wtLimitElem.value) || 0;

      document.getElementById('show-shelfId').textContent = shelfId
      document.getElementById('show-shelfZone').textContent = storageZone
      document.getElementById('show-shelfUom').textContent = targetUOM
      document.getElementById('show-shelfCap').textContent = binCapacity
      document.getElementById('show-shelfWeight').textContent = wtLimit

      shelfDetailsOverlay.classList.add('active')
      xRemoveOverlay(shelfDetailsOverlay)
      clickToRemoveOverlay(shelfDetailsOverlay)
    })

  // Set up the overlay
  const overlay = document.getElementById('assignmentModal')
  document.getElementById('shelfMasterTable')
    .addEventListener('click', (e) => {
      if(e.target.classList.contains('delete-shelf')){
        overlay.classList.add('active')

        xRemoveOverlay(overlay)
        clickToRemoveOverlay(overlay)
      }
    })
})