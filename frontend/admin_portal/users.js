import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="header-section">
        <h2>User Management</h2>
        <div class="header-actions">
            <button class="btn header-btn"><i class="fas fa-user-plus"></i> Create User</button>
            <button class="btn header-btn"><i class="fas fa-truck-pickup"></i> Add Driver</button>
        </div>
      </div>
    `
})