import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
  .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `
})