import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  const orderHistoryData = [
    {
      requestId: "REQ-2026-05521",
      orderId: "ORD-99820",
      dateInitiated: "Jan 31, 2026",
      paymentDate: "Feb 01, 2026",
      deliveryDate: "Feb 03, 2026",
      totalValue: 110450.00,
      packages: [
        {
          packageId: "PKG-5521-A",
          storageTemp: "Refrigerated",
          status: "completed",
          items: [
            { name: "Insulin Glargine", quantity: 12, uom: "vial" },
            { name: "Hepatitis B Vaccine", quantity: 5, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-5521-B",
          storageTemp: "Ambient",
          status: "delivered",
          items: [
            { name: "Paracetamol 500mg", quantity: 500, uom: "tablet" },
            { name: "Ibuprofen 200mg", quantity: 200, uom: "tablet" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05540",
      orderId: null,
      dateInitiated: "Feb 02, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 45200.00,
      packages: [
        {
          packageId: "PKG-5540-A",
          storageTemp: "Crt",
          status: "pending",
          items: [
            { name: "Saline Solution 500ml", quantity: 50, uom: "vial" },
            { name: "Dextrose 5% 500ml", quantity: 20, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05555",
      orderId: "ORD-99855",
      dateInitiated: "Feb 04, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: null,
      totalValue: 12500.00,
      packages: [
        {
          packageId: "PKG-5555-A",
          storageTemp: "Frozen",
          status: "dispatched",
          items: [
            { name: "Specialized Plasma", quantity: 5, uom: "bag" },
            { name: "Cryoprecipitate", quantity: 2, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05601",
      orderId: "ORD-99901",
      dateInitiated: "Feb 05, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: "Feb 06, 2026",
      totalValue: 215000.00,
      packages: [
        {
          packageId: "PKG-5601-A",
          storageTemp: "Ambient",
          status: "delivered with issues",
          items: [
            { name: "Surgical Drapes", quantity: 100, uom: "unit" },
            { name: "Scalpel Blades", quantity: 50, uom: "unit" },
            { name: "Suture Silk 3-0", quantity: 30, uom: "pack" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05612",
      orderId: "ORD-99912",
      dateInitiated: "Feb 06, 2026",
      paymentDate: "Feb 06, 2026",
      deliveryDate: null,
      totalValue: 88400.00,
      packages: [
        {
          packageId: "PKG-5612-A",
          storageTemp: "Refrigerated",
          status: "delayed",
          items: [
            { name: "COVID-19 Testing Kits", quantity: 200, uom: "kit" },
            { name: "Reagent Buffer Alpha", quantity: 10, uom: "bottle" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05625",
      orderId: null,
      dateInitiated: "Feb 07, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 32100.00,
      packages: [
        {
          packageId: "PKG-5625-A",
          storageTemp: "Ambient",
          status: "rejected",
          items: [
            { name: "Baby Diapers (S)", quantity: 500, uom: "unit" },
            { name: "Baby Diapers (M)", quantity: 500, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05640",
      orderId: "ORD-99940",
      dateInitiated: "Feb 08, 2026",
      paymentDate: "Feb 08, 2026",
      deliveryDate: null,
      totalValue: 15600.00,
      packages: [
        {
          packageId: "PKG-5640-A",
          storageTemp: "Crt",
          status: "packed",
          items: [
            { name: "Adrenaline Auto-injectors", quantity: 20, uom: "unit" },
            { name: "Atropine Sulphate", quantity: 50, uom: "ampoule" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05655",
      orderId: "ORD-99955",
      dateInitiated: "Feb 09, 2026",
      paymentDate: "Feb 10, 2026",
      deliveryDate: null,
      totalValue: 4500.00,
      packages: [
        {
          packageId: "PKG-5655-A",
          storageTemp: "Ambient",
          status: "processing",
          items: [
            { name: "X-Ray Film 14x17", quantity: 5, uom: "pack" },
            { name: "X-Ray Film 10x12", quantity: 5, uom: "pack" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05670",
      orderId: "ORD-99970",
      dateInitiated: "Feb 10, 2026",
      paymentDate: "Feb 11, 2026",
      deliveryDate: null,
      totalValue: 540000.00,
      packages: [
        {
          packageId: "PKG-5670-A",
          storageTemp: "Frozen",
          status: "approved",
          items: [
            { name: "MMR Vaccines", quantity: 400, uom: "vial" },
            { name: "Varicella Vaccines", quantity: 100, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05682",
      orderId: "ORD-99982",
      dateInitiated: "Feb 11, 2026",
      paymentDate: "Feb 11, 2026",
      deliveryDate: "Feb 12, 2026",
      totalValue: 22800.00,
      packages: [
        {
          packageId: "PKG-5682-A",
          storageTemp: "Ambient",
          status: "completed",
          items: [
            { name: "N95 Masks", quantity: 300, uom: "unit" },
            { name: "Face Shields", quantity: 100, uom: "unit" },
            { name: "Hand Sanitizer 500ml", quantity: 50, uom: "bottle" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05695",
      orderId: null,
      dateInitiated: "Feb 12, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 95000.00,
      packages: [
        {
          packageId: "PKG-5695-A",
          storageTemp: "Crt",
          status: "pending",
          items: [
            { name: "Dialysate Solution A", quantity: 30, uom: "container" },
            { name: "Dialysate Solution B", quantity: 30, uom: "container" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-05710",
      orderId: "ORD-100010",
      dateInitiated: "Feb 13, 2026",
      paymentDate: "Feb 13, 2026",
      deliveryDate: null,
      totalValue: 67200.00,
      packages: [
        {
          packageId: "PKG-5710-A",
          storageTemp: "Ambient",
          status: "packed",
          items: [
            { name: "Amoxicillin 250mg", quantity: 100, uom: "bottle" },
            { name: "Metronidazole 400mg", quantity: 50, uom: "pack" }
          ]
        },
        {
          packageId: "PKG-5710-B",
          storageTemp: "Refrigerated",
          status: "packed",
          items: [
            { name: "Amoxicillin Suspension", quantity: 50, uom: "bottle" },
            { name: "Ceftriaxone Injection", quantity: 100, uom: "vial" }
          ]
        }
      ]
    }
  ];

  const ordTbodyFragment = document.createDocumentFragment()
  orderHistoryData.forEach((reqOrd) => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td>
        <div class="id-stack">
          <span class="req-id" title="Request ID">${reqOrd.requestId}</span>
          <span class="ord-id" title="Order ID">
            ${!reqOrd.orderId ? '<small><i>Pending Approval</i></small>' : reqOrd.orderId}
          </span>
        </div>
      </td>
      <td>
        <div class="package-count">
          <span class="badge A">A</span>
          <span class="badge F">F</span>
          <span class="badge C">C</span>
        </div>
      </td>
      <td>${reqOrd.dateInitiated}</td>
      <td>${!reqOrd.paymentDate ? '---' : reqOrd.paymentDate}</td>
      <td>${!reqOrd.deliveryDate ? '---' : reqOrd.deliveryDate}</td>
      <td class="price-cell">KES ${reqOrd.totalValue}</td>
      <td>
        <span class="badge A">A</span>
        <span class="badge F">F</span>
        <span class="badge C">C</span>
      </td>
      <td>
        <button class="btn-view-packages">
          View Packages
        </button>
      </td>
    `
    
    ordTbodyFragment.appendChild(tblRow)
  })

  document.getElementById('orderTableBody')
    .appendChild(ordTbodyFragment)

  const drawerElem = document.getElementById('packageDrawer')
  document.querySelector('.js-ord-tbl')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      if (btn.classList.contains('btn-view-packages')) {
        drawerElem.classList.add('open')

        document.querySelector('.js-btn-close-drawer')
          .addEventListener('click', () => {
            drawerElem.classList.remove('open')
          })
      }
    })

  //Check if the click is inside an element(returns True/False)
  function isClickInsideOrChildOf(element, clickTarget) {
    return element === clickTarget || element.contains(clickTarget);
  }

  //Closes the drawer overlay when the click is outside it
  document.querySelector('.app-content')
    .addEventListener('pointerdown', (e) => {
      const clickInside = isClickInsideOrChildOf(drawerElem, e.target)

      if (!clickInside) {
        drawerElem.classList.remove('open')
      }
    })
})