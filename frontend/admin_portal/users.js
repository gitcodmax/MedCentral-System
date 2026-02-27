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

  // Navigation tab buttons code
  document.getElementById('tabsNav')
    .addEventListener('click', (e) => {
      const sysUsersCardElem = document.getElementById('sysUsersCard')
      const driversCardElem = document.getElementById('driversCard')

      if (e.target.classList.contains('drivers-link')) {
        document.querySelector('.sys-users-link')
          .classList.remove('active')
        e.target.classList.add('active')
        sysUsersCardElem.classList.add('hidden')
        driversCardElem.classList.remove('hidden')
      }

      if (e.target.classList.contains('sys-users-link')) {
        document.querySelector('.drivers-link')
          .classList.remove('active')
        e.target.classList.add('active')
        sysUsersCardElem.classList.remove('hidden')
        driversCardElem.classList.add('hidden')
      }
    })
})