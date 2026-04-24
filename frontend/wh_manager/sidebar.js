import { getUserName } from "../global.js"

export async function renderSidebar(pageName) {

  const whManagerId = sessionStorage.getItem('userId')
  const name = await getUserName(whManagerId)

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
          <h3>${name}</h3>
          <p>Warehouse Manager</p>
        </div>
        <button id="sidebarToggle" class="toggle-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <ul class="nav-links">
        <li class="wh_manager_dash">   
          <a href="/wh_manager/wh_manager_dash.html">
            <i class="fas fa-home"></i>
            Home
          </a>
        </li>

        <li class="section-label">Orders</li>
        <li class="review_requests">         
          <a href="/wh_manager/orders/review_requests.html">
            <i class="fas fa-search-dollar"></i>
            Review Requests
          </a>
        </li>
        <li class="assign_to_clerk">          
          <a href="/wh_manager/orders/assign_to_clerk.html">
            <i class="fas fa-user-tag"></i>
            Assign to Clerk
          </a>
        </li>
        <li class="assign_to_driver">
          <a href="/wh_manager/orders/assign_to_driver.html">
            <i class="fas fa-truck-loading"></i>
            Assign to Driver
          </a>
        </li>
        <li class="orders_requests">
          <a href="/wh_manager/orders/orders_requests.html">
            <i class="fas fa-list"></i>
            All Orders
          </a>
        </li>

        <li class="section-label">Stock</li>
        <li class="item_registry">
          <a href="/wh_manager/stock/item_registry.html">
            <i class="fas fa-boxes"></i>
            Item Registry
          </a>
        </li>
        <li class="wh_layout">
          <a href="/wh_manager/stock/wh_layout.html">
            <i class="fas fa-th"></i>
            Shelf Details</a>
        </li>
      </ul>
    
    `

  controlSidebar()

  if(window.location.href.includes(pageName)){
    document.querySelector(`.${pageName}`)
      .classList.add('active')
  }
}

//Controls the hamburger icon for the sidebar
function controlSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}