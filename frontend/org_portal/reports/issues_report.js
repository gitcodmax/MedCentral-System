import { renderSidebar, renderReportsNavbar } from "../sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  renderReportsNavbar()

  const MedCentralIssuesData = {
    summary: {
      totalIssuesReported: 128,
      totalItemsReturned: 452,
      mostCommonIssue: "Damaged",
      pendingResolutions: 14
    },

    issuesByType: {
      months: ["Sept", "Oct", "Nov", "Dec", "Jan", "Feb"],
      datasets: [
        { label: "Damaged", data: [12, 19, 15, 25, 18, 20], color: "#007BFF" },
        { label: "Expired", data: [5, 8, 4, 10, 6, 9], color: "#008B00" },
        { label: "Wrong Item", data: [3, 5, 2, 8, 4, 5], color: "#F59E0B" }
      ]
    },

    topIssueItems: {
      labels: ["Insulin Glargine", "Surgical Gloves (M)", "N95 Masks", "Saline Bags", "Vial-X7"],
      values: [42, 35, 28, 15, 12]
    },

    detailedIssues: [
      {
        orderId: "ORD-5542",
        itemName: "Insulin Glargine 100U/mL",
        category: "Pharmaceuticals",
        issueType: "Damaged",
        quantityAffected: 12,
        dateReported: "Feb 12, 2026",
        status: "In Review"
      },
      {
        orderId: "ORD-5612",
        itemName: "Fresh Frozen Plasma",
        category: "Laboratory",
        issueType: "Expired",
        quantityAffected: 4,
        dateReported: "Feb 11, 2026",
        status: "Pending"
      },
      {
        orderId: "ORD-5580",
        itemName: "Surgical Face Masks (3-Ply)",
        category: "PPE",
        issueType: "Rejected",
        quantityAffected: 50,
        dateReported: "Feb 10, 2026",
        status: "Resolved"
      },
      {
        orderId: "ORD-5491",
        itemName: "Saline 0.9% 500ml",
        category: "Fluids",
        issueType: "Missing",
        quantityAffected: 20,
        dateReported: "Feb 09, 2026",
        status: "Resolved"
      },
      {
        orderId: "ORD-5321",
        itemName: "N95 Respirators",
        category: "PPE",
        issueType: "Damaged",
        quantityAffected: 100,
        dateReported: "Feb 05, 2026",
        status: "In Review"
      }
    ]
  };

  document.querySelector('.total-issues')
    .textContent = MedCentralIssuesData.summary.totalIssuesReported
  document.querySelector('.total-items-returned')
    .textContent = MedCentralIssuesData.summary.totalItemsReturned
  document.querySelector('.most-common-issue')
    .textContent = MedCentralIssuesData.summary.mostCommonIssue
  document.querySelector('.pend-resolutions')
    .textContent = MedCentralIssuesData.summary.pendingResolutions

  // Type of issues stacked bar chart
  const typeIssueCtx = document.getElementById('issuesByTypeChart').getContext('2d');
  new Chart(typeIssueCtx, {
    type: 'bar',
    data: {
      labels: MedCentralIssuesData.issuesByType.months,
      datasets: MedCentralIssuesData.issuesByType.datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color,
        borderRadius: 4
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, grid: { color: '#f0f0f0' } }
      }
    }
  })

  // Top issue items bar chart
  const topItemsCtx = document.getElementById('topIssueItemsChart').getContext('2d')
  new Chart(topItemsCtx, {
    type: 'bar',
    data: {
      labels: MedCentralIssuesData.topIssueItems.labels,
      datasets: [{
        label: 'Issues Count',
        data: MedCentralIssuesData.topIssueItems.values,
        backgroundColor: 'red',
        borderRadius: 6,
        barThickness: 25
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        y: { grid: { display: false }, ticks: {color: '#007BFF'} }
      }
    }
  });

  const detailedIssuesTblFrag = document.createDocumentFragment()
  MedCentralIssuesData.detailedIssues.forEach(ord => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td><strong class="ord-id">${ord.orderId}</strong></td>
      <td>${ord.itemName}</td>
      <td>${ord.category}</td>
      <td class="issue">${ord.issueType}</td>
      <td>${ord.quantityAffected}</td>
      <td>${ord.dateReported}</td>
      <td><span class="badge 
        badge-${ord.status === 'In Review' ? ord.status.slice(3).toLowerCase() 
            : ord.status.toLowerCase()}"
        >
        ${ord.status}</span>
      </td>
    `

    detailedIssuesTblFrag.appendChild(tblRow)
  })
  document.getElementById('detailedIssuesTbody')
    .appendChild(detailedIssuesTblFrag)
})