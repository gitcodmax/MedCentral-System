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

        <a href="/reports/low-stock" class="nav-btn active">
          <span class="icon bg-red-lite"><i class="fas fa-exclamation-triangle"></i></span>
          <span class="label">Low Stock</span>
        </a>

        <a href="/reports/distribution" class="nav-btn">
          <span class="icon bg-purple-lite"><i class="fas fa-hospital-symbol"></i></span>
          <span class="label">Distribution</span>
        </a>

      </div>
  `

  const lowStockReportMockData = {
    "kpi_metrics": {
      "total_low_stock_items": 42,
      "out_of_stock_items": 12,
      "affected_categories": 8
    },
    "inventory_table": [
      {
        "item_name": "Propofol 10mg/ml",
        "category": "Anesthetic",
        "current_stock": 0,
        "min_level": 50,
        "deficit": -50,
        "supplier": "Global Pharma Co.",
        "last_restocked": "2025-12-05",
        "stock_status": "Out of Stock"
      },
      {
        "item_name": "Surgical Gloves (M)",
        "category": "Consumables",
        "current_stock": 410,
        "min_level": 300,
        "deficit": 110,
        "supplier": "Medline Industries",
        "last_restocked": "2026-02-22",
        "stock_status": "Healthy"
      },
      {
        "item_name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "current_stock": 420,
        "min_level": 500,
        "deficit": -80,
        "supplier": "Alpha Medics",
        "last_restocked": "2026-01-20",
        "stock_status": "Low Stock"
      },
      {
        "item_name": "Saline Solution 0.9%",
        "category": "IV Fluids",
        "current_stock": 20,
        "min_level": 200,
        "deficit": -180,
        "supplier": "Baxter Healthcare",
        "last_restocked": "2026-02-15",
        "stock_status": "Low Stock"
      },
      {
        "item_name": "Epinephrine Auto-Injector",
        "category": "Emergency",
        "current_stock": 0,
        "min_level": 25,
        "deficit": -25,
        "supplier": "Global Pharma Co.",
        "last_restocked": "2025-11-30",
        "stock_status": "Out of Stock"
      }
    ],
    "low_stock_by_category_bar_chart": [
      { "category": "Anesthetic", "low_stock_count": 5 },
      { "category": "Consumables", "low_stock_count": 14 },
      { "category": "Antibiotics", "low_stock_count": 8 },
      { "category": "IV Fluids", "low_stock_count": 9 },
      { "category": "Emergency", "low_stock_count": 6 }
    ]
  }

  document.getElementById('totLowStockItemsKpi')
    .textContent = lowStockReportMockData.kpi_metrics.total_low_stock_items
  document.getElementById('outOfStockItemsKpi') 
    .textContent = lowStockReportMockData.kpi_metrics.out_of_stock_items
  document.getElementById('affectedCategories')  
    .textContent =  lowStockReportMockData.kpi_metrics.affected_categories

  const lowStockRprtTblFrag = document.createDocumentFragment()
  lowStockReportMockData.inventory_table.forEach(item => {
    const tblRow = document.createElement('tr')
    const itemStatusLower = item.stock_status.toLowerCase()
    tblRow.className = `row-${itemStatusLower === 'out of stock' ?
       itemStatusLower.replaceAll(' ', '-') : itemStatusLower}`

    tblRow.innerHTML = `
      <td><strong class="tbl-item-name">${item.item_name}</strong></td>
      <td>${item.category}</td>
      <td class="text-right">${item.current_stock}</td>
      <td class="text-right">${item.min_level}</td>
      <td class="text-right deficit-${itemStatusLower}">${item.deficit}</td>
      <td>${item.supplier}</td>
      <td>${item.last_restocked}</td>
      <td><span class="stock-badge badge-${itemStatusLower}">${item.stock_status}</span></td>
    `

    lowStockRprtTblFrag.appendChild(tblRow)
  })
  document.getElementById('lowStockReportTbody')
    .appendChild(lowStockRprtTblFrag)

  // Low Stock by Category bar chart
  const labels = lowStockReportMockData.low_stock_by_category_bar_chart.map(cat => cat.category)
  const dataValues = lowStockReportMockData.low_stock_by_category_bar_chart.map(cat => cat.low_stock_count)

  const lowStockCatCtx = document.getElementById('lowStockCategoryBars').getContext('2d')
  new Chart(lowStockCatCtx, {
    type: 'bar', 
    data: {
      labels: labels, 
      datasets: [{
        label: 'Number of Low Stock SKUs', 
        data: dataValues, 
        backgroundColor: '#FF8C0022', 
        borderColor: '#FF8C00', 
        borderWidth: 2, 
        borderRadius: 4, 
        barThichness: 30
      }]
    }, 
    options: {
      indexAxis: 'y', 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: {legend: {display: false}}
    }
  })
})