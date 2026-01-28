export function renderSidebar() {
  document.querySelector('.js-sidebar')
    .innerHTML = `
    <div class="sidebar-logo">
      <img src="/images/MedCentral_logo_small.png" alt="MedCentral Logo" class="logo">
    </div>

    <ul class="nav-links">
      <li class="active">
        <a href="#"><i class="fas fa-th-large"></i> <span>Dashboard</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-plus-circle"></i> <span>Request Items</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-list-ul"></i> <span>Orders List</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-file-invoice"></i> <span>Order Details</span></a>
      </li>
      <li>
        <a href="#"><i class="fas fa-chart-bar"></i> <span>Reports</span></a>
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
}