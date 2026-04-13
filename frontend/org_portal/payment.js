import { handleOverlay, orgPortalPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../global.js"
import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', async () => {
  renderSidebar('payment')
  renderSuccessErrorOverlay()

  const payOverlayElem = document.getElementById('paymentOverlay')

  // ==================
  // ==================
  const hosId = 21
  // ==================
  // ==================
  const approvedReq = await getAprovedReq(hosId)

  const approvedReqTblBodyElem = document.getElementById('approvedReqTable')
  const approvedReqTblFrag = document.createDocumentFragment()

  approvedReq.forEach(req => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td class="req-id"><strong>${req.requestId}</strong></td>
      <td><span class="status-badge approved">Approved</span></td>
      <td>${req.itemCount}</td>
      <td class="amount">$${req.totalAmount}</td>
      <td>${req.requestedAt}</td>
      <td><strong>${req.approvedAt}</strong></td>
      <td>
        <button class="btn-pay js-btn-pay" data-req-id=${req.requestId}>Pay Now</button>
      </td>
    `

    approvedReqTblFrag.appendChild(tblRow)
  })

  approvedReqTblBodyElem.appendChild(approvedReqTblFrag)

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

          const msg = await createOrder(reqId)
          triggerStatus(msg)
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
  return res.msg
}