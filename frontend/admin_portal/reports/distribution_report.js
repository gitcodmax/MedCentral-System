import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {

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

  const DistroReportMockData = {
    "kpi_metrics": {
      "total_deliveries": 1428,
      "delivered_count": 1240,
      "completed_count": 1185,
      "delayed_deliveries": 14
    },
    "deliveries_table": [
      {
        "delivery_id": "DLV-8821",
        "package_id": "PKG-440",
        "order_id": "ORD-901",
        "dispatch_date": "2026-02-28",
        "destination": "City General Hospital",
        "driver": "John Doe",
        "total_units": 450,
        "status": "Dispatched",
        "delivery_date": "2026-03-01"
      },
      {
        "delivery_id": "DLV-8819",
        "package_id": "PKG-438",
        "order_id": "ORD-898",
        "dispatch_date": "2026-02-27",
        "destination": "St. Mary's Clinic",
        "driver": "Sarah Smith",
        "total_units": 120,
        "status": "Completed",
        "delivery_date": "2026-02-28"
      },
      {
        "delivery_id": "DLV-8815",
        "package_id": "PKG-432",
        "order_id": "ORD-892",
        "dispatch_date": "2026-02-27",
        "destination": "Northwest Medical",
        "driver": "Mike Ross",
        "total_units": 85,
        "status": "Delayed",
        "delivery_date": "2026-03-02"
      },
      {
        "delivery_id": "DLV-8810",
        "package_id": "PKG-425",
        "order_id": "ORD-885",
        "dispatch_date": "2026-02-26",
        "destination": "Eastside Pediatrics",
        "driver": "John Doe",
        "total_units": 300,
        "status": "Delivered",
        "delivery_date": "2026-02-27"
      },
      {
        "delivery_id": "DLV-8825",
        "package_id": "PKG-445",
        "order_id": "ORD-905",
        "dispatch_date": "2026-03-01",
        "destination": "Central Pharmacy",
        "driver": "Jane Wilson",
        "total_units": 600,
        "status": "Delivered with issues",
        "delivery_date": "2026-03-01"
      },
      {
        "delivery_id": "DLV-8821",
        "package_id": "PKG-440",
        "order_id": "ORD-901",
        "dispatch_date": "2026-02-28",
        "destination": "City General Hospital",
        "driver": "John Doe",
        "total_units": 450,
        "status": "Dispatched",
        "delivery_date": null
      }
    ],
    "volume_over_time_line_chart": [
      { "date": "2026-02-22", "deliveries": 145 },
      { "date": "2026-02-23", "deliveries": 162 },
      { "date": "2026-02-24", "deliveries": 158 },
      { "date": "2026-02-25", "deliveries": 190 },
      { "date": "2026-02-26", "deliveries": 175 },
      { "date": "2026-02-27", "deliveries": 210 },
      { "date": "2026-02-28", "deliveries": 188 }
    ],
    "destination_distribution_bar_chart": [
      { "destination": "City General", "count": 450 },
      { "destination": "St. Mary's", "count": 320 },
      { "destination": "Northwest Medical", "count": 280 },
      { "destination": "Eastside Peds", "count": 150 },
      { "destination": "Central Pharmacy", "count": 228 }
    ]
  }

  document.getElementById('totDelivValue')
    .textContent = DistroReportMockData.kpi_metrics.total_deliveries
  document.getElementById('deliveredCount')
    .textContent = DistroReportMockData.kpi_metrics.delivered_count
  document.getElementById('completedDeliv')
    .textContent = DistroReportMockData.kpi_metrics.completed_count
  document.getElementById('delayedDeliv')
    .textContent = DistroReportMockData.kpi_metrics.delayed_deliveries

  const deliveriesTblFrag = document.createDocumentFragment()
  DistroReportMockData.deliveries_table.forEach(deliv => {
    const tblRow = document.createElement('tr')
    const delivStatusLower = deliv.status.toLowerCase()
    const delivStatusClass = delivStatusLower === 'delivered with issues' ? 'issues' : delivStatusLower
    const delivDate = !deliv.delivery_date ? '--' : deliv.delivery_date

    tblRow.innerHTML = `
      <td class="id">${deliv.delivery_id}</td>
      <td class="id pkg-id">${deliv.package_id}</td>
      <td class="id ord-id">${deliv.order_id}</td>
      <td>${deliv.dispatch_date}</td>
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
  const labels = DistroReportMockData.volume_over_time_line_chart.map(deliv => deliv.date)
  const dataValues = DistroReportMockData.volume_over_time_line_chart.map(deliv => deliv.deliveries)

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
  const destLabels = DistroReportMockData.destination_distribution_bar_chart.map(dest => dest.destination)
  const destValues = DistroReportMockData.destination_distribution_bar_chart.map(dest => dest.count)

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