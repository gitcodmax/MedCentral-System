import { renderSidebar, renderReportsNavbar } from "../sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  renderReportsNavbar()
  lucide.createIcons();

  const reportData = {
    summary: {
      totalItems: "18,422",
      totalCategories: "18",
      mostConsumed: "Latex Gloves (L)",
      avgMonthly: "3,070"
    },
    trends: {
      labels: ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'],
      values: [2100, 2450, 2200, 3100, 2850, 3070]
    },
    categories: {
      labels: ["PPE", "Surgical", "Pharma", "Fluids", "Wound Care", "Lab", "Diag", "Hygiene", "Anesthesia", "Emergency"],
      values: [7700, 5200, 5000, 1200, 1100, 950, 800, 650, 400, 222]
    },
    tableData: [
      { name: "Latex Gloves (Large)", cat: "PPE", qty: 4500, unit: "Box (100ct)", orders: 42, last: "Feb 10, 2026" },
      { name: "Disposable Syringes 5ml", cat: "Surgical", qty: 2800, unit: "Pack (50ct)", orders: 28, last: "Feb 08, 2026" },
      { name: "Saline Solution 500ml", cat: "Fluids", qty: 1200, unit: "Unit (Bag)", orders: 15, last: "Feb 11, 2026" },
      { name: "Paracetamol 500mg", cat: "Pharma", qty: 5000, unit: "Strip (10ct)", orders: 12, last: "Feb 05, 2026" },
      { name: "Surgical Face Masks", cat: "PPE", qty: 3200, unit: "Box (50ct)", orders: 35, last: "Feb 12, 2026" },
      { name: "Adhesive Bandages", cat: "Wound Care", qty: 1100, unit: "Box (100ct)", orders: 20, last: "Jan 30, 2026" },
      { name: "IV Cannula G20", cat: "Surgical", qty: 622, unit: "Unit", orders: 18, last: "Feb 09, 2026" }
    ]
  };

  // Set up the kpi summary details
  document.querySelector('.js-total-items-kpi')
    .textContent = reportData.summary.totalItems
  document.querySelector('.js-total-cat-kpi')
    .textContent = reportData.summary.totalCategories
  document.querySelector('.js-most-consum-kpi')
    .textContent = reportData.summary.mostConsumed
  document.querySelector('.js-avg-consum-kpi')
    .textContent =reportData.summary.avgMonthly

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
      plugins: {legend: {display: false}}
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
      plugins: {legend: {display: false}}
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
      <td>${item.qty}</td>
      <td>${item.last}</td>
    `

    rankedTblFrag.appendChild(tblRow)
  })

  document.getElementById('rankedItemsTbody')
    .appendChild(rankedTblFrag)
})