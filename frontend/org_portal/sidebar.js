import { getHospName, hosId } from "./dash.js"
import { noHospCartItems } from "./request_items/order_summary.js"

export async function renderSidebar(pageName) {
  const name = await getHospName(hosId)
  const nameInitials = name.split(' ').map(n => n.slice(0, 1)).join('')

  const sidebar = document.querySelector('.js-sidebar')
  const logoImg = `<img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">`
  document.querySelector('.main-content-logo')
  .innerHTML = logoImg

  sidebar.innerHTML = `
    <div class="sidebar-logo">${logoImg}</div>

    <button class="close-sidebar-btn js-close-sidebar-btn">
      <i class="fa-solid fa-less-than"></i>
    </button>

    <button class="open-sidebar-btn js-open-sidebar-btn">
      <i class="fa-solid fa-greater-than"></i>
    </button>

    <ul class="nav-links">
      <li class="dash-li">
        <a href="/org_portal/dash.html"><i class="fas fa-th-large"></i> <span class="page-name">Dashboard</span></a>
      </li>
      <li class="request_items-li">
        <a href="/org_portal/request_items/product_catalog.html"><i class="fas fa-plus-circle"></i> <span class="page-name">Request Items</span></a>
      </li>
      <li class="payment-li">
        <a href="/org_portal/payment.html"><i class="fa-solid fa-circle-check"></i> <span class="page-name">Approved Requests</span></a>
      </li>
      <li class="receive_ord-li">
        <a href="/org_portal/receive_ord.html"><i class="fas fa-inbox"></i> <span class="page-name">Recieve Items</span></a>
      </li>
      <li class="ord_history-li">
        <a href="/org_portal/ord_history.html"><i class="fas fa-file-invoice"></i> <span class="page-name">Order History</span></a>
      </li>
      <li class="reports-li">
        <a href="/org_portal/reports/item_consumption.html"><i class="fas fa-chart-bar"></i> <span class="page-name">Reports</span></a>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="user-info">
        <img src="https://ui-avatars.com/api/?name=H&background=0D8ABC&color=fff" alt="User">
        <div class="user-text">
          <p class="u-name">${name}</p>
          <p class="u-role">Procurement Dept.</p>
        </div>
      </div>
      <button class="btn-logout"><i class="fas fa-sign-out-alt"></i></button>
    </div>
  `

  if(window.location.href.includes(`${pageName}`)){
    document.querySelector(`.${pageName}-li`)
      .classList.add('active')
  }

  document.querySelector('.js-close-sidebar-btn')
    .addEventListener('click', () => {
      sidebar.classList.add('collapsed')
      document.querySelector('.main-content-logo')
        .style.display = 'block'
    })
  document.querySelector('.js-open-sidebar-btn')
    .addEventListener('click', () => {
      sidebar.classList.remove('collapsed')
      document.querySelector('.main-content-logo')
        .style.display = 'none'
    })
}

// Display the navigation bar in the request items page
export async function renderRequestItemsNavbar(){
  document.querySelector('.js-view-navigation')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if(!btn) return;
      
      if(btn.classList.contains('js-catalog-nav')){
        window.location.href = `/org_portal/request_items/product_catalog.html`
      }else{
        window.location.href = `/org_portal/request_items/order_summary.html`
      }
    })

  document.querySelector('.js-view-navigation')
    .innerHTML = `
      <div class="nav-tabs">
        <button class="nav-tab js-catalog-nav" data-view="catalog">
          <i class="fas fa-th-large"></i>
          <span>Product Catalog</span>
        </button>

        <button class="nav-tab js-ord-sum-nav" data-view="summary">
          <i class="fas fa-clipboard-list"></i>
          <span>Order Summary / Cart</span>
          <span class="cart-badge" id="navCartCount">0</span>
        </button>
      </div>    
    `

  document.getElementById('navCartCount')
    .textContent = await noHospCartItems(hosId)

  if(window.location.href.includes('product_catalog')){
    document.querySelector('.js-catalog-nav')
      .classList.add('active')
  }else{
    document.querySelector('.js-ord-sum-nav')
      .classList.add('active')
  }
}

// Display the navigation bar in the reports pages
export function renderReportsNavbar(){
  const navbarElem = document.querySelector('.js-report-tabs')

  navbarElem.innerHTML = `
    <div class="tabs-container">
      <a href="#" class="tab-link item-consumption blue">
        <i class="fas fa-boxes"></i> Item Consumption
      </a>
      <a href="#" class="tab-link finance green">
        <i class="fas fa-file-invoice-dollar"></i> Financial Report
      </a>
    </div>
  `

  if(window.location.href.includes('item_consumption')){
    document.querySelector('.item-consumption')
      .classList.add('active')
  }else if(window.location.href.includes('cost_report')){
    document.querySelector('.finance')
      .classList.add('active')
  }

  navbarElem.addEventListener('click', (e) => {
    const pageLink = e.target.closest('a')
    if(!pageLink) return;

    if(pageLink.classList.contains('item-consumption')){
      window.location.href = '/org_portal/reports/item_consumption.html'
    } else if(pageLink.classList.contains('finance')){
      window.location.href = `/org_portal/reports/cost_report.html`
    }
  })
}