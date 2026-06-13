import { toggleNoMatchFound } from "../../admin_portal/reports/distribution_report.js"
import { displayNoMatchFound, orgPortalPagesLink } from "../../global.js"
import { orgReportsFilCat } from "../../wh_manager/standards.js"
import { hosId } from "../dash.js"
import { getHospDept } from "../request_items/order_summary.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"
import { setupFilters } from "./cost_report.js"

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
                      <input type="date" id="filStartDate" class="filter-input">
                  </div>
              </div>
      
              <div class="filter-group">
                  <label for="end-date">To Date</label>
                  <div class="input-with-icon">
                      <i class="far fa-calendar-alt"></i>
                      <input type="date" id="filEndDate" class="filter-input">
                  </div>
              </div>
      
              <div class="filter-group">
                  <label for="category-filter">Category</label>
                  <div class="input-with-icon">
                      <i class="fas fa-tags"></i>
                      <select id="selectCatFil" class="filter-input"></select>
                  </div>
              </div>

              <div class="filter-group">
                  <label for="dept-filter">Department</label>
                  <div class="input-with-icon">
                      <i class="fas fa-tags"></i>
                      <select id="selectDptFil" class="filter-input"></select>
                  </div>
              </div>
      
              <div class="filter-actions">
                  <button class="btn btn-apply-filters" id="btnApplyFil">
                      Apply Filters
                  </button>
                  <button class="btn btn-reset" id="btnResetFil">
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

          <div class="kpi-card dept-cons-kpi">
            <div class="kpi-content">
              <span class="kpi-label">Highest Dept Consumption</span>
              <div class="kpi-value js-dept-consum-kpi"></div>
            </div>
            <div class="kpi-icon-wrapper dept-i-col">
              <i data-lucide="hospital"></i>
            </div>
          </div>
        </section>

        <div class="consumption-trend-charts-container">
          <section class="card chart-card">
            <h2 class="section-title">Consumption Trend Over Time</h2>
            <div class="chart-placeholder" id="lineCrtHolder"></div>
          </section>
        </div>

        <div class="charts-container">
          <section class="card chart-card">
            <h3 class="card-title">Department Consumption</h3>
            <div class="chart-main chart-small" id="duoghnutCrtHolder"></div>
          </section>
          <section class="card chart-card">
            <h2 class="section-title">Top 10 Most Consumed Categories</h2>
            <div class="chart-placeholder" id="barCrtHolder"></div>
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
            <div class="no-match-container js-no-match-found hidden"></div>
          </div>
        </section>
      </div>
    </main>
  
    `

  renderSidebar('reports')
  renderReportsNavbar()
  lucide.createIcons();
  displayNoMatchFound()

  const reportData = await getItemConsumptionReportData(hosId, null, null, 'all', 'all')
  const hosDepts = await getHospDept(hosId)
  const itmCategories = await orgReportsFilCat()
  const noMatchFoundElem = document.querySelector('.js-no-match-found')

  populateDeptCatFil(hosDepts, itmCategories)
  setupFilters(hosId, {
    fetchData: getItemConsumptionReportData,
    displayReport: displayItemConsumptionReport,
    initialData: reportData
  })

  displayItemConsumptionReport(reportData)

  function displayItemConsumptionReport(reportData) {
    // Set up the kpi summary details
    document.querySelector('.js-total-items-kpi')
      .textContent = reportData.summary.totalItems
    document.querySelector('.js-total-cat-kpi')
      .textContent = reportData.summary.totalCategories
    document.querySelector('.js-most-consum-kpi')
      .textContent = reportData.summary.mostConsumed
    document.querySelector('.js-avg-consum-kpi')
      .textContent = reportData.summary.avgMonthly
    document.querySelector('.js-dept-consum-kpi')
      .textContent = reportData.summary.deptConsName

    // Consumption trend chart
    document.getElementById('lineCrtHolder')
      .innerHTML = `<canvas id="consumptionTrendChart"></canvas>`

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

    // Department Consumption Doughnut
    document.getElementById('duoghnutCrtHolder')
      .innerHTML = `<canvas id="deptConsumptionChart"></canvas>`
    const deptConsCrt = document.getElementById('deptConsumptionChart').getContext('2d')
    new Chart(deptConsCrt, {
      type: 'doughnut',
      data: {
        labels: reportData.deptConsumption.labels,
        datasets: [{
          data: reportData.deptConsumption.values,
          hoverOffset: 10,
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false
      }
    })

    // Top Categories Chart
    document.getElementById('barCrtHolder')
      .innerHTML = `<canvas id="topCategoriesChart"></canvas>`
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
    const rankedItemsTbodyElem = document.getElementById('rankedItemsTbody')
    rankedItemsTbodyElem.innerHTML = ''
    const rankedTblFrag = document.createDocumentFragment()
    reportData.tableData?.forEach(item => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td><span class="badge-cat-r">${item.cat}</span></td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td>${item.orders}</td>
      <td>${item.last}</td>
    `

      rankedTblFrag.appendChild(tblRow)
    })

    rankedItemsTbodyElem.appendChild(rankedTblFrag)
    toggleNoMatchFound(reportData.tableData, noMatchFoundElem)
  }
})

const getItemConsumptionReportData = async (hosId, startDate, endDate,
  itemCatId, deptId) => {
  const response = await fetch(`${orgPortalPagesLink}/getItemConsumptionReportData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hosId, startDate, endDate,
        itemCatId, deptId
      }
      )
    }
  )

  const res = await response.json()
  return res.itemConsumptionData.report_data
}
// Populate the options for the filter in categories and department
export function populateDeptCatFil(hosDepts, itmCategories) {
  // Set filter department options
  const selectDptFilElem = document.getElementById('selectDptFil')
  selectDptFilElem.innerHTML = ''
  selectDptFilElem.innerHTML = '<option value="all">All Departments</option>'
  const filDeptFrag = document.createDocumentFragment()
  hosDepts.forEach(dpt => {
    const opt = document.createElement('option')
    opt.value = dpt.id
    opt.textContent = dpt.name
    filDeptFrag.appendChild(opt)
  })
  selectDptFilElem.appendChild(filDeptFrag)

  // Set filter categories options
  const selectCatFilElem = document.getElementById('selectCatFil')
  selectCatFilElem.innerHTML = ''
  selectCatFilElem.innerHTML = '<option value="all">All Categories</option>'
  const filCatFrag = document.createDocumentFragment()
  itmCategories.forEach(cat => {
    const opt = document.createElement('option')
    opt.value = cat.id
    opt.textContent = cat.name
    filCatFrag.appendChild(opt)
  })
  selectCatFilElem.appendChild(filCatFrag)
}