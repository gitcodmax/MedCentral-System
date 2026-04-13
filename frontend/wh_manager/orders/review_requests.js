import { renderSidebar } from "../sidebar.js";
import { displayNoMatch, xRemoveOverlay, clickToRemoveOverlay } from "../overlay.js";
import { renderSuccessErrorOverlay, triggerStatus, whManagerPagesLink } from "../../global.js";

document.addEventListener('DOMContentLoaded', async () => {

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
          <button class="btn-reset js-btn-reset">Reset</button>
        </div>
      </section>

      <div class="no-match-container hidden js-no-match-container"></div>

      <div class="overlay" id="denyRequestOverlay">
        <div class="confirmation-card deny-card">
          <div class="deny-header">
              <div class="icon-circle">
                  <i class="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Confirm Denial</h3>
          </div>

          <div class="deny-body">
              <p class="main-prompt">
                  Deny request: <span class="highlight-text js-req-id"></span> for 
                  <strong class="js-org-name">Karen Hospital</strong> due to<span class="reason-tag js-reason-tag"></span>?
              </p>
          </div>

          <div class="deny-footer">
              <button class="btn-cancel js-btn-no">No, Keep Pending</button>
              <button class="btn-confirm-deny" id="denyRequestBtn">Yes, Deny Request</button>
          </div>
        </div>
      </div>

      <div class="overlay" id="approveRequestOverlay">
        <div class="confirmation-card approve-card">
          <div class="approve-header">
              <div class="icon-circle-success">
                  <i class="fas fa-check-circle"></i>
              </div>
              <h3>Approve Request</h3>
          </div>

          <div class="approve-body">
              <p class="main-prompt">
                  Approve request: <span class="highlight-id js-app-req-id">REQ-4410</span> for 
                  <strong class="js-app-org-name">Karen Hospital</strong>?
              </p>
              
              <div class="details-summary">
                <div class="summary-item">
                  <span class="s-label">No. of items:</span>
                  <span class="s-value js-no-items">3</span>
                </div>
                <div class="summary-item">
                  <span class="s-label">Total Amount:</span>
                  <span class="s-value total-amt js-total-amt">$1000</span>
                </div>
              </div>
          </div>

          <div class="approve-footer">
              <button class="btn-cancel js-btn-no">Back to Review</button>
              <button class="btn-confirm-approve" id="approveReqBtn">Confirm & Proceed</button>
          </div>
        </div>
      </div>

      <section class="request-container js-request-container"></section>
    
    `

  renderSidebar('review_requests')
  displayNoMatch()
  renderSuccessErrorOverlay()

  const pendingReview = await getAllReqData()

  document.querySelector('.requests')
    .innerText = pendingReview.length

  //Get the organization name, items and total amount in a request
  function getReqDetails(requestId) {
    const req = pendingReview.find(req => req.requestId === requestId)
    return ({ 'orgName': req.orgName, 'items': req.items, 'totalAmount': req.totalAmount })
  }

  //Set up opening the overlay when deny and approve buttons are clicked
  const requestsContainerElem = document.querySelector('.js-request-container')
  const denyRequestOverlayElem = document.getElementById('denyRequestOverlay')
  const approveRequestOverlayElem = document.getElementById('approveRequestOverlay')

  requestsContainerElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return

    const btnReqId = btn.dataset.reqId
    const { orgName, items, totalAmount } = getReqDetails(Number(btnReqId))

    if (btn.classList.contains('js-btn-deny')) {
      const denyRequestInputElem = document.getElementById(`denyReason-${btnReqId}`)
      const denyRequestBtnElem = document.getElementById('denyRequestBtn')

      if (denyRequestInputElem.value === '') {
        alert('Enter a reason to deny the request')
      } else {
        denyRequestOverlayElem.classList.add('active')
        document.querySelector('.js-req-id')
          .textContent = btnReqId
        document.querySelector('.js-reason-tag')
          .textContent = denyRequestInputElem.value
        document.querySelector('.js-org-name')
          .textContent = orgName

        xRemoveOverlay(denyRequestOverlayElem)
        clickToRemoveOverlay(denyRequestOverlayElem)

        denyRequestBtnElem.addEventListener('click', async () => {
          const response = await fetch(`${whManagerPagesLink}/denyRequest`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reqId: Number(btnReqId),
                rejectionReason: denyRequestInputElem.value
              })
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)
        }, { once: true })
      }
    }

    if (btn.classList.contains('js-btn-approve')) {
      approveRequestOverlayElem.classList.add('active')
      document.querySelector('.js-app-req-id')
        .textContent = btnReqId
      document.querySelector('.js-app-org-name')
        .textContent = orgName
      document.querySelector('.js-no-items')
        .textContent = items.length
      document.querySelector('.js-total-amt')
        .textContent = `KSH. ${totalAmount}`

      xRemoveOverlay(approveRequestOverlayElem)
      clickToRemoveOverlay(approveRequestOverlayElem)

      document.getElementById('approveReqBtn')
        .addEventListener('click', async () => {
          const reqId = Number(btnReqId)
          const response = await fetch(`${whManagerPagesLink}/approveReq`, 
            {
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({reqId})
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)

        }, {once: true})
    }
  })

  //Display the pending reviews
  pendingReview.forEach((request) => {
    requestsContainerElem.innerHTML += `
      <div class="request-card" data-request-id=${request.requestId}>
        <div class="request-header">
          <div class="hospital-meta">
            <div class="org-name-location">
              <span class="hospital-name">${request.orgName}</span>
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
            <span class="total-amt">KSH. ${request.totalAmount}</span>
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
            <input type="text" placeholder="Reason for denial..." id="denyReason-${request.requestId}">
          </div>
          <div class="action-buttons">
            <button class="btn-deny js-btn-deny" data-req-id=${request.requestId}>Deny</button>
            <button class="btn-approve js-btn-approve" data-req-id=${request.requestId}>Approve & Send Invoice</button>
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
              <td><strong>KSH. ${item.subtotal}</strong></td>
            </tr>
          `
    })
  }

  //Filtering logic
  function filterRequests() {
    const input = document.getElementById('hospitalSearch').value.toLowerCase();
    const dateSelection = document.getElementById('dateFilter').value;
    const cards = document.getElementsByClassName('request-card');
    const noMatchElem = document.querySelector('.js-no-match-container')

    const now = dayjs();
    const today = now.format('YYYY-MM-DD')
    const yesterday = now.subtract(1, 'day').format('YYYY-MM-DD')

    let visibleCount = 0;

    Array.from(cards).forEach(card => {
      const orgName = card.querySelector('.hospital-name').innerText.toLowerCase();
      const cardDate = dayjs(card.querySelector('.js-creation-date').innerText)
        .year(dayjs().year()).format('YYYY-MM-DD');

      //Check for hospital match
      const matchesHospital = orgName.includes(input);

      //Check for date match
      let matchesDate = true;
      if (dateSelection === 'today') {
        matchesDate = (cardDate === today)
      } else if (dateSelection === 'yesterday') {
        matchesDate = (cardDate === yesterday)
      }

      if (matchesHospital && matchesDate) {
        noMatchElem.classList.add('hidden')
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
        noMatchElem.classList.remove('hidden')
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

const getAllReqData = async () => {
  const response = await fetch(`${whManagerPagesLink}/getAllRequests`)
  const res = await response.json()
  return res.all_requests
}