import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('.app-container')
    .innerHTML = `
      
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <div class="container">
        <div class="report-page-header">
          <div class="header-text">
            <h2>Low Stock Report</h2>
            <p>Items below minimum stock levels</p>
          </div>
        </div>

        <section class="kpi-grid">
          <div class="card kpi-card tot-low-stock-card">
            <div class="kpi-content">
              <span class="kpi-label">Total Low Stock Items</span>
              <span class="kpi-value warning-text" id="totLowStockItemsKpi"></span>
            </div>
            <div class="kpi-icon bg-warning-light">
              <i class="fas fa-layer-group"></i>
            </div>
          </div>
          <div class="card kpi-card out-of-stock-items-card">
            <div class="kpi-content">
              <span class="kpi-label">Out of Stock Items</span>
              <span class="kpi-value critical-text" id="outOfStockItemsKpi"></span>
            </div>
            <div class="kpi-icon bg-danger-light">
              <i class="fas fa-circle-exclamation"></i>
            </div>
          </div>
          <div class="card kpi-card affected-cat-card">
            <div class="kpi-content">
              <span class="kpi-label">Affected Categories</span>
              <span class="kpi-value" id="affectedCategories"></span>
            </div>
            <div class="kpi-icon bg-info-light">
              <i class="fas fa-tags"></i>
            </div>
          </div>
        </section>

        <section class="card filter-section">
          <div class="filter-row">
            <div class="filter-group">
              <label><i class="fas fa-search"></i> Item Name</label>
              <input type="text" placeholder="Search items...">
            </div>
            <div class="filter-group">
              <label><i class="fas fa-filter"></i> Category</label>
              <select>
                <option>All Categories</option>
                <option>Vaccines</option>
                <option>Antibiotics</option>
                <option>Surgical Supplies</option>
              </select>
            </div>
            <div class="filter-group">
              <label><i class="fas fa-truck-medical"></i> Supplier</label>
              <select>
                <option>All Suppliers</option>
                <option>Global Pharma Co.</option>
                <option>Medline Industries</option>
              </select>
            </div>
            <div class="filter-group">
              <label><i class="fas fa-temperature-half"></i> Storage Temp.</label>
              <select>
                <option>Any Temp</option>
                <option>Room Temp</option>
                <option>Refrigerated</option>
                <option>Frozen</option>
              </select>
            </div>
            <button class="btn-apply">
              Apply Filters
            </button>
          </div>
        </section>

        <section class="card table-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th class="text-right">Current Stock</th>
                  <th class="text-right">Min. Level</th>
                  <th class="text-right">Deficit</th>
                  <th>Supplier</th>
                  <th>Last Restocked</th>
                  <th>Stock Status</th>
                </tr>
              </thead>
              <tbody id="lowStockReportTbody"></tbody>
            </table>
          </div>
        </section>

        <section class="card chart-section">
          <h3><i class="fas fa-chart-bar"></i> Low Stock Items by Category</h3>
          <div class="chart-placeholder">
            <canvas id="lowStockCategoryBars"></canvas>
          </div>
        </section>
      </div>
    </div>
    `

  renderSidebar()
  renderReportsNavbar('low_stock_report')

  const lowStockReportMockData = {
    "kpi_metrics": {
      "total_low_stock_items": 42,
      "out_of_stock_items": 12,
      "affected_categories": 8
    },
    "inventory_table": [
      {
        "item_name": "Propofol 10mg/ml",
        "category": "Anesthetic",
        "current_stock": 0,
        "min_level": 50,
        "deficit": -50,
        "supplier": "Global Pharma Co.",
        "last_restocked": "2025-12-05",
        "stock_status": "Out of Stock"
      },
      {
        "item_name": "Surgical Gloves (M)",
        "category": "Consumables",
        "current_stock": 410,
        "min_level": 300,
        "deficit": 110,
        "supplier": "Medline Industries",
        "last_restocked": "2026-02-22",
        "stock_status": "Healthy"
      },
      {
        "item_name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "current_stock": 420,
        "min_level": 500,
        "deficit": -80,
        "supplier": "Alpha Medics",
        "last_restocked": "2026-01-20",
        "stock_status": "Low Stock"
      },
      {
        "item_name": "Saline Solution 0.9%",
        "category": "IV Fluids",
        "current_stock": 20,
        "min_level": 200,
        "deficit": -180,
        "supplier": "Baxter Healthcare",
        "last_restocked": "2026-02-15",
        "stock_status": "Low Stock"
      },
      {
        "item_name": "Epinephrine Auto-Injector",
        "category": "Emergency",
        "current_stock": 0,
        "min_level": 25,
        "deficit": -25,
        "supplier": "Global Pharma Co.",
        "last_restocked": "2025-11-30",
        "stock_status": "Out of Stock"
      }
    ],
    "low_stock_by_category_bar_chart": [
      { "category": "Anesthetic", "low_stock_count": 5 },
      { "category": "Consumables", "low_stock_count": 14 },
      { "category": "Antibiotics", "low_stock_count": 8 },
      { "category": "IV Fluids", "low_stock_count": 9 },
      { "category": "Emergency", "low_stock_count": 6 }
    ]
  }

  document.getElementById('totLowStockItemsKpi')
    .textContent = lowStockReportMockData.kpi_metrics.total_low_stock_items
  document.getElementById('outOfStockItemsKpi')
    .textContent = lowStockReportMockData.kpi_metrics.out_of_stock_items
  document.getElementById('affectedCategories')
    .textContent = lowStockReportMockData.kpi_metrics.affected_categories

  const lowStockRprtTblFrag = document.createDocumentFragment()
  lowStockReportMockData.inventory_table.forEach(item => {
    const tblRow = document.createElement('tr')
    const itemStatusLower = item.stock_status.toLowerCase()
    tblRow.className = `row-${itemStatusLower === 'out of stock' ?
      itemStatusLower.replaceAll(' ', '-') : itemStatusLower}`

    tblRow.innerHTML = `
      <td><strong class="tbl-item-name">${item.item_name}</strong></td>
      <td>${item.category}</td>
      <td class="text-right">${item.current_stock}</td>
      <td class="text-right">${item.min_level}</td>
      <td class="text-right deficit-${itemStatusLower}">${item.deficit}</td>
      <td>${item.supplier}</td>
      <td>${item.last_restocked}</td>
      <td><span class="stock-badge badge-${itemStatusLower}">${item.stock_status}</span></td>
    `

    lowStockRprtTblFrag.appendChild(tblRow)
  })
  document.getElementById('lowStockReportTbody')
    .appendChild(lowStockRprtTblFrag)

  // Low Stock by Category bar chart
  const labels = lowStockReportMockData.low_stock_by_category_bar_chart.map(cat => cat.category)
  const dataValues = lowStockReportMockData.low_stock_by_category_bar_chart.map(cat => cat.low_stock_count)

  const lowStockCatCtx = document.getElementById('lowStockCategoryBars').getContext('2d')
  new Chart(lowStockCatCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Low Stock SKUs',
        data: dataValues,
        backgroundColor: '#FF8C0022',
        borderColor: '#FF8C00',
        borderWidth: 2,
        borderRadius: 4,
        barThichness: 30
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })
})