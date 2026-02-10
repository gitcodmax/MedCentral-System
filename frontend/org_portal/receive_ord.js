import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "./overlay.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  document.getElementById('packagesTbody')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if(!btn) return;

      if(btn.classList.contains('view-pkg-btn')){
        const overlayElem = document.getElementById('packageDetailsOverlay')
        handleOverlay(overlayElem)
      }
    })
})