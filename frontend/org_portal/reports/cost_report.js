import { renderReportsNavbar, renderSidebar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {

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
              <input type="date" id="from-date">
            </div>
            <div class="filter-group">
              <label for="to-date">To Date</label>
              <input type="date" id="to-date">
            </div>
            <div class="filter-group">
              <label for="category">Category</label>
              <select id="category">
                <option>All Categories</option>
                <option>Pharmaceuticals</option>
                <option>Surgical Supplies</option>
                <option>Laboratory</option>
                <option>Radiology</option>
              </select>
            </div>
            <div class="filter-actions">
              <button class="btn btn-apply">Apply Filters</button>
              <button class="btn btn-reset">Reset</button>
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
            <div class="kpi-value avg-mon-spend">$236,708.33</div>
          </div>

          <div class="kpi-card blue-card">
            <div class="kpi-header">
              <span class="kpi-label">Highest Category</span>
              <div class="kpi-icon icon-blue">
                <i class="fas fa-pills"></i>
              </div>
            </div>
            <div class="kpi-value highest-cat">Critical Care</div>
          </div>

          <div class="kpi-card green-card">
            <div class="kpi-header">
              <span class="kpi-label">Highest Cost Item</span>
              <div class="kpi-icon icon-green">
                <i class="fas fa-microscope"></i>
              </div>
            </div>
            <div class="kpi-value highest-cost-item">Pacemaker Gen-X</div>
          </div>
        </section>

        <section class="card chart-card">
          <h3 class="card-title">Monthly Expenditure Trend</h3>
          <div class="chart-main">
            <canvas id="monthlyExpenditureChart"></canvas>
          </div>
        </section>

        <div class="charts-row">
          <section class="card chart-card">
            <h3 class="card-title">Cost by Category</h3>
            <div class="chart-main chart-small">
              <canvas id="costByCategoryChart"></canvas>
            </div>
          </section>
          <section class="card chart-card">
            <h3 class="card-title">Top Cost Drivers</h3>
            <div class="chart-main chart-small">
              <canvas id="topCostItemsChart"></canvas>
            </div>
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
        </div>
      </div>
    </main>
  
    `

  renderSidebar()
  renderReportsNavbar()

  const MedCentralFinanceData = {
    summary: {
      totalExpenditure: 2840500.00,
      avgMonthlySpend: 236708.33,
      highestCostCategory: "Critical Care",
      highestCostItem: "Pacemaker Gen-X",
      currency: "USD"
    },

    expenditureTrend: {
      labels: ["Sept 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026"],
      values: [210000, 245000, 198000, 310000, 225000, 236708]
    },

    costByCategory: {
      labels: ["Pharmaceuticals", "Critical Care", "Surgical Supplies", "Laboratory", "PPE & Hygiene"],
      values: [850000, 1200000, 450000, 240500, 100000],
      colors: ["#007BFF", "#008B00", "#6C757D", "#17A2B8", "#FFC107"]
    },

    topCostItems: {
      labels: ["Pacemaker Gen-X", "MRI Contrast", "Titanium Hip", "Ventilator Circ.", "Dexamethasone"],
      values: [450000, 180000, 148800, 95000, 54000]
    },

    detailedBreakdown: [
      {
        id: "FIN-001",
        itemName: "Pacemaker Gen-X",
        category: "Critical Care",
        totalQuantity: 15,
        unitCost: 30000.00,
        totalCost: 450000.00,
        numOrders: 5
      },
      {
        id: "FIN-002",
        itemName: "Titanium Hip Implant",
        category: "Orthopedic",
        totalQuantity: 12,
        unitCost: 12400.00,
        totalCost: 148800.00,
        numOrders: 3
      },
      {
        id: "FIN-003",
        itemName: "Dexamethasone 4mg",
        category: "Pharmaceuticals",
        totalQuantity: 1200,
        unitCost: 45.00,
        totalCost: 54000.00,
        numOrders: 15
      },
      {
        id: "FIN-004",
        itemName: "N95 Respirators (Box 50)",
        category: "PPE",
        totalQuantity: 500,
        unitCost: 85.00,
        totalCost: 42500.00,
        numOrders: 22
      },
      {
        id: "FIN-005",
        itemName: "Saline 0.9% 500ml",
        category: "Fluids",
        totalQuantity: 5000,
        unitCost: 2.50,
        totalCost: 12500.00,
        numOrders: 45
      }
    ]
  };

  document.querySelector('.total-ex')
    .textContent = MedCentralFinanceData.summary.totalExpenditure
  document.querySelector('.avg-mon-spend')
    .textContent = MedCentralFinanceData.summary.avgMonthlySpend
  document.querySelector('.highest-cat')
    .textContent = MedCentralFinanceData.summary.highestCostCategory
  document.querySelector('.highest-cost-item')
    .textContent = MedCentralFinanceData.summary.highestCostItem
  
  // Monthly Expenditure Chart
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
      plugins: {legend: {display:false}}
    }
  })

  // Cost by Category chart
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
        legend: {position: 'bottom', labels: {boxWidth: 12, padding: 20}}
      }, 
      cutout: '70%'
    }
  })

  // Top cost items
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
      plugins: {legend: {display: false}}
    }
  })

  const detailedCostsTblFrag = document.createDocumentFragment()

  MedCentralFinanceData.detailedBreakdown.forEach(item => {
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

  document.getElementById('detailedCostsTbody')
    .appendChild(detailedCostsTblFrag)
})