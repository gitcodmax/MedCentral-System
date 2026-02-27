import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="page-title">
        <h2>Order & Request History</h2>
      </div> 
    `

  /**
   * MedCentral Warehouse - Order & Request Mock Data (Balanced Distribution)
   * - Diversified: mix of 1, 2, 3, and 4 package shipments.
   * - Min Items: 2 items per package.
   * - Max Packages: 4 (A, C, R, F).
   */

  const OrdersMockData = [
    {
      requestId: "REQ-9901",
      orderId: "ORD-5501",
      hospitalName: "St. Mary's General Hospital",
      requestDate: "2026-02-20",
      paymentDate: "2026-02-21",
      totalItems: 12,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5501-A",
          storageCode: "A",
          status: "completed",
          assignedClerk: "Sarah Connor",
          assignedDriver: "John Doe",
          items: [
            { name: "Latex Gloves", qty: 20, uom: "Box" },
            { name: "Surgical Tape", qty: 50, uom: "Roll" },
            { name: "Gauze Pads", qty: 100, uom: "Pack" }
          ]
        },
        {
          packageId: "PKG-5501-C",
          storageCode: "C",
          status: "delivered",
          assignedClerk: "Mike Ross",
          assignedDriver: "John Doe",
          items: [
            { name: "Paracetamol 500mg", qty: 100, uom: "Strip" },
            { name: "Amoxicillin 500mg", qty: 40, uom: "Strip" },
            { name: "Ibuprofen 400mg", qty: 60, uom: "Strip" }
          ]
        },
        {
          packageId: "PKG-5501-R",
          storageCode: "R",
          status: "completed",
          assignedClerk: "Sarah Connor",
          assignedDriver: "John Doe",
          items: [
            { name: "Insulin Glargine", qty: 20, uom: "Vial" },
            { name: "Oxytocin 10IU", qty: 30, uom: "Ampoule" },
            { name: "Hepatitis B Vaccine", qty: 50, uom: "Vial" }
          ]
        },
        {
          packageId: "PKG-5501-F",
          storageCode: "F",
          status: "completed",
          assignedClerk: "Elena Fisher",
          assignedDriver: "John Doe",
          items: [
            { name: "Fresh Frozen Plasma", qty: 10, uom: "Unit" },
            { name: "Stem Cell Vials", qty: 4, uom: "Vial" },
            { name: "Cryoprecipitate", qty: 5, uom: "Unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9902",
      orderId: "ORD-5502",
      hospitalName: "City Children's Clinic",
      requestDate: "2026-02-22",
      paymentDate: "2026-02-23",
      totalItems: 9,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5502-R",
          storageCode: "R",
          status: "delivered",
          assignedClerk: "Elena Fisher",
          assignedDriver: "Amos Burton",
          items: [
            { name: "Measles Vaccine", qty: 100, uom: "Vial" },
            { name: "BCG Vaccine", qty: 50, uom: "Vial" },
            { name: "Polio Oral Vaccine", qty: 200, uom: "Vial" }
          ]
        },
        {
          packageId: "PKG-5502-A",
          storageCode: "A",
          status: "delivered",
          assignedClerk: "Sarah Connor",
          assignedDriver: "Amos Burton",
          items: [
            { name: "Pediatric Syringes", qty: 500, uom: "Piece" },
            { name: "Alcohol Swabs", qty: 10, uom: "Box" }
          ]
        },
        {
          packageId: "PKG-5502-C",
          storageCode: "C",
          status: "delivered",
          assignedClerk: "Mike Ross",
          assignedDriver: "Amos Burton",
          items: [
            { name: "Child-Size Masks", qty: 200, uom: "Piece" },
            { name: "Hand Sanitizer 100ml", qty: 50, uom: "Bottle" },
            { name: "Pediatric Ibuprofen", qty: 30, uom: "Bottle" },
            { name: "Thermometer Covers", qty: 5, uom: "Box" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9903",
      orderId: "ORD-5503",
      hospitalName: "Metropolitan Medical Center",
      requestDate: "2026-02-24",
      paymentDate: "2026-02-24",
      totalItems: 6,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5503-C",
          storageCode: "C",
          status: "delivered-with-issues",
          assignedClerk: "Harvey Specter",
          assignedDriver: "James Holden",
          items: [
            { name: "Normal Saline 500ml", qty: 50, uom: "Bottle" },
            { name: "Dextrose 5% 500ml", qty: 40, uom: "Bottle" },
            { name: "IV Giving Sets", qty: 100, uom: "Unit" }
          ]
        },
        {
          packageId: "PKG-5503-A",
          storageCode: "A",
          status: "delivered",
          assignedClerk: "Harvey Specter",
          assignedDriver: "James Holden",
          items: [
            { name: "IV Cannula 22G", qty: 200, uom: "Piece" },
            { name: "Medical Tape", qty: 50, uom: "Roll" },
            { name: "Tourniquets", qty: 10, uom: "Unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9904",
      orderId: "ORD-5504",
      hospitalName: "Hope Wellness Hub",
      requestDate: "2026-02-25",
      paymentDate: "2026-02-25",
      totalItems: 7,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5504-F",
          storageCode: "F",
          status: "delayed",
          assignedClerk: "Mike Ross",
          assignedDriver: "John Doe",
          items: [
            { name: "Frozen Skin Grafts", qty: 2, uom: "Unit" },
            { name: "Bone Morphogenetic Protein", qty: 5, uom: "Vial" }
          ]
        },
        {
          packageId: "PKG-5504-R",
          storageCode: "R",
          status: "dispatched",
          assignedClerk: "Mike Ross",
          assignedDriver: "John Doe",
          items: [
            { name: "Botulinum Toxin", qty: 10, uom: "Vial" },
            { name: "Epinephrine 1:1000", qty: 20, uom: "Ampoule" },
            { name: "Hydrocortisone Inj", qty: 15, uom: "Vial" }
          ]
        },
        {
          packageId: "PKG-5504-C",
          storageCode: "C",
          status: "packed",
          assignedClerk: "Mike Ross",
          assignedDriver: null,
          items: [
            { name: "Disposable Gowns", qty: 50, uom: "Piece" },
            { name: "N95 Respirators", qty: 100, uom: "Piece" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9905",
      orderId: "ORD-5505",
      hospitalName: "Westside Orthopedic",
      requestDate: "2026-02-25",
      paymentDate: "2026-02-26",
      totalItems: 4,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5505-A",
          storageCode: "A",
          status: "dispatched",
          assignedClerk: "Sarah Connor",
          assignedDriver: "Amos Burton",
          items: [
            { name: "Knee Braces (M)", qty: 5, uom: "Unit" },
            { name: "Elastic Bandages", qty: 50, uom: "Roll" },
            { name: "Crutches (Pair)", qty: 10, uom: "Unit" },
            { name: "Ankle Support", qty: 8, uom: "Unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9906",
      orderId: "ORD-5506",
      hospitalName: "Green Valley Rehab",
      requestDate: "2026-02-26",
      paymentDate: "2026-02-26",
      totalItems: 5,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5506-C",
          storageCode: "C",
          status: "packed",
          assignedClerk: "Elena Fisher",
          assignedDriver: "James Holden",
          items: [
            { name: "Latex Gloves (M)", qty: 20, uom: "Box" },
            { name: "Alcohol Swabs", qty: 10, uom: "Box" },
            { name: "Adhesive Bandages", qty: 15, uom: "Box" }
          ]
        },
        {
          packageId: "PKG-5506-A",
          storageCode: "A",
          status: "completed",
          assignedClerk: "Elena Fisher",
          assignedDriver: "Noah MIles",
          items: [
            { name: "Medical Tape", qty: 30, uom: "Roll" },
            { name: "Cotton Balls", qty: 50, uom: "Bag" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9907",
      orderId: "ORD-5507",
      hospitalName: "Central Health Institute",
      requestDate: "2026-02-26",
      paymentDate: "2026-02-27",
      totalItems: 4,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-5507-R",
          storageCode: "R",
          status: "processing",
          assignedClerk: "Harvey Specter",
          assignedDriver: null,
          items: [
            { name: "Tetanus Antitoxin", qty: 15, uom: "Ampoule" },
            { name: "Rabies Vaccine", qty: 10, uom: "Vial" }
          ]
        },
        {
          packageId: "PKG-5507-F",
          storageCode: "F",
          status: "approved",
          assignedClerk: null,
          assignedDriver: null,
          items: [
            { name: "Snake Antivenom", qty: 5, uom: "Vial" },
            { name: "Varicella Vaccine", qty: 20, uom: "Vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9908",
      orderId: "ORD-5508",
      hospitalName: "Northside Emergency",
      requestDate: "2026-02-27",
      paymentDate: null,
      totalItems: 6,
      isRejected: false,
      packages: [
        {
          packageId: "PKG-TEMP-99",
          storageCode: "C",
          status: "completed",
          assignedClerk: "Kimani Robert",
          assignedDriver: "Chris Turker",
          items: [
            { name: "Paracetamol 500mg", qty: 30, uom: "Strip" },
            { name: "Ibuprofen 400mg", qty: 20, uom: "Strip" },
            { name: "Diclofenac Gel", qty: 10, uom: "Unit" }
          ]
        },
        {
          packageId: "PKG-TEMP-98",
          storageCode: "A",
          status: "completed",
          assignedClerk: "John Snow",
          assignedDriver: "Maria Espanoza",
          items: [
            { name: "Surgical Blades #11", qty: 100, uom: "Piece" },
            { name: "Sutures 3-0 Silk", qty: 50, uom: "Unit" },
            { name: "Sterile Drape", qty: 20, uom: "Piece" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9909",
      orderId: null,
      hospitalName: "Riverside Community Clinic",
      requestDate: "2026-02-27",
      paymentDate: null,
      totalItems: 3,
      isRejected: true,
      packages: [
        {
          packageId: "PEND-01",
          storageCode: "C",
          status: "pending",
          assignedClerk: null,
          assignedDriver: null,
          items: [
            { name: "Hand Sanitizer 500ml", qty: 8, uom: "Bottle" },
            { name: "Liquid Soap 1L", qty: 12, uom: "Bottle" },
            { name: "Paper Towels", qty: 50, uom: "Roll" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-9910",
      orderId: null,
      hospitalName: "Private Care Center",
      requestDate: "2026-02-15",
      paymentDate: null,
      totalItems: 2,
      isRejected: false,
      packages: [
        {
          packageId: "PEND-02",
          storageCode: "C",
          status: "pending",
          assignedClerk: null,
          assignedDriver: null,
          items: [
            { name: "Adhesive Tape", qty: 10, uom: "Roll" },
            { name: "Zinc Oxide Cream", qty: 5, uom: "Unit" }
          ]
        }
      ]
    }
  ];

  const StorageConfig = {
    "A": {
      code: "A",
      label: "Ambient",
      cssClass: "fa-solid fa-house-medical-circle-check"
    },
    "C": {
      code: "C",
      label: "Common Room Temp",
      cssClass: "fas fa-thermometer-half"
    },
    "R": {
      code: "R",
      label: "Refrigerated",
      cssClass: "fas fa-snowflake"
    },
    "F": {
      code: "F",
      label: "Frozen",
      cssClass: "fas fa-icicles"
    }
  };

  const ordersTbodyElem = document.getElementById('ordersTbody')

  const ordersTableFrag = document.createDocumentFragment()
  OrdersMockData.forEach(ord => {
    const tblRow = document.createElement('tr')
    tblRow.innerHTML = `
      <td>
        <div class="id-stack">
          <span class="req-id">${ord.requestId}</span>
          <span class="ord-id">${!ord.orderId ? '---' : ord.orderId}</span>
        </div>
      </td>
      <td class="hospital-name">${ord.hospitalName}</td>
      <td>${ord.requestDate}</td>
      <td>
        ${displayPackages(ord.requestId, 'packages')}
      </td>
      <td>
        <div class="items-display">${ord.totalItems}</div>
      </td>
      <td>${displayPackages(ord.requestId, 'completed')}</td>
      <td>
        <div class="action-btns">
          <button class="
            ${ord.isRejected ? "rejected-ord-btn" : 'btn-icon btn-view js-view-ord-details-btn'}" 
            data-req-id=${ord.requestId} title="${ord.isRejected ? "REJECTED" : 'View Details'}" 
            ${ord.isRejected ? "disabled" : ''}>
            ${ord.isRejected ? "REJECTED" : 'View'}
          </button>
        </div>
      </td>
    `

    ordersTableFrag.appendChild(tblRow)
  })

  ordersTbodyElem.appendChild(ordersTableFrag)

  // Displays the packages badges
  function displayPackages(reqId, columnName) {
    const orderData = OrdersMockData.find(ord => reqId === ord.requestId)
    if (!orderData) return ''

    const htmlArr = orderData.packages.map(pkg => {
      let badgeStatus = ``
      if (orderData.isRejected) {
        badgeStatus = 'red-badge'
      } else if (pkg.status !== 'completed') {
        badgeStatus = 'grey-badge'
      }
      if (columnName === 'packages') {
        return `<span class="badge ${pkg.storageCode} 
        ${orderData.isRejected ? "red-badge" : ''}">${pkg.storageCode}</span>`
      } else if (columnName === 'completed') {
        return `<span class="badge ${pkg.storageCode} 
        ${badgeStatus}">${pkg.storageCode}</span>`
      }
    })

    return htmlArr.join('')
  }

  // Helper to get storage details safely
  function getStorageDetails(code) {
    return StorageConfig[code] || { label: "Unknown", cssClass: "tag-default", icon: "fas fa-question" };
  }

  // Show the order details
  ordersTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('js-view-ord-details-btn')) {
      const orderDetailsOverlayElem = document.getElementById('orderDetailsOverlay')
      handleOverlay(orderDetailsOverlayElem)

      const pkgListOverlayElem = document.getElementById('pkgListOverlay')
      pkgListOverlayElem.innerHTML = ``

      const ordData = OrdersMockData.find(ord => ord.requestId === btn.dataset.reqId)
      document.getElementById('reqIdOverlay')
        .textContent = ordData.requestId
      document.getElementById('ordIdOverlay')
        .textContent = `${!ordData.orderId ? '---' : ordData.orderId}`
      document.getElementById('hosNameOv')
        .textContent = ordData.hospitalName
      document.getElementById('reqDateOv')
        .textContent = ordData.requestDate
      document.getElementById('payDateOv')
        .textContent = ordData.paymentDate
      document.getElementById('pkgsCount')
        .textContent = `${ordData.packages.length} 
          Package${ordData.packages.length > 1 ? 's' : ''}`
      document.getElementById('itemsCount')
        .textContent = `${ordData.totalItems} 
        Item${ordData.totalItems > 1 ? 's' : ''}`

      const pkgsListFrag = document.createDocumentFragment()
      ordData.packages.forEach(pkg => {
        const storageTempDetails = getStorageDetails(pkg.storageCode)
        const divElem = document.createElement('div')
        divElem.className = `package-card`

        // Build item rows from this package's items
        const itemRowsHtml = pkg.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.uom}</td>
          </tr>
        `).join('')

        divElem.innerHTML = `
          <div class="package-card-header">
            <div>
              <span class="label">Package ID</span>
              <strong class="view-pkg-id">${pkg.packageId}</strong>
            </div>
            <div>
              <span class="label">Packed By:</span>
              <strong class="clerk-name">${!pkg.assignedClerk ? '---' : pkg.assignedClerk}</strong>
            </div>
            <div>
              <span class="label">Delivered By:</span>
              <strong class="clerk-name">${!pkg.assignedDriver ? '---' : pkg.assignedDriver}</strong>
            </div>
            <div class="pkg-type">
              <span class="storage-temp"><i class="${storageTempDetails.cssClass}"></i> 
                ${storageTempDetails.label}
              </span>
            </div>
            <div class="pkg-status">
              <span class="status-pill status-${pkg.status.toLowerCase()}">${pkg.status.replaceAll('-', ' ')}</span>
            </div>
          </div>

          <div class="package-items">
            <table class="item-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                ${itemRowsHtml}
              </tbody>
            </table>
          </div>
        `

        pkgsListFrag.appendChild(divElem)
      })

      pkgListOverlayElem.appendChild(pkgsListFrag)
    }
  })
})