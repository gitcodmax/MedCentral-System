import { renderSidebar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="reports-button-group">

      <a href="/reports/inventory" class="nav-btn">
        <span class="icon bg-blue-lite"><i class="fas fa-boxes"></i></span>
        <span class="label">Inventory Report</span>
      </a>

      <a href="/reports/low-stock" class="nav-btn">
        <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
        <span class="label">Low Stock</span>
      </a>

      <a href="/reports/distribution" class="nav-btn active">
        <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
        <span class="label">Distribution</span>
      </a>

    </div>
  `

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