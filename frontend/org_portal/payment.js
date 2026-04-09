import { handleOverlay } from "../global.js"
import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar('payment')

  const payOverlayElem = document.getElementById('paymentOverlay')

  // Approved Requests mock data
  const approvedReq = [
    {
      "requestId": "REQ-4410",
      "hospital": "Karen Hospital",
      "hospitalEmail": "finance@karenhospital.org",
      "location": "Karen-Lang'ata, Nairobi",
      "itemCount": 2,
      "totalAmount": 15200.00,
      "requestedAt": "Jan 05, 10:20 AM",
      "approvedAt": "Jan 06, 09:15 AM",
      "items": [
        {
          "name": "Insulin Glargine",
          "quantityRequested": 10,
          "subtotal": 12000.00
        },
        {
          "name": "Syringes 2ml",
          "quantityRequested": 400,
          "subtotal": 3200.00
        }
      ]
    },
    {
      "requestId": "REQ-4435",
      "hospital": "Westlands Specialists",
      "hospitalEmail": "admin@westlandsspecialists.com",
      "location": "Parklands, Nairobi",
      "itemCount": 3,
      "totalAmount": 42100.50,
      "requestedAt": "Jan 10, 08:45 AM",
      "approvedAt": "Jan 11, 04:20 PM",
      "items": [
        {
          "name": "Pacemaker Gen-X",
          "quantityRequested": 1,
          "subtotal": 30000.00
        },
        {
          "name": "MRI Contrast Agent",
          "quantityRequested": 20,
          "subtotal": 12000.00
        },
        {
          "name": "Sterile Drape Sheets",
          "quantityRequested": 50,
          "subtotal": 100.50
        }
      ]
    },
    {
      "requestId": "REQ-4450",
      "hospital": "Nairobi North Hospital",
      "hospitalEmail": "billing@nairobinorth.co.ke",
      "location": "Githurai, Nairobi",
      "itemCount": 2,
      "totalAmount": 19800.00,
      "requestedAt": "Jan 14, 09:00 AM",
      "approvedAt": "Jan 15, 10:30 AM",
      "items": [
        {
          "name": "Titanium Hip Implant",
          "quantityRequested": 1,
          "subtotal": 12400.00
        },
        {
          "name": "Saline 0.9% 500ml",
          "quantityRequested": 200,
          "subtotal": 7400.00
        }
      ]
    }
  ]

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
        document.getElementById('billingEmail').value = request.hospitalEmail

        handleOverlay(payOverlayElem)
      })
    })
})