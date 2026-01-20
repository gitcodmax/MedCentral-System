import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "../overlay.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

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