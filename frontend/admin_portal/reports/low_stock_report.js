import { adminPagesLink } from "../../global.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

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

  const lowStockReportData = await getLowStockReportData()

  document.getElementById('totLowStockItemsKpi')
    .textContent = lowStockReportData.kpi_metrics.total_low_stock_items
  document.getElementById('outOfStockItemsKpi')
    .textContent = lowStockReportData.kpi_metrics.out_of_stock_items
  document.getElementById('affectedCategories')
    .textContent = lowStockReportData.kpi_metrics.affected_categories

  const lowStockRprtTblFrag = document.createDocumentFragment()
  lowStockReportData.inventory_table.forEach(item => {
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
      <td>${!item.last_restocked ? '---' : new Date(item.last_restocked).toDateString()}</td>
      <td><span class="stock-badge badge-${itemStatusLower}">${item.stock_status}</span></td>
    `

    lowStockRprtTblFrag.appendChild(tblRow)
  })
  document.getElementById('lowStockReportTbody')
    .appendChild(lowStockRprtTblFrag)

  // Low Stock by Category bar chart
  const labels = lowStockReportData.low_stock_by_category_bar_chart.map(cat => cat.category)
  const dataValues = lowStockReportData.low_stock_by_category_bar_chart.map(cat => cat.low_stock_count)

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

async function getLowStockReportData(){
  const response = await fetch(`${adminPagesLink}/lowStockReportData`)
  const res = await response.json()
  return res.lowStockReportData.low_stock_data
}