import { catStorageData } from "../inventory.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

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
              <select id="filterCategories">
                <option value='all'>All Categories</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Storage Temperature</label>
              <select id="filterStorageTemp">
                <option value='any'>Any Temperature</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Stock Status</label>
              <select id="filterStockStatus">
                <option value="all">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="low">Low</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div class="filter-group align-end">
              <button class="btn btn-secondary full-width" id="applyInvFilterBtn">Apply Filters</button>
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
                  <th class="text-right">Total Selling Units</th>
                  <th class="text-right">Total Value</th>
                </tr>
              </thead>
              <tbody id="invTbody"></tbody>
            </table>
          </div>
        </section>

        <section class="card chart-card">
          <h3>Stock Distribution by Category</h3>
          <div class="chart-placeholder"></div>
        </section>

        <section class="card chart-card">
          <div class="card-header">
            <div class="header-main">
              <h3>Stock Status Distribution</h3>
              <p class="card-subtitle">Visual representation of inventory health categories</p>
            </div>
          </div>

          <div class="chart-drawing-area"></div> 
        </section>
      </main>
    </div>
  
    `

  await renderSidebar()
  renderReportsNavbar('inventory_report')

  let invReportData = await getInvReportData('all', 'any', 'all')
  const catTempStorageData = await catStorageData()

  // Filtering logic
  const filterCategoriesElem = document.getElementById('filterCategories')
  const filterStorageTempElem = document.getElementById('filterStorageTemp')
  populateFilterCatTempOptions(catTempStorageData, filterCategoriesElem, filterStorageTempElem)

  // Clicking the filter button
  const filterStockStatusElem = document.getElementById('filterStockStatus')
  document.getElementById('applyInvFilterBtn')
    .addEventListener('click', async () => {
      invReportData = await getInvReportData(filterCategoriesElem.value,
        filterStorageTempElem.value,
        filterStockStatusElem.value
      )
      displayInvReport(invReportData)
    })

  displayInvReport(invReportData)

  // Display report data
  function displayInvReport(invReportData) {
    // Show Kpi data
    document.getElementById('totItemsMetric')
      .textContent = invReportData.kpi_metrics.total_unique_items
    document.getElementById('totUnitsMetric')
      .textContent = invReportData.kpi_metrics.total_stock_units
    document.getElementById('totInvMetric')
      .textContent = invReportData.kpi_metrics.total_inventory_value
    document.getElementById('belowMinMetric')
      .textContent = invReportData.kpi_metrics.low_stock_alerts

    // Populate the items table
    const invTbodyElem = document.getElementById('invTbody')
    const invTableFrag = document.createDocumentFragment()
    invReportData.inventory_table.forEach(item => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
      <td><strong class="item-name">${item.item_name}</strong></td>
      <td>${item.category}</td>
      <td> <span class="badge ${item.storage_temp}">${item.storage_temp}</span></td>
      <td class="text-right">${item.current_stock}</td>
      <td class="text-right">${item.min_level}</td>
      <td><span class="stock-badge badge-${item.stock_status.toLowerCase()}">${item.stock_status}</span></td>
      <td class="text-right">${item.unit_price}</td>
      <td class="text-right">${item.total_selling_units}</td>
      <td class="text-right tot-value">${item.total_value}</td>
    `

      invTableFrag.appendChild(tblRow)
    })
    invTbodyElem.innerHTML = ''
    invTbodyElem.appendChild(invTableFrag)

    // Form the Stock Distribution  bar chart by category
    const labels = invReportData.category_distribution_bar_chart.map(cat => cat.category)
    const dataValues = invReportData.category_distribution_bar_chart.map(cat => cat.current_stock)

    const barContainerElem = document.querySelector('.chart-placeholder')
    barContainerElem.innerHTML = `<canvas id="stockDistroBarChart"></canvas>`

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
    const statusLabels = invReportData.stock_status_pie_chart.map(status => status.status)
    const statusCounts = invReportData.stock_status_pie_chart.map(status => status.count)

    const pieContainerElem = document.querySelector('.chart-drawing-area')
    pieContainerElem.innerHTML = `<canvas id="stockStatusPieChart"></canvas>`

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
  }
})

// Populate the dropdown options
export function populateFilterCatTempOptions(catTempStorageData, filterCategoriesElem, 
  filterStorageTempElem
) {
  const filterCatFrag = document.createDocumentFragment()
  catTempStorageData.categories.forEach(cat => {
    const optElem = document.createElement('option')
    optElem.value = cat.id
    optElem.textContent = cat.name
    filterCatFrag.appendChild(optElem)
  })
  filterCategoriesElem.appendChild(filterCatFrag)

  const filterTempFrag = document.createDocumentFragment()
  catTempStorageData.storageTemps.forEach(tem => {
    const opt = document.createElement('option')
    opt.value = tem.code
    opt.textContent = `${tem.description} (${tem.temp_range})`
    filterTempFrag.appendChild(opt)
  })
  filterStorageTempElem.appendChild(filterTempFrag)
}

async function getInvReportData(cat, temp, stockStat) {
  const response = await fetch('http://localhost:3000/admin/invReportData',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cat, temp, stockStat })
    }
  )
  const res = await response.json()
  return (res.invReportData.inv_report_data)
}