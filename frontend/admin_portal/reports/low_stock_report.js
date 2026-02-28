import { renderSidebar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
  .innerHTML = `
      <div class="reports-button-group">

        <a href="/reports/inventory" class="nav-btn">
          <span class="icon bg-blue-lite"><i class="fas fa-boxes"></i></span>
          <span class="label">Inventory Report</span>
        </a>

        <a href="/reports/low-stock" class="nav-btn active">
          <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
          <span class="label">Low Stock</span>
        </a>

        <a href="/reports/distribution" class="nav-btn">
          <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
          <span class="label">Distribution</span>
        </a>

      </div>
  `
})