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
  // const pendingReview = [
  //   {
  //     "requestId": "REQ-4402",
  //     "hospitalName": "Aga Khan University Hospital",
  //     "createdAt": "Jan 04, 08:15 AM",
  //     "totalAmount": 4250.00,
  //     "items": [
  //       {
  //         "name": "Paracetamol 500mg",
  //         "unitPrice": 10.00,
  //         "quantity": 50,
  //         "uom": "Boxes",
  //         "subtotal": 500.00,
  //         "warehouseStock": 450
  //       },
  //       {
  //         "name": "Surgical Gloves (M)",
  //         "unitPrice": 18.75,
  //         "quantity": 200,
  //         "uom": "Pairs",
  //         "subtotal": 3750.00,
  //         "warehouseStock": 180
  //       }
  //     ]
  //   },
  //   {
  //     "requestId": "REQ-4405",
  //     "hospitalName": "City General Clinic",
  //     "createdAt": "Jan 04, 09:30 AM",
  //     "totalAmount": 120.00,
  //     "items": [
  //       {
  //         "name": "Amoxicillin 250mg",
  //         "unitPrice": 12.00,
  //         "quantity": 10,
  //         "uom": "Vials",
  //         "subtotal": 120.00,
  //         "warehouseStock": 15
  //       }
  //     ]
  //   }
  // ]
  const pendingReview = [
    {
      "requestId": "REQ-4410",
      "hospitalName": "Karen Hospital",
      "location": "Karen, Nairobi",
      "createdAt": "Jan 05, 10:20 AM",
      "totalAmount": 15200.00,
      "items": [
        {
          "name": "Insulin Glargine",
          "unitPrice": 1200.00,
          "quantity": 10,
          "uom": "Cartridges",
          "subtotal": 12000.00,
          "warehouseStock": 45
        },
        {
          "name": "Syringes 2ml",
          "unitPrice": 8.00,
          "quantity": 400,
          "uom": "Units",
          "subtotal": 3200.00,
          "warehouseStock": 1200
        }
      ]
    },
    {
      "requestId": "REQ-4411",
      "hospitalName": "Mater Misericordiae Hospital",
      "location": "South B, Nairobi",
      "createdAt": "Jan 05, 11:45 AM",
      "totalAmount": 2150.00,
      "items": [
        {
          "name": "Ibuprofen 400mg",
          "unitPrice": 5.00,
          "quantity": 300,
          "uom": "Tablets",
          "subtotal": 1500.00,
          "warehouseStock": 5000
        },
        {
          "name": "Medical Tape",
          "unitPrice": 65.00,
          "quantity": 10,
          "uom": "Rolls",
          "subtotal": 650.00,
          "warehouseStock": 85
        }
      ]
    },
    {
      "requestId": "REQ-4412",
      "hospitalName": "MP Shah Hospital",
      "location": "Parklands, Nairobi",
      "createdAt": "Jan 05, 01:15 PM",
      "totalAmount": 8900.00,
      "items": [
        {
          "name": "Saline Solution 500ml",
          "unitPrice": 89.00,
          "quantity": 100,
          "uom": "Bags",
          "subtotal": 8900.00,
          "warehouseStock": 250
        }
      ]
    },
    {
      "requestId": "REQ-4413",
      "hospitalName": "Nairobi West Hospital",
      "location": "South C, Nairobi",
      "createdAt": "Jan 05, 02:30 PM",
      "totalAmount": 3450.50,
      "items": [
        {
          "name": "Azithromycin 500mg",
          "unitPrice": 45.00,
          "quantity": 50,
          "uom": "Packs",
          "subtotal": 2250.00,
          "warehouseStock": 120
        },
        {
          "name": "Face Masks (3-Ply)",
          "unitPrice": 12.00,
          "quantity": 100,
          "uom": "Pieces",
          "subtotal": 1200.50,
          "warehouseStock": 4000
        }
      ]
    },
    {
      "requestId": "REQ-4414",
      "hospitalName": "Kenyatta National Hospital",
      "location": "Hospital Rd, Nairobi",
      "createdAt": "Jan 05, 04:00 PM",
      "totalAmount": 12500.00,
      "items": [
        {
          "name": "Oxytocin Injection",
          "unitPrice": 250.00,
          "quantity": 50,
          "uom": "Ampoules",
          "subtotal": 12500.00,
          "warehouseStock": 300
        }
      ]
    },
    {
      "requestId": "REQ-4415",
      "hospitalName": "Avenue Hospital",
      "location": "Parklands, Nairobi",
      "createdAt": "Jan 06, 08:00 AM",
      "totalAmount": 560.00,
      "items": [
        {
          "name": "Hand Sanitizer 500ml",
          "unitPrice": 280.00,
          "quantity": 2,
          "uom": "Bottles",
          "subtotal": 560.00,
          "warehouseStock": 140
        }
      ]
    },
    {
      "requestId": "REQ-4416",
      "hospitalName": "Gertrude's Children's Hospital",
      "location": "Muthaiga, Nairobi",
      "createdAt": "Jan 06, 09:15 AM",
      "totalAmount": 4100.00,
      "items": [
        {
          "name": "Pediatric Paracetamol Syrup",
          "unitPrice": 150.00,
          "quantity": 20,
          "uom": "Bottles",
          "subtotal": 3000.00,
          "warehouseStock": 60
        },
        {
          "name": "Oral Rehydration Salts",
          "unitPrice": 22.00,
          "quantity": 50,
          "uom": "Sachets",
          "subtotal": 1100.00,
          "warehouseStock": 900
        }
      ]
    },
    {
      "requestId": "REQ-4417",
      "hospitalName": "Coptic Hospital",
      "location": "Ngong Road, Nairobi",
      "createdAt": "Jan 06, 10:45 AM",
      "totalAmount": 7200.00,
      "items": [
        {
          "name": "Metformin 500mg",
          "unitPrice": 12.00,
          "quantity": 600,
          "uom": "Tablets",
          "subtotal": 7200.00,
          "warehouseStock": 2500
        }
      ]
    },
    {
      "requestId": "REQ-4418",
      "hospitalName": "Nairobi Hospital",
      "location": "Argwings Kodhek, Nairobi",
      "createdAt": "Jan 06, 11:30 AM",
      "totalAmount": 18500.00,
      "items": [
        {
          "name": "Surgical Gowns",
          "unitPrice": 370.00,
          "quantity": 50,
          "uom": "Units",
          "subtotal": 18500.00,
          "warehouseStock": 75
        }
      ]
    },
    {
      "requestId": "REQ-4419",
      "hospitalName": "Metropolitan Hospital",
      "location": "Buruburu, Nairobi",
      "createdAt": "Jan 06, 02:20 PM",
      "totalAmount": 2400.00,
      "items": [
        {
          "name": "Ceftriaxone 1g",
          "unitPrice": 120.00,
          "quantity": 20,
          "uom": "Vials",
          "subtotal": 2400.00,
          "warehouseStock": 10
        }
      ]
    }
  ];

  document.querySelector('.requests')
    .innerText = pendingReview.length

  //Display the pending reviews
  pendingReview.forEach((request) => {

    document.querySelector('.js-request-container')
      .innerHTML += `
      <div class="request-card" data-request-id=${request.requestId}>
        <div class="request-header">
          <div class="hospital-meta">
            <div class="org-name-location">
              <span class="hospital-name">${request.hospitalName}</span>
              <span class="org-location"><i class="fas fa-map-marker-alt"></i>${request.location}</span>
            </div>
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
            <button class="btn-deny">Deny</button>
            <button class="btn-approve">Approve & Send Invoice</button>
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
              <td>
                <span class="${item.warehouseStock >= item.quantity ? 'text-success' : 'text-danger'}">
                  ${item.warehouseStock} ${item.uom}
                </span>
              </td>
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