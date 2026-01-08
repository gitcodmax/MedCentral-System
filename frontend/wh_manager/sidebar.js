
export function renderSidebar() {

  //Display the logo
  document.querySelector('.logo-container')
    .innerHTML = `
    <img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">
    `
  //Display the nav links
  document.querySelector('nav')
    .innerHTML = `    
      <div class="user-profile">
        <div class="avatar"></div>
        <div class="user-info">
          <h3>John Doe</h3>
          <p>Warehouse Manager</p>
        </div>
        <button id="sidebarToggle" class="toggle-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <ul class="nav-links">
        <li class="active"><i class="fas fa-home"></i>
          <a href="/wh_manager/wh_manager_dash.html">Home</a>
        </li>
        <li class="section-label">Orders</li>
        <li><i class="fas fa-search-dollar"></i>
          <a href="#">Review Requests</a>
        </li>
        <li><i class="fas fa-user-tag"></i>
          <a href="#">Assign to Clerk</a>
        </li>
        <li><i class="fas fa-truck-loading"></i>
          <a href="#">Assign to Driver</a>
        </li>
        <li><i class="fas fa-list"></i>
          <a href="#">All Orders</a>
        </li>
        <li class="section-label">Stock</li>
        <li><i class="fas fa-boxes"></i>
          <a href="#">Inventory</a>
        </li>
        <li><i class="fas fa-th"></i>
          <a href="#">View Shelf Details</a>
        </li>
      </ul>

      <div class="sidebar-footer">
        <p id="current-time">10:42 AM</p>
        <p id="current-date">Fri, 10 Dec 2025</p>
      </div>
    
    `

  controlSidebar()
}

//Controls the hamburger icon for the sidebar
function controlSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}