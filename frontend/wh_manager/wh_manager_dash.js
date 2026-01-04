document.addEventListener('DOMContentLoaded', () => {

  //Mock data for dash summary
  const summaryStats = {
    "totalPendingReview": 8,
    "totalToAssignClerk": 10,
    "totalToAssignDriver": 16
  }

  //Handles display of summary data in the dash
  document.querySelector('.js-orders-review')
    .innerText = summaryStats.totalPendingReview

  document.querySelector('.js-orders-assign-clerk')
    .innerText = summaryStats.totalToAssignClerk

  document.querySelector('.js-orders-assign-driver')
    .innerText = summaryStats.totalToAssignDriver

  //Controls the hamburger icon for the sidebar
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Code for the stock alerts has been repeated in another file(inv_clerk)
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //Mock data from the API for use in the stock alerts
  const inventory = {
    "PAR-500MG": {
      itemDetails: "Paracetamol 500mg(20 boxes)",
      stockLevel: "low" // Value sent from API: 'warning', 'low', 'critical', or 'healthy'
    },
    "AMX-250": {
      itemDetails: "Amoxicillin 250mg(5 bottles)",
      stockLevel: "critical"
    },
    "GLOV-LAT-M": {
      itemDetails: "Latex Gloves(10 cartons)",
      stockLevel: "warning"
    }
  };

  //Handles display of the stock alerts in the dash
  const alertsContainer = document.querySelector('.js-alerts-container')
  for (const item in inventory) {
    const itemDetails = inventory[item]
    alertsContainer.innerHTML += `
      <div class="alert-pill ${itemDetails['stockLevel']}-stock">${itemDetails['itemDetails']}</div>
    `
  }

  //Mock data for recently delivered orders
  const recentlyDeliveredOrders = [
    {
      "orderId": "ORD-0882",
      "hospitalName": "Aga Khan University Hospital",
      "creationDate": "2025-12-28",
      "deliveredOn": "2026-01-02"
    },
    {
      "orderId": "ORD-0875",
      "hospitalName": "The Nairobi Hospital",
      "creationDate": "2025-12-27",
      "deliveredOn": "2026-01-01"
    },
    {
      "orderId": "ORD-0860",
      "hospitalName": "Kenyatta National Hospital",
      "creationDate": "2025-12-24",
      "deliveredOn": "2025-12-28"
    },
    {
      "orderId": "ORD-0855",
      "hospitalName": "MediHeal Hospital",
      "creationDate": "2025-12-22",
      "deliveredOn": "2025-12-26"
    }
  ]

  recentlyDeliveredOrders.forEach((deliveredOrder) => {
    console.log(deliveredOrder)

    document.querySelector('tbody')
      .innerHTML += `
        <tr>
          <td>${deliveredOrder.hospitalName}</td>
          <td class="order-id">${deliveredOrder.orderId}</td>
          <td>${deliveredOrder.creationDate}</td>
          <td>${deliveredOrder.deliveredOn}</td>
          <td><span class="badge">DELIVERED</span></td>
        </tr>
      `
  })

})