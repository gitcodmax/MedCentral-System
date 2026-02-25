import { renderSidebar } from "./sidebar.js";

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
})