export function renderSidebar() {
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
      <li class="active">
        <a href="#"><i class="fas fa-th-large"></i> <span class="page-name">Dashboard</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-plus-circle"></i> <span class="page-name">Request Items</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-list-ul"></i> <span class="page-name">Orders List</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-file-invoice"></i> <span class="page-name">Order Details</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-chart-bar"></i> <span class="page-name">Reports</span></a>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="user-info">
        <img src="https://ui-avatars.com/api/?name=Karen+Hospital&background=0D8ABC&color=fff" alt="User">
        <div class="user-text">
          <p class="u-name">Karen Hospital</p>
          <p class="u-role">Procurement Dept.</p>
        </div>
      </div>
      <button class="btn-logout"><i class="fas fa-sign-out-alt"></i></button>
    </div>
  `

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

export function displayNoMatchFound(){
  const noMatchElem = document.querySelector('.js-no-match-found')
  if(noMatchElem){
    noMatchElem.innerHTML = `
      <div class="no-match-elements">
        <i class="fa-solid fa-face-frown frowned-face"></i>
        <p>No Match Found!!</p>
      </div>         
    `
  }
}

export function renderRequestItemsNavbar(){
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
          <span>Order Summary</span>
          <span class="cart-badge" id="navCartCount">0</span>
        </button>
      </div>    
    `

  if(window.location.href.includes('product_catalog')){
    document.querySelector('.js-catalog-nav')
      .classList.add('active')
  }else{
    document.querySelector('.js-ord-sum-nav')
      .classList.add('active')
  }
}