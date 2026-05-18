import { displayNoRecordsNotif, handleOverlay, orgPortalPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../global.js"
import { hosId } from "./dash.js"
import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.payments-app-container')
    .innerHTML = `
      <nav class="sidebar js-sidebar"></nav>

      <main class="app-content">
        <div class="main-content-logo"></div>

        <div class="table-container" id="appReqTblCont">
          <div class="table-header">
            <h2>Pending Payments</h2>
            <p>Select an approved request to authorize disbursement.</p>
          </div>

          <table class="med-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Requested At</th>
                <th>Approved At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="approvedReqTable"></tbody>
          </table>
        </div>

        <div class="modal-overlay" id="paymentOverlay">
          <div class="payment-container">
            <div class="payment-summary">
              <header>
                <h2>Complete Payment</h2>
                <p>Request ID: <span class="req-id-badge" id="reqIdBadge"></span></p>
              </header>

              <div class="hospital-info">
                <h3 class="js-hos"></h3>
                <p><span class="js-hos-loc"></span> | <span class="js-appr-at"></span></p>
              </div>

              <div class="item-list">
                <div id="reqItemsList"></div>
                <hr>
                <div class="total-row">
                  <span>Total Amount</span>
                  <span class="total-price" id="overlayTotPrice"></span>
                </div>
              </div>
            </div>

            <div class="payment-methods">
              <div class="header-close-container">
                <h3>Choose Payment Method</h3>
                <button class="modal-close-btn js-btn-close-overlay">&times;</button>
              </div>
              <form id="paymentForm">
                <label class="method-option">
                  <input type="radio" name="method" value="mpesa" checked>
                  <div class="method-details">
                    <strong>M-Pesa Business</strong>
                    <span>Instant STK Push</span>
                  </div>
                </label>

                <label class="method-option">
                  <input type="radio" name="method" value="bank">
                  <div class="method-details">
                    <strong>RTGS / Bank Transfer</strong>
                    <span>Verification takes 24hrs</span>
                  </div>
                </label>

                <button type="submit" class="pay-btn">Authorize Payment of $<span id="btnTotAmt"></span></button>
                <p class="secure-text">🔒 Encrypted Secure Transaction</p>
              </form>
            </div>
          </div>
        </div>
      </main>
    `

  renderSidebar('payment')
  renderSuccessErrorOverlay()

  const payOverlayElem = document.getElementById('paymentOverlay')
  const approvedReq = await getAprovedReq(hosId)

  // Display approved requests on the pending payments table
  const approvedReqTblBodyElem = document.getElementById('approvedReqTable')
  const approvedReqTblFrag = document.createDocumentFragment()
  if (!approvedReq) {
    displayNoRecordsNotif('Approved Request', 'appReqTblCont')
  }

  approvedReq.forEach(req => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td class="req-id"><strong>${req.requestId}</strong></td>
      <td><span class="status-badge approved">Approved</span></td>
      <td>${req.itemCount}</td>
      <td class="amount">${req.totalAmount}</td>
      <td>${req.requestedAt}</td>
      <td><strong>${req.approvedAt}</strong></td>
      <td>
        <button class="btn-pay js-btn-pay" data-req-id=${req.requestId}>Pay Now</button>
      </td>
    `

    approvedReqTblFrag.appendChild(tblRow)
  })

  approvedReqTblBodyElem.appendChild(approvedReqTblFrag)

  // Button to display payment and order details
  document.querySelectorAll('.js-btn-pay')
    .forEach(payBtn => {
      payBtn.addEventListener('click', () => {
        const btnReqId = payBtn.dataset.reqId
        const request = approvedReq.find(req => req.requestId === btnReqId)

        document.getElementById('reqIdBadge').textContent = request.requestId
        document.querySelector('.js-hos').textContent = request.hospital
        document.querySelector('.js-hos-loc').textContent = request.location
        document.querySelector('.js-appr-at').textContent = request.approvedAt

        const reqItemsContElem = document.getElementById('reqItemsList')
        const reqItemsListFrag = document.createDocumentFragment()

        reqItemsContElem.innerHTML = ``
        request.items.forEach(item => {
          const divElem = document.createElement('div')
          divElem.classList.add('item')

          divElem.innerHTML = `
            <span>${item.name} (x${item.quantityRequested})</span>
            <strong>$${item.subtotal}</strong>
          `

          reqItemsListFrag.appendChild(divElem)
        })
        reqItemsContElem.appendChild(reqItemsListFrag)

        document.getElementById('overlayTotPrice').textContent = request.totalAmount
        document.getElementById('btnTotAmt').textContent = request.totalAmount

        handleOverlay(payOverlayElem)

        const form = document.getElementById('paymentForm')
        form.addEventListener('submit', async (e) => {
          e.preventDefault()
          const reqId = Number(request.requestId.slice(4))

          await createOrder(reqId)          
        },{once: true})
      })
    })
})

const getAprovedReq = async (hosId) => {
  const response = await fetch(`${orgPortalPagesLink}/getApprovedRequests`, 
    {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({hosId})
    }
  )

  const res = await response.json()
  return res.approved_requests
}

const createOrder = async (reqId) => {
  const response = await fetch(`${orgPortalPagesLink}/createOrder`, 
    {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({reqId})
    }
  )

  const res = await response.json()
  triggerStatus(res.msg)
}