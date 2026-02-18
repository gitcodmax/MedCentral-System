export function renderSidebar(){
  const logoImage = `<img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">`

  document.getElementById('sidebar')
    .innerHTML = `
      
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
            <span class="badge">4</span>
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