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