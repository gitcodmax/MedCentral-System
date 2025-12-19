//This file contains the code to display the header

export function renderHeader() {
  document.querySelector('.main-header')
    .innerHTML = `    
        <div class="logo">
            <img src="../../images/MedCentral_logo_small.png" class="dash-logo">
        </div>

        <nav class="main-nav">
            <a href="/inv_clerk/inv_clerk_dash.html" class="nav-item active">Dashboard</a>

            <div class="nav-item dropdown-container">
                <a href="#" class="nav-link stock-link">Stock <i class="fas fa-caret-down"></i></a>

                <div class="dropdown-menu">
                    <a href="/inv_clerk/receive_stock/receive_stock.html" class="dropdown-item">
                        <i class="fas fa-box-open"></i> Receive New Stock
                    </a>
                    <a href="/inv_clerk/receive_stock/report_damage.html" class="dropdown-item">
                        <i class="fas fa-exclamation-triangle"></i> Report Damaged Items
                    </a>
                </div>
            </div>

            <a href="/inv_clerk/completed_orders.html" class="nav-item">Completed Orders</a>
        </nav>

        <div class="user-info">
            <div class="user-details">
                Peter, Inventory Clerk (Nairobi)
            </div>
            <div class="time-and-alerts">
                <span id="current-time"></span>
                <span id="current-date"></span>
                <i class="fas fa-bell notification-bell"></i>
            </div>
        </div>
    
        `
    clockUpdate()
}

function clockUpdate() {
  // Real-Time Clock Update
  const updateClock = () => {
    document.getElementById('current-time')
      .textContent = dayjs().format('hh:mm A');
    document.getElementById('current-date')
      .textContent = dayjs().format('ddd, MMM D').toUpperCase();
  };

  // Update immediately and then every minute
  updateClock();
  setInterval(updateClock, 60000);
}