import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "./overlay.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  const orders = [
    {
      orderId: "ORD-101",
      institutionName: "Kenyatta National Hospital",
      destination: "Upper Hill, Nairobi",
      creationDate: "2026-01-10",
      paymentDate: "2026-01-12",
      delivered: "No",
      packages: [
        { packageId: "ORD-101-R", itemCount: 12, processing: "Yes", ready: "Yes", inTransit: "No", completed: "No" },
        { packageId: "ORD-101-A", itemCount: 45, processing: "Yes", ready: "Yes", inTransit: "No", completed: "No" }
      ]
    },
    {
      orderId: "ORD-102",
      institutionName: "Aga Khan Hospital",
      destination: "Parklands, Nairobi",
      creationDate: "2026-01-11",
      paymentDate: "2026-01-11",
      delivered: "Yes",
      packages: [
        { packageId: "ORD-102-F", itemCount: 5, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "Yes" }
      ]
    },
    {
      orderId: "ORD-103",
      institutionName: "The Karen Hospital",
      destination: "Karen, Nairobi",
      creationDate: "2026-01-12",
      paymentDate: "2026-01-12",
      delivered: "No",
      packages: [
        { packageId: "ORD-103-C", itemCount: 30, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "No" }
      ]
    },
    {
      orderId: "ORD-104",
      institutionName: "Machakos Level 5",
      destination: "Machakos Town, Machakos",
      creationDate: "2026-01-14",
      paymentDate: "2026-01-14",
      delivered: "No",
      packages: [
        { packageId: "ORD-104-A", itemCount: 110, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "No" },
        { packageId: "ORD-104-R", itemCount: 8, processing: "Yes", ready: "Yes", inTransit: "No", completed: "No" }
      ]
    },
    {
      orderId: "ORD-105",
      institutionName: "MP Shah Hospital",
      destination: "Parklands, Nairobi",
      creationDate: "2026-01-14",
      paymentDate: "2026-01-14",
      delivered: "No",
      packages: [
        { packageId: "ORD-105-C", itemCount: 15, processing: "Yes", ready: "No", inTransit: "No", completed: "No" }
      ]
    },
    {
      orderId: "ORD-106",
      institutionName: "Kikuyu General Hospital",
      destination: "Kikuyu, Kiambu",
      creationDate: "2026-01-13",
      paymentDate: "2026-01-13",
      delivered: "No",
      packages: [
        { packageId: "ORD-106-A", itemCount: 60, processing: "Yes", ready: "Yes", inTransit: "No", completed: "No" }
      ]
    },
    {
      orderId: "ORD-107",
      institutionName: "Nairobi Women's Hospital",
      destination: "Hurlingham, Nairobi",
      creationDate: "2026-01-14",
      paymentDate: "2026-01-14",
      delivered: "No",
      packages: [
        { packageId: "ORD-107-F", itemCount: 4, processing: "Yes", ready: "Yes", inTransit: "No", completed: "No" },
        { packageId: "ORD-107-R", itemCount: 10, processing: "Yes", ready: "No", inTransit: "No", completed: "No" }
      ]
    },
    {
      orderId: "ORD-108",
      institutionName: "Gertrude's Children's Hospital",
      destination: "Muthaiga, Nairobi",
      creationDate: "2026-01-09",
      paymentDate: "2026-01-09",
      delivered: "Yes",
      packages: [
        { packageId: "ORD-108-A", itemCount: 25, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "Yes" },
        { packageId: "ORD-108-C", itemCount: 12, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "Yes" }
      ]
    },
    {
      orderId: "ORD-109",
      institutionName: "Thika Level 5 Hospital",
      destination: "Thika Town, Kiambu",
      creationDate: "2026-01-14",
      paymentDate: "2026-01-14",
      delivered: "No",
      packages: [
        { packageId: "ORD-109-R", itemCount: 40, processing: "Yes", ready: "Yes", inTransit: "Yes", completed: "No" }
      ]
    },
    {
      orderId: "ORD-110",
      institutionName: "Mater Misericordiae Hospital",
      destination: "South B, Nairobi",
      creationDate: "2026-01-14",
      paymentDate: "2026-01-14",
      delivered: "No",
      packages: [
        { packageId: "ORD-110-A", itemCount: 85, processing: "No", ready: "No", inTransit: "No", completed: "No" }
      ]
    }
  ];

  // Display all the orders in the table
  const tblRowFragment = document.createDocumentFragment()
  orders.forEach(ord => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td class="order-id"><strong>${ord.orderId}</strong></td>
      <td>
        <strong>${ord.institutionName}</strong><br>
        <small>${ord.destination}</small>
      </td>
      <td class="js-packages-${ord.orderId}"></td>
      <td>${ord.creationDate}</td>
      <td>${ord.paymentDate}</td>
      <td><span class="deliv-${ord.delivered.toLowerCase()}">${ord.delivered}</span></td>
      <td><button class="view-btn js-view-btn" data-order-id="${ord.orderId}">Details</button></td>
    `

    const packagesCol = tblRow.querySelector(`.js-packages-${ord.orderId}`)

    ord.packages.forEach(pkg => {
      const storageTemp = pkg.packageId.slice(-1)
      const badge = document.createElement('span')
      badge.className = `badge ${storageTemp}`
      badge.textContent = storageTemp

      packagesCol.appendChild(badge)
    })

    tblRowFragment.appendChild(tblRow)
  })

  document.querySelector('.js-orders-table')
    .appendChild(tblRowFragment)

  // Controls when to display the overlay and close it 
  const overlay = document.getElementById('packages-overlay')
  document.querySelectorAll('.js-view-btn')
    .forEach(detailBtn => {
      detailBtn.addEventListener('click', () => {
        overlay.classList.add('active')
        const btnOrdId = detailBtn.dataset.orderId
        const packagesTableElem = document.querySelector('.js-packages-table')

        document.querySelector('.details-header .order-id')
          .textContent = btnOrdId

        orders.forEach(ord => {
          const orderId = ord.orderId

          if (btnOrdId === orderId) {
            const orgName = ord.institutionName
            document.querySelector('.js-destination')
              .textContent = orgName
            packagesTableElem.innerHTML = ``

            const packagesFragment = document.createDocumentFragment()

            ord.packages.forEach(pkg => {
              const row = document.createElement('tr')

              row.innerHTML = `
                <td><strong>${pkg.packageId}</strong></td>
                <td>${pkg.itemCount}</td>
                <td><span class="p-${pkg.processing.toLowerCase()}">${pkg.processing}</span></td>
                <td><span class="p-${pkg.ready.toLowerCase()}">${pkg.ready}</span></td>
                <td><span class="p-${pkg.inTransit.toLowerCase()}">${pkg.inTransit}</span></td>
                <td><span class="p-${pkg.completed.toLowerCase()}">${pkg.completed}</span></td>
              `
              packagesFragment.appendChild(row)
            })

            packagesTableElem.appendChild(packagesFragment)

          }

          xRemoveOverlay(overlay)
          clickToRemoveOverlay(overlay)
        })
      })
    })
})