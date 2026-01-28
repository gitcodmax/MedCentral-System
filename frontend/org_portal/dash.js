import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  //Hospital dash mock data
  const hospitalDashboardData = {
    metrics: {
      totalOrders: 142,
      pending: 12,
      inTransit: 8,
      delivered: 122
    },

    milestoneDistribution: [ 4, 138, 122],

    recentOrders: [
      { orderId: "ORD-2026-140", creationDate: "Jan 28, 10:00 AM", status: "Pending" },
      { orderId: "ORD-2026-138", creationDate: "Jan 27, 02:15 PM", status: "Dispatched"},
      { orderId: "ORD-2026-135", creationDate: "Jan 27, 09:45 AM", status: "Delayed"},
      { orderId: "ORD-2026-132", creationDate: "Jan 26, 03:20 PM", status: "Issue"},
      { orderId: "ORD-2026-130", creationDate: "Jan 25, 11:30 AM", status: "Completed"}
    ]
  };

  //Display quick analytics in the dash
  document.querySelector('.js-total-ord-value')
    .textContent = hospitalDashboardData.metrics.totalOrders
  document.querySelector('.js-pending-value')
    .textContent = hospitalDashboardData.metrics.pending
  document.querySelector('.js-dispatched-value')
    .textContent = hospitalDashboardData.metrics.inTransit
  document.querySelector('.js-delivered-value')
    .textContent = hospitalDashboardData.metrics.delivered

  //Creating the order status chart
  const ctx = document.getElementById('ordersChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Rejected', 'Approved', 'Completed'],
      datasets: [{
        label: 'Orders',
        data: hospitalDashboardData.milestoneDistribution,
        backgroundColor: [
          '#DC3545', '#007BFF', '#157347'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })

  //Display the recent orders in the recent orders card
  const recentOrdersTableFragment = document.createDocumentFragment()
  const {recentOrders} = hospitalDashboardData
  recentOrders.forEach(order => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.creationDate}</td>
      <td><span class="badge-pill b-${order.status.toLowerCase()}">${order.status}</span></td>
    `

    recentOrdersTableFragment.appendChild(tblRow)
  })
  document.querySelector('.js-recent-orders-tbody')
    .appendChild(recentOrdersTableFragment)
})