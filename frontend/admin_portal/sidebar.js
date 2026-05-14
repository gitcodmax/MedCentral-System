import {
  adminPagesLink, getUserName, handleOverlay,
  renderSuccessErrorOverlay, triggerStatus
} from "../global.js"

export async function renderSidebar() {
  const logoImage = `<img src="/images/MedCentralis_logo.png" alt="MedCentralis Logo" class="logo">`
  const sidebarElem = document.getElementById('sidebar')

  // Display the sidebar
  sidebarElem.innerHTML = `      
    <div class="logo-area">
      ${logoImage}
    </div>

    <button class="close-sidebar-btn js-close-sidebar-btn" title="Close sidebar">
      <i class="fa-solid fa-less-than"></i>
    </button>

    <button class="open-sidebar-btn js-open-sidebar-btn" title="Open sidebar">
      <i class="fa-solid fa-greater-than"></i>
    </button>

    <ul class="nav-links">
      <li class="nav-item">
        <a href="/admin_portal/dash.html" class="nav-link" id="dashLink">
          <i class="fas fa-th-large"></i> <span>Dashboard</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/admin_portal/hospitals.html" class="nav-link" id="hospitalsLink">
          <i class="fas fa-hospital"></i> <span>Hospitals</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/admin_portal/inventory.html" class="nav-link" id="inventoryLink">
          <i class="fas fa-boxes"></i> <span>Inventory</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/admin_portal/orders.html" class="nav-link" id="ordersLink">
          <i class="fas fa-clipboard-list"></i> <span>Orders</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/admin_portal/users.html" class="nav-link" id="usersLink">
          <i class="fas fa-users"></i> <span>Users</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/admin_portal/reports/inv_report.html" class="nav-link" id="reportsLink">
          <i class="fas fa-chart-pie"></i> <span>Reports</span>
        </a>
      </li>
    </ul>
  
  `
  const windowLink = window.location.href
  if (windowLink.includes('dash')) {
    document.getElementById('dashLink')
      .classList.add('active')
  } else if (windowLink.includes('hospitals')) {
    document.getElementById('hospitalsLink')
      .classList.add('active')
  } else if (windowLink.includes('inventory')) {
    document.getElementById('inventoryLink')
      .classList.add('active')
  } else if (windowLink.includes('orders')) {
    document.getElementById('ordersLink')
      .classList.add('active')
  } else if (windowLink.includes('users')) {
    document.getElementById('usersLink')
      .classList.add('active')
  } else if (windowLink.includes('reports')) {
    document.getElementById('reportsLink')
      .classList.add('active')
  }

  // Set up the buttons to open and close the sidebar
  sidebarElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('close-sidebar-btn')) {
      sidebarElem.classList.add('collapsed')
      document.querySelector('.top-header')
        .classList.add('collapsed')
    }

    if (btn.classList.contains('open-sidebar-btn')) {
      sidebarElem.classList.remove('collapsed')
      document.querySelector('.top-header')
        .classList.remove('collapsed')
    }
  })

  const adminUserId = sessionStorage.getItem('userId')
  const name = await getUserName(adminUserId)
  const nameInitials = name.split(' ').map(n => n.slice(0, 1)).join('').toUpperCase()

  // Display the page header
  document.getElementById('topHeader')
    .innerHTML = `     
      <div class="logo-container">
        ${logoImage}
      </div>

      <div class="page-header">
        <div class="header-left js-header-left"></div>
        <div class="header-actions">
          <div class="notif-btn">
            <i class="far fa-bell"></i>
            <span class="sidebar-badge">4</span>
          </div>
          <button class="profile-section">
            <div class="profile">
              <div class="avatar">${nameInitials}</div>
              <div class="admin-info">
                <span>${name}</span>
              </div>
            </div>
            <i class="fa-solid caret fa-caret-right"></i>
            <i class="fa-solid caret fa-caret-down hidden"></i>
          </button>

          <button class="update-pwd-btn hidden" id="updateAdminPwdBtn">
            Update Admin Password
          </button>
        </div>
      </div>
    `

  // Set up update of admin password
  const updateAdminPwdHTML = `
    <div class="modal-overlay" id="resetAdminPasswordOverlay">
      <div class="reset-pwd-modal-content reset-admin-pwd-overlay" style="max-width: 400px;">
        <h2>Reset Admin Password</h2>

        <form id="resetAdminPasswordForm">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <div class="password-wrapper">
                <input type="text" id="newAdminPassword" placeholder="••••••••"
                    required>
            </div>
          </div>

          <div class="admin-pwd-modal-footer">
              <button type="button" class="btn close-overlay-btn js-btn-close-overlay">Cancel</button>
              <button type="submit" class="btn save-btn">Confirm Reset</button>
          </div>
        </form>
      </div>
    </div>
  `
  document.querySelector('main')
    .insertAdjacentHTML("beforeend", updateAdminPwdHTML)

  renderSuccessErrorOverlay()

  // Show/Hide the button to reset admin password
  let showPwdBtn = true
  const rightCaretElem = document.querySelector('.fa-caret-right')
  const downCaretElem = document.querySelector('.fa-caret-down')
  const updateAdminPwdElem = document.querySelector('.update-pwd-btn')
  document.querySelector('.page-header')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      if (btn.classList.contains('profile-section')) {
        if (showPwdBtn) {
          rightCaretElem.classList.add('hidden')
          downCaretElem.classList.remove('hidden')
          updateAdminPwdElem.classList.remove('hidden')
          showPwdBtn = false
        } else {
          rightCaretElem.classList.remove('hidden')
          downCaretElem.classList.add('hidden')
          updateAdminPwdElem.classList.add('hidden')
          showPwdBtn = true
        }
      }
    })


  const updateAdminPwdOverlayBtnElem = document.getElementById('updateAdminPwdBtn')
  const resetPwdOverlayElem = document.getElementById('resetAdminPasswordOverlay')
  const newPwdTextboxElem = document.getElementById('newAdminPassword')
  if (updateAdminPwdOverlayBtnElem) {
    updateAdminPwdOverlayBtnElem.addEventListener('click', () => {
      handleOverlay(resetPwdOverlayElem)

      document.getElementById('resetAdminPasswordForm')
        .addEventListener('submit', async (e) => {
          e.preventDefault()

          const response = await fetch(`${adminPagesLink}/updateSysUsersPassword`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: adminUserId,
                plainPwd: newPwdTextboxElem.value
              })
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)
        })
    })
  }
}

// Navigation bar to reports pages
export function renderReportsNavbar(pageName) {
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="reports-button-group">

        <a href="/admin_portal/reports/inv_report.html" class="nav-btn" id="invReportLink">
          <span class="icon bg-blue-lite"><i class="fas fa-boxes"></i></span>
          <span class="label">Inventory Report</span>
        </a>

        <a href="/admin_portal/reports/low_stock_report.html" class="nav-btn" id="lowStockReportLink">
          <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
          <span class="label">Low Stock</span>
        </a>

        <a href="/admin_portal/reports/distribution_report.html" class="nav-btn" id="distroReportLink">
          <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
          <span class="label">Distribution</span>
        </a>

      </div>
    `

  if (pageName === 'distribution_report') {
    document.getElementById('distroReportLink')
      .classList.add('active')
  } else if (pageName === 'low_stock_report') {
    document.getElementById('lowStockReportLink')
      .classList.add('active')
  } else if (pageName === 'inventory_report') {
    document.getElementById('invReportLink')
      .classList.add('active')
  }
}