import { toggleNoMatchFound } from "../../admin_portal/reports/distribution_report.js"
import { displayNoMatchFound, orgPortalPagesLink } from "../../global.js"
import { orgReportsFilCat } from "../../wh_manager/standards.js"
import { hosId } from "../dash.js"
import { getHospDept } from "../request_items/order_summary.js"
import { renderReportsNavbar, renderSidebar } from "../sidebar.js"
import { populateDeptCatFil } from "./item_consumption.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
      
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <nav class="report-tabs js-report-tabs"></nav>

      <div class="page-content">
        <header class="page-header">
          <h1>Financial Report</h1>
          <p>Monitor expenditure, costs, and budget trends</p>
        </header>

        <section class="card">
          <div class="filters-grid">
            <div class="filter-group">
              <label for="from-date">From Date</label>
              <input type="date" id="filStartDate">
            </div>
            <div class="filter-group">
              <label for="to-date">To Date</label>
              <input type="date" id="filEndDate">
            </div>
            <div class="filter-group">
              <label for="category">Category</label>
                <select id="selectCatFil"></select>
            </div>
            <div class="filter-group">
              <label for="department">Department</label>
                <select id="selectDptFil"></select>
            </div>
            <div class="filter-actions">
              <button class="btn btn-apply" id="btnApplyFil">Apply Filters</button>
              <button class="btn btn-reset" id="btnResetFil">Reset</button>
            </div>
          </div>
        </section>

        <section class="kpi-container">
          <div class="kpi-card blue-card">
            <div class="kpi-header">
              <span class="kpi-label">Total Expenditure</span>
              <div class="kpi-icon icon-blue">
                <i class="fas fa-wallet"></i>
              </div>
            </div>
            <div class="kpi-value total-ex"></div>
          </div>

          <div class="kpi-card green-card">
            <div class="kpi-header">
              <span class="kpi-label">Avg. Monthly Spend</span>
              <div class="kpi-icon icon-green">
                <i class="fas fa-chart-line"></i>
              </div>
            </div>
            <div class="kpi-value avg-mon-spend"></div>
          </div>

          <div class="kpi-card blue-card">
            <div class="kpi-header">
              <span class="kpi-label">Highest Category</span>
              <div class="kpi-icon icon-blue">
                <i class="fas fa-pills"></i>
              </div>
            </div>
            <div class="kpi-value highest-cat"></div>
          </div>

          <div class="kpi-card green-card">
            <div class="kpi-header">
              <span class="kpi-label">Highest Cost Item</span>
              <div class="kpi-icon icon-green">
                <i class="fas fa-microscope"></i>
              </div>
            </div>
            <div class="kpi-value highest-cost-item"></div>
          </div>

          <div class="kpi-card blue-card">
            <div class="kpi-header">
              <span class="kpi-label">Highest Cost Department</span>
              <div class="kpi-icon icon-blue">
                <i class="fa-solid fa-building"></i>
              </div>
            </div>
            <div class="kpi-value highest-dept"></div>
          </div>
        </section>

        <div class="charts-row">
          <section class="card chart-card">
            <h3 class="card-title">Monthly Expenditure Trend</h3>
            <div class="chart-main" id="monExpCrtHolder"></div>
          </section>
          <section class="card chart-card">
            <h3 class="card-title">Cost by Department</h3>
            <div class="chart-main chart-small" id="costDptCrtHolder"></div>
          </section>
        </div>

        <div class="charts-row">
          <section class="card chart-card">
            <h3 class="card-title">Cost by Category</h3>
            <div class="chart-main chart-small" id="costCatCrtHolder"></div>
          </section>
          <section class="card chart-card">
            <h3 class="card-title">Top Cost Drivers</h3>
            <div class="chart-main chart-small" id="topCostCrtHolder"></div>
          </section>
        </div>

        <h3 class="table-section-title">Detailed Financial Breakdown</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Total Qty Ordered</th>
                <th>Total Cost</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody id="detailedCostsTbody"></tbody>
          </table>
          <div class="no-match-container js-no-match-found hidden"></div>
        </div>
      </div>
    </main>
  
    `

  renderSidebar('reports')
  renderReportsNavbar()
  displayNoMatchFound()

  const MedCentralFinanceData = await getFinanceData(hosId, null, null, 'all', 'all')
  const hosDepts = await getHospDept(hosId)
  const itmCategories = await orgReportsFilCat()
  const noMatchFoundElem = document.querySelector('.js-no-match-found')

  populateDeptCatFil(hosDepts, itmCategories)
  setupFilters(hosId, {
    fetchData: getFinanceData,
    displayReport: displayFinanceReport,
    initialData: MedCentralFinanceData
  })

  displayFinanceReport(MedCentralFinanceData)

  function displayFinanceReport(MedCentralFinanceData) {
    document.querySelector('.total-ex')
      .textContent = MedCentralFinanceData.summary.totalExpenditure
    document.querySelector('.avg-mon-spend')
      .textContent = MedCentralFinanceData.summary.avgMonthlySpend
    document.querySelector('.highest-cat')
      .textContent = MedCentralFinanceData.summary.highestCostCategory
    document.querySelector('.highest-cost-item')
      .textContent = MedCentralFinanceData.summary.highestCostItem
    document.querySelector('.highest-dept')
      .textContent = MedCentralFinanceData.summary.highestCostDept

    // Monthly Expenditure Chart
    document.getElementById('monExpCrtHolder')
      .innerHTML = `<canvas id="monthlyExpenditureChart"></canvas>`
    const monSpendCtx = document.getElementById('monthlyExpenditureChart').getContext('2d')
    new Chart(monSpendCtx, {
      type: 'line',
      data: {
        labels: MedCentralFinanceData.expenditureTrend.labels,
        datasets: [{
          label: 'Monthly Spend ($)',
          data: MedCentralFinanceData.expenditureTrend.values,
          borderColor: '#007BFF',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    })

    // Cost by department chart
    document.getElementById('costDptCrtHolder')
      .innerHTML = `<canvas id="costByDepartmentChart"></canvas>`
    const dptCostCrt = document.getElementById('costByDepartmentChart').getContext('2d')
    new Chart(dptCostCrt, {
      type: 'doughnut',
      data: {
        labels: MedCentralFinanceData.costByDepartment.labels,
        datasets: [{
          data: MedCentralFinanceData.costByDepartment.values,
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true
      }
    })

    // Cost by Category chart
    document.getElementById('costCatCrtHolder')
      .innerHTML = `<canvas id="costByCategoryChart"></canvas>`
    const catCostCtx = document.getElementById('costByCategoryChart').getContext('2d')
    new Chart(catCostCtx, {
      type: 'doughnut',
      data: {
        labels: MedCentralFinanceData.costByCategory.labels,
        datasets: [{
          data: MedCentralFinanceData.costByCategory.values,
          backgroundColor: MedCentralFinanceData.costByCategory.colors,
          hoverOffset: 10,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20 } }
        },
        cutout: '70%'
      }
    })

    // Top cost items
    document.getElementById('topCostCrtHolder')
      .innerHTML = `<canvas id="topCostItemsChart"></canvas>`
    const topCostCtx = document.getElementById('topCostItemsChart').getContext('2d')
    new Chart(topCostCtx, {
      type: 'bar',
      data: {
        labels: MedCentralFinanceData.topCostItems.labels,
        datasets: [{
          label: 'Total Cost ($)',
          data: MedCentralFinanceData.topCostItems.values,
          backgroundColor: '#008B00',
          borderRadius: 6,
          barThickness: 30
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    })

    const detailedCostsTbodyElem = document.getElementById('detailedCostsTbody')
    detailedCostsTbodyElem.innerHTML = ''
    const detailedCostsTblFrag = document.createDocumentFragment()
    MedCentralFinanceData.detailedBreakdown?.forEach(item => {
      const tblRow = document.createElement('tr')

      tblRow.innerHTML = `
      <td>${item.itemName}</td>
      <td>${item.category}</td>
      <td>${item.totalQuantity}</td>
      <td class="amount">${item.totalCost}</td>
      <td>${item.numOrders}</td>
    `

      detailedCostsTblFrag.appendChild(tblRow)
    })

    detailedCostsTbodyElem.appendChild(detailedCostsTblFrag)
    toggleNoMatchFound(MedCentralFinanceData.detailedBreakdown, noMatchFoundElem)
  }
})

const getFinanceData = async (hosId, startDate, endDate,
  itemCatId, deptId) => {
  const response = await fetch(`${orgPortalPagesLink}/getFinancialReportData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hosId, startDate, endDate,
        itemCatId, deptId
      })
    }
  )

  const res = await response.json()
  return res.finance_payload
}

// Filtering logic for item consumption and finance report
export function setupFilters(hosId, { fetchData, displayReport, initialData }) {
  const filStartDateElem = document.getElementById('filStartDate')
  const filEndDateElem = document.getElementById('filEndDate')
  const filItmCatElem = document.getElementById('selectCatFil')
  const filDptElem = document.getElementById('selectDptFil')

  document.getElementById('btnApplyFil')
    .addEventListener('click', async () => {
      const filStartDateVal = filStartDateElem.value
      const filEndDateVal = filEndDateElem.value || null

      if (!filStartDateVal && filEndDateVal) {
        alert('Enter the start date!!')
        return
      }

      const data = await fetchData(hosId, filStartDateVal, filEndDateVal,
        filItmCatElem.value, filDptElem.value)
      displayReport(data)
    })

  document.getElementById('btnResetFil')
    .addEventListener('click', () => {
      filStartDateElem.value = ''
      filEndDateElem.value = ''
      filItmCatElem.value = 'all'
      filDptElem.value = 'all'
      displayReport(initialData)
    })
}