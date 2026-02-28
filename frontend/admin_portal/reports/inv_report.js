import { renderSidebar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.app-container')
    .innerHTML = `
    
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <main class="container">

        <div class="report-page-header">
          <div class="header-text">
            <h2>Inventory Stock Report</h2>
            <p>Overview of current warehouse inventory status and valuation</p>
          </div>
        </div>

        <section class="card filter-card">
          <div class="filter-grid">
            <div class="filter-group">
              <label>Category</label>
              <select>
                <option>All Categories</option>
                <option>Vaccines</option>
                <option>Surgical Supplies</option>
                <option>Antibiotics</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Storage Temperature</label>
              <select>
                <option>Any Temperature</option>
                <option>Room Temp (20-25°C)</option>
                <option>Refrigerated (2-8°C)</option>
                <option>Frozen (-20°C)</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Stock Status</label>
              <select>
                <option>All Statuses</option>
                <option>Healthy</option>
                <option>Low</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div class="filter-group align-end">
              <button class="btn btn-secondary full-width">Apply Filters</button>
            </div>
          </div>
        </section>

        <section class="metrics-grid">
          <div class="card metric-card tot-items-card">
            <div class="metric-info">
              <span class="metric-title">Total Unique Items</span>
              <span id="totItemsMetric" class="metric-value"></span>
            </div>
            <div class="metric-icon bg-blue"><i class="fas fa-boxes-stacked"></i></div>
          </div>
          <div class="card metric-card tot-units-card">
            <div class="metric-info">
              <span class="metric-title">Total Stock Units</span>
              <span id="totUnitsMetric" class="metric-value"></span>
            </div>
            <div class="metric-icon bg-purple"><i class="fas fa-pills"></i></div>
          </div>
          <div class="card metric-card total-inv-card">
            <div class="metric-info">
              <span class="metric-title">Total Inventory Value</span>
              <span id="totInvMetric" class="metric-value"></span>
            </div>
            <div class="metric-icon bg-green"><i class="fas fa-dollar-sign"></i></div>
          </div>
          <div class="card metric-card critical-border">
            <div class="metric-info">
              <span class="metric-title">Below Minimum Level</span>
              <span id="belowMinMetric" class="metric-value text-critical"></span>
            </div>
            <div class="metric-icon bg-red"><i class="fas fa-exclamation-triangle"></i></div>
          </div>
        </section>

        <section class="card table-container">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Storage Temp</th>
                  <th class="text-right">Current Stock</th>
                  <th class="text-right">Min Level</th>
                  <th>Stock Status</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total Value</th>
                </tr>
              </thead>
              <tbody id="invTbody"></tbody>
            </table>
          </div>
        </section>

        <section class="card chart-card">
          <h3>Stock Distribution by Category</h3>
          <div class="chart-placeholder">
            <canvas id="stockDistroBarChart"></canvas>
          </div>
        </section>

        <section class="card chart-card">
          <div class="card-header">
            <div class="header-main">
              <h3>Stock Status Distribution</h3>
              <p class="card-subtitle">Visual representation of inventory health categories</p>
            </div>
          </div>

          <div class="chart-drawing-area">
            <canvas id="stockStatusPieChart"></canvas>
        </section>
      </main>
    </div>
  
    `

  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
        <div class="reports-button-group">

          <a href="/reports/inventory" class="nav-btn active">
            <span class="icon bg-blue-lite"><i class="fas fa-boxes"></i></span>
            <span class="label">Inventory Report</span>
          </a>

          <a href="/reports/low-stock" class="nav-btn">
            <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
            <span class="label">Low Stock</span>
          </a>

          <a href="/reports/distribution" class="nav-btn">
            <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
            <span class="label">Distribution</span>
          </a>

        </div>
    `

  const InventoryReportMockData = {
    "kpi_metrics": {
      "total_unique_items": 1248,
      "total_stock_units": 45200,
      "total_inventory_value": 842500.00,
      "items_below_minimum": 14
    },
    "inventory_table": [
      {
        "item_name": "Insulin Glargine 100U",
        "category": "Diabetes",
        "storage_temp": "R",
        "current_stock": 1200,
        "min_level": 500,
        "stock_status": "Healthy",
        "unit_price": 45.00,
        "total_value": 54000.00
      },
      {
        "item_name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "storage_temp": "C",
        "current_stock": 420,
        "min_level": 400,
        "stock_status": "Low",
        "unit_price": 12.50,
        "total_value": 5250.00
      },
      {
        "item_name": "Surgical Gloves (M)",
        "category": "Consumables",
        "storage_temp": "A",
        "current_stock": 110,
        "min_level": 300,
        "stock_status": "Low Stock",
        "unit_price": 0.85,
        "total_value": 93.50
      },
      {
        "item_name": "Propofol 10mg/ml",
        "category": "Anesthetic",
        "storage_temp": "F",
        "current_stock": 0,
        "min_level": 50,
        "stock_status": "Out of Stock",
        "unit_price": 18.20,
        "total_value": 0.00
      }
    ],
    "category_distribution_bar_chart": [
      { "category": "Vaccines", "current_stock": 12500 },
      { "category": "Antibiotics", "current_stock": 8400 },
      { "category": "Consumables", "current_stock": 15200 },
      { "category": "Emergency", "current_stock": 3100 },
      { "category": "Diabetes", "current_stock": 6000 }
    ],
    "stock_status_pie_chart": [
      { "status": "Healthy", "count": 850 },
      { "status": "Low Stock", "count": 160 },
      { "status": "Out of Stock", "count": 14 }
    ]
  }

  // Show Kpi data
  document.getElementById('totItemsMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_unique_items
  document.getElementById('totUnitsMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_stock_units
  document.getElementById('totInvMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_inventory_value
  document.getElementById('belowMinMetric')
    .textContent = InventoryReportMockData.kpi_metrics.items_below_minimum

  // Populate the items table
  const invTableFrag = document.createDocumentFragment()
  InventoryReportMockData.inventory_table.forEach(item => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td><strong class="item-name">${item.item_name}</strong></td>
      <td>${item.category}</td>
      <td> <span class="badge ${item.storage_temp}">${item.storage_temp}</span></td>
      <td class="text-right">${item.current_stock}</td>
      <td class="text-right">${item.min_level}</td>
      <td><span class="stock-badge badge-${item.stock_status.toLowerCase()}">${item.stock_status}</span></td>
      <td class="text-right">${item.unit_price}</td>
      <td class="text-right tot-value">${item.total_value}</td>
    `

    invTableFrag.appendChild(tblRow)
  })
  document.getElementById('invTbody')
    .appendChild(invTableFrag)

  // Form the Stock Distribution  bar chart by category
  const labels = InventoryReportMockData.category_distribution_bar_chart.map(cat => cat.category)
  const dataValues = InventoryReportMockData.category_distribution_bar_chart.map(cat => cat.current_stock)

  const stockDistroCtx = document.getElementById("stockDistroBarChart")
  new Chart(stockDistroCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Current Stock Units',
        data: dataValues,
        backgroundColor: '#007BFF22',
        borderColor: '#007BFF',
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 25
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  })

  // Stock Status distro
  const statusLabels = InventoryReportMockData.stock_status_pie_chart.map(status => status.status)
  const statusCounts = InventoryReportMockData.stock_status_pie_chart.map(status => status.count)

  const stockStatusDistroCtx = document.getElementById('stockStatusPieChart')
  new Chart(stockStatusDistroCtx, {
    type: 'doughnut',
    data: {
      labels: statusLabels,
      datasets: [{
        data: statusCounts,
        backgroundColor: [
          '#008B00',
          '#FF8C00',
          '#DC3545'
        ],
        hoverOffset: 15,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  })
})