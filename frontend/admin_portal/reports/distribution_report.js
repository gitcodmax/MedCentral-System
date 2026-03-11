import { adminPagesLink } from "../../global.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `   
    <div class="sidebar" id="sidebar"></div>

    <div class="main-wrapper">
      <header class="top-header" id="topHeader"></header>

      <div class="container">
        <header class="report-page-header">
          <div class="header-text">
            <h2>Distribution Report</h2>
            <p>Overview of warehouse delivery and distribution activities</p>
          </div>
        </header>

        <section class="kpi-grid">
          <div class="card kpi-card tot-deliv-card">
            <div class="kpi-content">
              <span class="kpi-label">Total Deliveries</span>
              <span class="kpi-value tot-deliveries-val" id="totDelivValue"></span>
            </div>
            <div class="kpi-icon bg-blue-lite">
              <i class="fas fa-truck-ramp-box"></i>
            </div>
          </div>
          <div class="card kpi-card deliv-card">
            <div class="kpi-content">
              <span class="kpi-label">Delivered</span>
              <span class="kpi-value teal-text" id="deliveredCount"></span>
            </div>
            <div class="kpi-icon bg-teal-lite">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
          </div>
          <div class="card kpi-card completed-card">
            <div class="kpi-content">
              <span class="kpi-label">Completed</span>
              <span class="kpi-value green-text" id="completedDeliv"></span>
            </div>
            <div class="kpi-icon bg-green-lite">
              <i class="fas fa-house-medical-circle-check"></i>
            </div>
          </div>
          <div class="card kpi-card delayed-deliv-card">
            <div class="kpi-content">
              <span class="kpi-label">Delayed Deliveries</span>
              <span class="kpi-value orange-text" id="delayedDeliv"></span>
            </div>
            <div class="kpi-icon bg-orange-lite">
              <i class="fas fa-clock-rotate-left"></i>
            </div>
          </div>
        </section>

        <section class="card filter-section">
          <div class="filter-row">
            <div class="filter-group">
              <label>From Date</label>
              <input type="date">
            </div>
            <div class="filter-group">
              <label>To Date</label>
              <input type="date">
            </div>
            <div class="filter-group">
              <label>Destination</label>
              <select>
                <option>All Hospitals</option>
                <option>City General</option>
                <option>St. Mary's Clinic</option>
                <option>Northwest Medical</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Status</label>
              <select>
                <option>All Statuses</option>
                <option>Dispatched</option>
                <option>Delayed</option>
                <option>Delivered</option>
                <option>Delivered w/ Issues</option>
                <option>Completed</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Search ID</label>
              <input type="text" placeholder="Order or Delivery ID...">
            </div>
            <button class="btn-apply">Apply Filters</button>
          </div>
        </section>


        <section class="card table-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Package ID</th>
                  <th>Order ID</th>
                  <th>Dispatch Date</th>
                  <th>Destination</th>
                  <th>Driver</th>
                  <th class="text-right">Total Units</th>
                  <th>Status</th>
                  <th class="text-right">Delivery Time</th>
                </tr>
              </thead>
              <tbody id="deliveriesTbody"></tbody>
            </table>
          </div>
        </section>


        <section class="charts-grid">
          <div class="card chart-card">
            <h3>Distribution Volume Over Time</h3>
            <div class="chart-placeholder">
              <canvas id="distroOverTimeLine"></canvas>
            </div>
          </div>

          <div class="card chart-card">
            <h3>Distribution by Destination</h3>
            <div class="chart-placeholder">
              <canvas id="destDistroBar"></canvas>
            </div>
          </div>
        </section>
      </div>
    </div>
    `

  renderSidebar()
  renderReportsNavbar('distribution_report')

  const distroReportData = await getDistroReportData()

  document.getElementById('totDelivValue')
    .textContent = distroReportData.kpi_metrics.total_deliveries
  document.getElementById('deliveredCount')
    .textContent = distroReportData.kpi_metrics.delivered_count
  document.getElementById('completedDeliv')
    .textContent = distroReportData.kpi_metrics.completed_count
  document.getElementById('delayedDeliv')
    .textContent = distroReportData.kpi_metrics.delayed_deliveries

  const deliveriesTblFrag = document.createDocumentFragment()
  distroReportData.deliveries_table.forEach(deliv => {
    const tblRow = document.createElement('tr')
    const delivStatusLower = deliv.status.toLowerCase()
    const delivStatusClass = delivStatusLower === 'delivered with issues' ? 'issues' : delivStatusLower
    const delivDate = !deliv.delivery_date ? '--' : new Date(deliv.delivery_date).toDateString()

    tblRow.innerHTML = `
      <td class="id">${deliv.delivery_id}</td>
      <td class="id pkg-id">${deliv.package_id}</td>
      <td class="id ord-id">${deliv.order_id}</td>
      <td>${new Date(deliv.dispatch_date).toDateString()}</td>
      <td>${deliv.destination}</td>
      <td>${deliv.driver}</td>
      <td class="text-right">${deliv.total_units}</td>
      <td><span class="distro-badge badge-${delivStatusClass}">${deliv.status}</span></td>
      <td class="text-right">${delivDate}</td>
    `

    deliveriesTblFrag.appendChild(tblRow)
  })
  document.getElementById('deliveriesTbody')
    .appendChild(deliveriesTblFrag)

  // Distro over time line chart
  const labels = distroReportData.volume_over_time_line_chart.map(deliv => deliv.date)
  const dataValues = distroReportData.volume_over_time_line_chart.map(deliv => deliv.deliveries)

  const distroTimeCtx = document.getElementById('distroOverTimeLine').getContext('2d')
  new Chart(distroTimeCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Deliveries',
        data: dataValues,
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#007BFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  })

  // Destination Distro Bar chart
  const destLabels = distroReportData.destination_distribution_bar_chart.map(dest => dest.destination)
  const destValues = distroReportData.destination_distribution_bar_chart.map(dest => dest.count)

  const destiDistroCtx = document.getElementById('destDistroBar').getContext('2d')
  new Chart(destiDistroCtx, {
    type: 'bar',
    data: {
      labels: destLabels,
      datasets: [{
        label: 'Total Units Distributed',
        data: destValues,
        backgroundColor: '#0D948822',
        borderColor: '#008B00',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 35
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
})

async function getDistroReportData(){
  const response = await fetch(`${adminPagesLink}/distroReportData`)
  const res = await response.json()
  return res.distroReportData.distro_report
}