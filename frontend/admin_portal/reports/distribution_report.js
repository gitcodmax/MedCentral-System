import { adminPagesLink } from "../../global.js"
import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `   
    <div class="sidebar" id="sidebar"></div>

    <main class="main-wrapper">
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
              <span class="kpi-label">Total Dispatches</span>
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

            <div class="date-filter-container">
              <div class="select-date-container">
                <label>Filter By</label>
                  <div class="fil-date-cont" >
                    Dispatch Date
                  </div>
              </div>
              <div class="dates-filter-groups hidden" id="dispFilGrp">
                <div class="filter-group">
                  <label>From Date</label>
                  <input type="date" id="dispFromDate">
                </div>
                <div class="filter-group">
                  <label>To Date</label>
                  <input type="date" id="dispToDate">
                </div>
              </div>
            </div>

            <div class="date-filter-container">
              <div class="select-date-container">
                <label>Filter By</label>
                <div class="fil-date-cont" id="delivDateFil">
                  Delivery Date
                </div> 
              </div>
              <div class="dates-filter-groups hidden" id="delivFilGrp">
                <div class="filter-group">
                  <label>From Date</label>
                  <input type="date" id="delivFromDate">
                </div>
                <div class="filter-group">
                  <label>To Date</label>
                  <input type="date" id="delivToDate">
                </div>
              </div>
            </div>

            <div class="filter-group dest-stat-group">
              <label>Destination</label>
              <select id="filterHospitals">
                <option value="all">All Hospitals</option>
              </select>
            </div>
            <div class="filter-group dest-stat-group">
              <label>Status</label>
              <select id="filterStatus">
                <option value="all">All Statuses</option>
                <option value=6>Dispatched</option>
                <option value=7>Delayed</option>
                <option value=8>Delivered</option>
                <option value=9>Delivered w/ Issues</option>
                <option value=10>Completed</option>
              </select>
            </div>
            <button class="btn-apply" id="applyDistroFiltersBtn">Apply Filters</button>
          </div>
        </section>


        <section class="card table-card">
            <div class="search-filter-group">
              <label>Search ID:</label>
              <input type="text" id="distroTblSearch" placeholder="Order or Delivery ID...">
            </div>
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
            <div id="distroOverTimeChart"></div>
          </div>

          <div class="card chart-card">
            <h3>Distribution by Destination</h3>
            <div id="destDistroChart"></div>
          </div>
        </section>
      </div>
    </main>
    `

  await renderSidebar()
  renderReportsNavbar('distribution_report')

  // Opening and closing the container to display the date filters
  const delivFiltersGrpElem = document.getElementById('delivFilGrp')
  const dispFiltersGrpElem = document.getElementById('dispFilGrp')
  document.querySelectorAll('.fil-date-cont')
    .forEach(elem => {
      elem.addEventListener('click', () => {
        elem.classList.toggle('selected-date')

        if (elem.classList.contains('selected-date')) {
          if (elem.id === 'delivDateFil') {
            delivFiltersGrpElem.classList.remove('hidden')
          } else {
            dispFiltersGrpElem.classList.remove('hidden')
          }
        } else {
          if (elem.id === 'delivDateFil') {
            delivFiltersGrpElem.classList.add('hidden')
            delivFiltersGrpElem.querySelectorAll('input')
              .forEach(inputElem => inputElem.value = '')
          } else {
            dispFiltersGrpElem.classList.add('hidden')
            dispFiltersGrpElem.querySelectorAll('input')
              .forEach(inputElem => inputElem.value = '')
          }
        }
      })
    })

  // Populate hospitals as options in the filter dropdown
  const hosIdData = await getHosIdData()
  const filterHosSelectElem = document.getElementById('filterHospitals')
  const hospOptionsFrag = document.createDocumentFragment()
  hosIdData.forEach(hos => {
    const opt = document.createElement('option')
    opt.value = hos.hospital_id
    opt.textContent = hos.full_name
    hospOptionsFrag.appendChild(opt)
  })
  filterHosSelectElem.appendChild(hospOptionsFrag)

  let distroReportData = await getDistroReportData(null, null, null, null, 'all', 'all')

  // Get input from text box and return required value
  const getDispDelivDates = (dateString) => {
    const dateInputElem = document.getElementById(dateString)
    const dateRes = dateInputElem.value === '' ? null : dateInputElem.value
    return dateRes
  }

  // Apply filters button
  document.getElementById('applyDistroFiltersBtn')
    .addEventListener('click', async () => {
      const dispFromDate = getDispDelivDates('dispFromDate')
      const dispToDate = getDispDelivDates('dispToDate')
      const delivFromDate = getDispDelivDates('delivFromDate')
      const delivToDate = getDispDelivDates('delivToDate')
      const filterStatusElem = document.getElementById('filterStatus')
      if (dispToDate && !dispFromDate) alert('Choose the dispatch start date!')
      if (delivToDate && !delivFromDate) alert('Choose the delivery start date!')
      
      distroReportData = await getDistroReportData(dispFromDate, dispToDate, delivFromDate, delivToDate,
        filterHosSelectElem.value, filterStatusElem.value)
      displayDeliveriesTbl(distroReportData.deliveries_table)
      displayDistroKpiCharts(distroReportData)
    })

  // Search logic for the deliveries/distro table
  const distroTblSearchElem = document.getElementById('distroTblSearch')
  distroTblSearchElem.addEventListener('keyup', () => {
    const searchVal = distroTblSearchElem.value.toLowerCase().trim()

    const searchRes = distroReportData.deliveries_table.filter(del => {
      const delivIdRes = del.delivery_id.toLowerCase().includes(searchVal)
      const pkgIdRes = del.package_id?.toLowerCase().includes(searchVal)
      const ordIdRes = del.order_id.toLowerCase().includes(searchVal)

      return delivIdRes || pkgIdRes || ordIdRes
    })

    displayDeliveriesTbl(searchRes)
  })

  displayDistroKpiCharts(distroReportData)
  displayDeliveriesTbl(distroReportData.deliveries_table)

  // Populate the rows for the distribution report table
  function displayDeliveriesTbl(distroData) {
    const deliveriesTbodyElem = document.getElementById('deliveriesTbody')
    deliveriesTbodyElem.innerHTML = ``
    const deliveriesTblFrag = document.createDocumentFragment()
    distroData?.forEach(deliv => {
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
    deliveriesTbodyElem.appendChild(deliveriesTblFrag)
  }

  function displayDistroKpiCharts(distroData) {
    document.getElementById('totDelivValue')
      .textContent = distroData.kpi_metrics.total_deliveries
    document.getElementById('deliveredCount')
      .textContent = distroData.kpi_metrics.delivered_count
    document.getElementById('completedDeliv')
      .textContent = distroData.kpi_metrics.completed_count
    document.getElementById('delayedDeliv')
      .textContent = distroData.kpi_metrics.delayed_deliveries

    // Distro over time line chart
    const labels = distroData.volume_over_time_line_chart.map(deliv => deliv.date)
    const dataValues = distroData.volume_over_time_line_chart.map(deliv => deliv.deliveries)

    document.getElementById('distroOverTimeChart')
      .innerHTML = `<canvas id="distroOverTimeLine"></canvas>`

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
    const destLabels = distroData.destination_distribution_bar_chart.map(dest => dest.destination)
    const destValues = distroData.destination_distribution_bar_chart.map(dest => dest.count)

    document.getElementById('destDistroChart')
      .innerHTML = `<canvas id="destDistroBar"></canvas>`

    const destiDistroCtx = document.getElementById('destDistroBar').getContext('2d')
    new Chart(destiDistroCtx, {
      type: 'bar',
      data: {
        labels: destLabels,
        datasets: [{
          label: 'Total Packages Distributed',
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
  }
})

async function getDistroReportData(dispFromDate, dispToDate,
  delivFromDate, delivToDate, hosId, statusId
) {
  const response = await fetch(`${adminPagesLink}/distroReportData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dispFromDate, dispToDate,
        delivFromDate, delivToDate, hosId, statusId
      }
      )
    }
  )
  const res = await response.json()
  return res.distroReportData.distro_report
}

// Used in the filter options
async function getHosIdData() {
  const response = await fetch(`${adminPagesLink}/getHosIdName`)
  const res = await response.json()
  return res
}