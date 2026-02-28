import { renderSidebar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
        <div class="reports-button-group">

          <a href="/reports/inventory" class="nav-btn active">
            <span class="icon bg-blue-lite"><i class="fas fa-boxes"></i></span>
            <span class="label">Inventory Report</span>
          </a>

          <a href="/reports/low-stock" class="nav-btn">
            <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
            <span class="label">Low Stock</span>
          </a>

          <a href="/reports/distribution" class="nav-btn">
            <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
            <span class="label">Distribution</span>
          </a>

        </div>
    `

  const InventoryReportMockData = {
    "kpi_metrics": {
      "total_unique_items": 1248,
      "total_stock_units": 45200,
      "total_inventory_value": 842500.00,
      "items_below_minimum": 14
    },
    "inventory_table": [
      {
        "item_name": "Insulin Glargine 100U",
        "category": "Diabetes",
        "storage_temp": "R",
        "current_stock": 1200,
        "min_level": 500,
        "stock_status": "Healthy",
        "unit_price": 45.00,
        "total_value": 54000.00
      },
      {
        "item_name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "storage_temp": "C",
        "current_stock": 420,
        "min_level": 400,
        "stock_status": "Low",
        "unit_price": 12.50,
        "total_value": 5250.00
      },
      {
        "item_name": "Surgical Gloves (M)",
        "category": "Consumables",
        "storage_temp": "A",
        "current_stock": 110,
        "min_level": 300,
        "stock_status": "Low Stock",
        "unit_price": 0.85,
        "total_value": 93.50
      },
      {
        "item_name": "Propofol 10mg/ml",
        "category": "Anesthetic",
        "storage_temp": "F",
        "current_stock": 0,
        "min_level": 50,
        "stock_status": "Out of Stock",
        "unit_price": 18.20,
        "total_value": 0.00
      }
    ],
    "category_distribution_bar_chart": [
      { "category": "Vaccines", "current_stock": 12500 },
      { "category": "Antibiotics", "current_stock": 8400 },
      { "category": "Consumables", "current_stock": 15200 },
      { "category": "Emergency", "current_stock": 3100 },
      { "category": "Diabetes", "current_stock": 6000 }
    ],
    "stock_status_pie_chart": [
      { "status": "Healthy", "count": 850 },
      { "status": "Low Stock", "count": 160 },
      { "status": "Out of Stock", "count": 14 }
    ]
  }

  // Show Kpi data
  document.getElementById('totItemsMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_unique_items
  document.getElementById('totUnitsMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_stock_units
  document.getElementById('totInvMetric')
    .textContent = InventoryReportMockData.kpi_metrics.total_inventory_value
  document.getElementById('belowMinMetric')
    .textContent = InventoryReportMockData.kpi_metrics.items_below_minimum

  // Populate the items table
  const invTableFrag = document.createDocumentFragment()
  InventoryReportMockData.inventory_table.forEach(item => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td><strong class="item-name">${item.item_name}</strong></td>
      <td>${item.category}</td>
      <td> <span class="badge ${item.storage_temp}">${item.storage_temp}</span></td>
      <td class="text-right">${item.current_stock}</td>
      <td class="text-right">${item.min_level}</td>
      <td><span class="stock-badge badge-${item.stock_status.toLowerCase()}">${item.stock_status}</span></td>
      <td class="text-right">${item.unit_price}</td>
      <td class="text-right tot-value">${item.total_value}</td>
    `

    invTableFrag.appendChild(tblRow)
  })
  document.getElementById('invTbody')
    .appendChild(invTableFrag)

  // Form the Stock Distribution  bar chart by category
  const labels = InventoryReportMockData.category_distribution_bar_chart.map(cat => cat.category)
  const dataValues = InventoryReportMockData.category_distribution_bar_chart.map(cat => cat.current_stock)

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
        legend: {display: false}
      }
    }
  })

  // Stock Status distro
  const statusLabels = InventoryReportMockData.stock_status_pie_chart.map(status => status.status)
  const statusCounts = InventoryReportMockData.stock_status_pie_chart.map(status => status.count)

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
        legend: {position: 'bottom'}
      }
    }
  })
})