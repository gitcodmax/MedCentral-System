import { orgPortalPagesLink } from "../../global.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
      
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <nav class="report-tabs js-report-tabs"></nav>

      <div class="page-content">
        <header class="header">
          <div class="header-content">
            <h1>Item Consumption Report</h1>
            <p>Analyze usage trends and plan inventory efficiently</p>
          </div>
        </header>

        <section class="card filter-card">
          <div class="filter-header">
              <h2 class="filter-title"><i class="fas fa-sliders-h"></i> Report Filters</h2>
              <span class="filter-subtitle">Analyze consumption by custom date range and department category</span>
          </div>
          
          <div class="filters-grid">
              <div class="filter-group">
                  <label for="start-date">From Date</label>
                  <div class="input-with-icon">
                      <i class="far fa-calendar-alt"></i>
                      <input type="date" id="start-date" class="filter-input">
                  </div>
              </div>
      
              <div class="filter-group">
                  <label for="end-date">To Date</label>
                  <div class="input-with-icon">
                      <i class="far fa-calendar-alt"></i>
                      <input type="date" id="end-date" class="filter-input">
                  </div>
              </div>
      
              <div class="filter-group">
                  <label for="category-filter">Category</label>
                  <div class="input-with-icon">
                      <i class="fas fa-tags"></i>
                      <select id="category-filter" class="filter-input">
                          <option value="all">All Categories</option>
                          <option value="PPE">PPE</option>
                          <option value="Surgical">Surgical</option>
                          <option value="Pharma">Pharmaceuticals</option>
                          <option value="Fluids">Medical Fluids</option>
                          <option value="Wound Care">Wound Care</option>
                      </select>
                  </div>
              </div>
      
              <div class="filter-actions">
                  <button class="btn btn-apply-filters" id="btn-apply">
                      Apply Filters
                  </button>
                  <button class="btn btn-reset" id="btn-reset">
                      Reset
                  </button>
              </div>
          </div>
      </section>

        <section class="kpi-grid">
          <div class="kpi-card total-items-kpi">
            <div class="kpi-content">
              <span class="kpi-label">Total Items Consumed</span>
              <div class="kpi-value js-total-items-kpi"></div>
            </div>
            <div class="kpi-icon-wrapper blue">
              <i data-lucide="package-check"></i>
            </div>
          </div>

          <div class="kpi-card tot-cat-kpi">
            <div class="kpi-content">
              <span class="kpi-label">Total Categories</span>
              <div class="kpi-value js-total-cat-kpi"></div>
            </div>
            <div class="kpi-icon-wrapper green">
              <i data-lucide="layers"></i>
            </div>
          </div>

          <div class="kpi-card most-cons-kpi">
            <div class="kpi-content">
              <span class="kpi-label">Most Consumed Item</span>
              <div class="kpi-value js-most-consum-kpi"></div>
            </div>
            <div class="kpi-icon-wrapper purple">
              <i data-lucide="trending-up"></i>
            </div>
          </div>

          <div class="kpi-card avg-cons-kpi">
            <div class="kpi-content">
              <span class="kpi-label">Avg. Monthly Consumption</span>
              <div class="kpi-value js-avg-consum-kpi"></div>
            </div>
            <div class="kpi-icon-wrapper orange">
              <i data-lucide="calendar"></i>
            </div>
          </div>
        </section>

        <div class="charts-container">
          <section class="card chart-card">
            <h2 class="section-title">Consumption Trend Over Time</h2>
            <div class="chart-placeholder">
              <canvas id="consumptionTrendChart"></canvas>
            </div>
          </section>
          <section class="card chart-card">
            <h2 class="section-title">Top 10 Most Consumed Categories</h2>
            <div class="chart-placeholder">
              <canvas id="topCategoriesChart"></canvas>
            </div>
          </section>
        </div>

        <section class="card table-card">
          <h2 class="section-title">Detailed Item Consumption</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Total Qty</th>
                  <th>Unit</th>
                  <th>Orders</th>
                  <th>Last Ordered</th>
                </tr>
              </thead>
              <tbody id="rankedItemsTbody"></tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  
    `

  renderSidebar('reports')
  renderReportsNavbar()
  lucide.createIcons();

  // ==============================
  // ==============================
  // ==============================
  const hosId = 1
  // ==============================
  // ==============================
  // ==============================

  const reportData = await getItemConsumptionReportData(hosId)

  // Set up the kpi summary details
  document.querySelector('.js-total-items-kpi')
    .textContent = reportData.summary.totalItems
  document.querySelector('.js-total-cat-kpi')
    .textContent = reportData.summary.totalCategories
  document.querySelector('.js-most-consum-kpi')
    .textContent = reportData.summary.mostConsumed
  document.querySelector('.js-avg-consum-kpi')
    .textContent = reportData.summary.avgMonthly

  // Consumption trend chart
  const trendCtx = document.getElementById('consumptionTrendChart').getContext('2d')
  new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: reportData.trends.labels,
      datasets: [{
        label: 'Consumption',
        data: reportData.trends.values,
        borderColor: '#007BFF',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })

  // Top Categories Chart
  const barCtx = document.getElementById('topCategoriesChart').getContext('2d')
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: reportData.categories.labels,
      datasets: [{
        label: 'Quantity',
        data: reportData.categories.values,
        backgroundColor: '#008B00',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  })

  // Render the table data in the ranked table
  const rankedTblFrag = document.createDocumentFragment()
  reportData.tableData.forEach(item => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td><span class="badge">${item.cat}</span></td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td>${item.orders}</td>
      <td>${item.last}</td>
    `

    rankedTblFrag.appendChild(tblRow)
  })

  document.getElementById('rankedItemsTbody')
    .appendChild(rankedTblFrag)
})

const getItemConsumptionReportData = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getItemConsumptionReportData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hosId })
    }
  )

  const res = await response.json()
  return res.itemConsumptionData.report_data
}