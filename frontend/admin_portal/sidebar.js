export function renderSidebar() {
  const logoImage = `<img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">`
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
        <a href="#" class="nav-link active">
          <i class="fas fa-th-large"></i> <span>Dashboard</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="fas fa-hospital"></i> <span>Hospitals</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="fas fa-boxes"></i> <span>Inventory</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="fas fa-clipboard-list"></i> <span>Orders</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="fas fa-users"></i> <span>Users</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link">
          <i class="fas fa-chart-pie"></i> <span>Reports</span>
        </a>
      </li>
    </ul>
  
  `

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
          <div class="profile-section">
            <div class="avatar">JS</div>
            <div class="admin-info">
              <span>John Smith</span>
            </div>
          </div>
        </div>
      </div>
    `
}

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

  if(pageName === 'distribution_report'){
    document.getElementById('distroReportLink')
      .classList.add('active')
  }else if(pageName === 'low_stock_report'){
    document.getElementById('lowStockReportLink')
      .classList.add('active')
  }else if(pageName === 'inventory_report'){
    document.getElementById('invReportLink')
      .classList.add('active')
  }
}