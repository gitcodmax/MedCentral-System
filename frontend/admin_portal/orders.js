import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="page-title">
        <h2>Order & Request History</h2>
      </div> 
    `

  const ordersTbodyElem = document.getElementById('ordersTbody')
  ordersTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if(!btn) return;

    if(btn.classList.contains('js-view-ord-details-btn')){
      const orderDetailsOverlayElem = document.getElementById('orderDetailsOverlay')
      handleOverlay(orderDetailsOverlayElem)
    }
  })
})