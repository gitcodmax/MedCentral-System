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
                    <a href="report_damage.html" class="dropdown-item">
                        <i class="fas fa-exclamation-triangle"></i> Report Damaged Items
                    </a>
                </div>
            </div>

            <a href="#" class="nav-item">Completed Orders</a>
            <a href="#" class="nav-item">Reports</a>
        </nav>

        <div class="user-info">
            <div class="user-details">
                Peter, Inventory Clerk (Nairobi)
            </div>
            <div class="time-and-alerts">
                <span id="current-time">10:45 AM</span>
                <span id="current-date">WED, APR 16</span>
                <i class="fas fa-bell notification-bell"></i>
            </div>
        </div>
    
        `
}