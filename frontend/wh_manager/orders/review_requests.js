import { renderSidebar } from "../sidebar.js";

document.addEventListener('DOMContentLoaded', () => {

  //Display the main content
  document.querySelector('.main-content')
    .innerHTML = `      
      <header class="logo-container"></header>

      <div class="page-title-container">
        <h2>Request Approval Queue</h2>
        <div class="pending-requests"> <span class="requests"></span> Pending Requests</div>
      </div>

      <section class="filter-container">
        <div class="filter-group">
          <label for="hospitalSearch"><i class="fas fa-hospital"></i> Hospital Name</label>
          <input type="text" id="hospitalSearch" placeholder="Search by hospital name...">
        </div>

        <div class="filter-group">
          <label for="dateFilter"><i class="fas fa-calendar-alt"></i> Creation Date</label>
          <select id="dateFilter">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="older">Older than 2 days</option>
          </select>
        </div>

        <div class="filter-stats">
          <span id="showingCount">Showing All Requests</span>
          <button class="btn-reset js-btn-reset" onclick="resetFilters()">Reset</button>
        </div>
      </section>

      <section class="request-container js-request-container"></section>
    
    `
    console.log(window.location.href)
  
  renderSidebar('review_requests')

  //Mock data for the requests made
  const pendingReview = [
    {
      "requestId": "REQ-4402",
      "hospitalName": "Aga Khan University Hospital",
      "createdAt": "Jan 04, 08:15 AM",
      "totalAmount": 4250.00,
      "items": [
        {
          "name": "Paracetamol 500mg",
          "unitPrice": 10.00,
          "quantity": 50,
          "uom": "Boxes",
          "subtotal": 500.00,
          "warehouseStock": 450
        },
        {
          "name": "Surgical Gloves (M)",
          "unitPrice": 18.75,
          "quantity": 200,
          "uom": "Pairs",
          "subtotal": 3750.00,
          "warehouseStock": 180
        }
      ]
    },
    {
      "requestId": "REQ-4405",
      "hospitalName": "City General Clinic",
      "createdAt": "Jan 04, 09:30 AM",
      "totalAmount": 120.00,
      "items": [
        {
          "name": "Amoxicillin 250mg",
          "unitPrice": 12.00,
          "quantity": 10,
          "uom": "Vials",
          "subtotal": 120.00,
          "warehouseStock": 15
        }
      ]
    }
  ]

  document.querySelector('.requests')
    .innerText = pendingReview.length

  //Display the pending reviews
  pendingReview.forEach((request) => {

    document.querySelector('.js-request-container')
      .innerHTML += `
      <div class="request-card" data-request-id=${request.requestId}>
        <div class="request-header">
          <div class="hospital-meta">
            <span class="hospital-name">${request.hospitalName}</span>
            <span class="request-id">${request.requestId}</span>
          </div>

          <div class="time-tracking">
              <i class="far fa-clock"></i>
              Created: <span class="js-creation-date">${request.createdAt}</span>
          </div>

          <div class="order-total-badge">
            <small>Total Amount:</small>
            <span class="total-amt">$${request.totalAmount}</span>
          </div>
        </div>

        <div class="request-body">
          <table class="item-review-table">
            <thead>
              <tr>
                <th>Item Requested</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Warehouse Stock</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody class="request-${request.requestId}"></tbody>
          </table>
        </div>

        <div class="request-footer">
          <div class="denial-reason">
            <input type="text" placeholder="Reason for denial..." id="note-4402">
          </div>
          <div class="action-buttons">
            <button class="btn-deny" onclick="handleAction('deny', '4402')">Deny</button>
            <button class="btn-approve" onclick="handleAction('approve', '4402')">Approve & Send Invoice</button>
          </div>
        </div>
      </div>
    `

    displayItems(request)
  })

  //Displays the items requested
  function displayItems(request) {
    request.items.forEach((item) => {

      document.querySelector(`.request-${request.requestId}`)
        .innerHTML += `
            <tr>
              <td>${item.name}</td>
              <td>$${item.unitPrice}</td>
              <td>${item.quantity} ${item.uom}</td>
              <td><span class="text-success">${item.warehouseStock} ${item.uom}</span></td>
              <td><strong>$${item.subtotal}</strong></td>
            </tr>
          `
    })
  }

  //Filtering logic
  function filterRequests() {
    const input = document.getElementById('hospitalSearch').value.toLowerCase();
    const dateSelection = document.getElementById('dateFilter').value;
    const cards = document.getElementsByClassName('request-card');

    const now = dayjs();
    const today = now.format('YYYY-MM-DD')
    const yesterday = now.subtract(1, 'day').format('YYYY-MM-DD')

    let visibleCount = 0;

    Array.from(cards).forEach(card => {
      const hospitalName = card.querySelector('.hospital-name').innerText.toLowerCase();
      const cardDate = dayjs(card.querySelector('.js-creation-date').innerText)
        .year(dayjs().year()).format('YYYY-MM-DD');

      //Check for hospital match
      const matchesHospital = hospitalName.includes(input);

      //Check for date match
      let matchesDate = true;
      if (dateSelection === 'today') {
        matchesDate = (cardDate === today)
      } else if (dateSelection === 'yesterday') {
        matchesDate = (cardDate === yesterday)
      }

      if (matchesHospital && matchesDate) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    })

    document.getElementById('showingCount').innerText = `Showing ${visibleCount} Requests`;
  }

  function resetFilters() {
    document.getElementById('hospitalSearch').value = '';
    document.getElementById('dateFilter').value = 'all';
    filterRequests()
  }

  document.getElementById('hospitalSearch')
    .addEventListener('keyup', () => {
      filterRequests()
    })

  document.getElementById('dateFilter')
    .addEventListener('change', () => {
      filterRequests()
    })

  document.querySelector('.js-btn-reset')
    .addEventListener('click', () => {
      resetFilters()
    })

})