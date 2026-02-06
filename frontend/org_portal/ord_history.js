import { renderSidebar } from "./sidebar.js";

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

  const orderHistoryData = [
    {
      requestId: "REQ-2026-06100",
      orderId: "ORD-100200",
      dateInitiated: "Feb 01, 2026",
      paymentDate: "Feb 02, 2026",
      deliveryDate: null,
      totalValue: 842000.00,
      packages: [
        {
          packageId: "PKG-6100-A", storageTemp: "Frozen", status: "dispatched",
          items: [
            { name: "Fresh Frozen Plasma", quantity: 10, uom: "unit" },
            { name: "Cryoprecipitate", quantity: 5, uom: "unit" },
            { name: "Stem Cell Vials", quantity: 2, uom: "vial" },
            { name: "Frozen Bone Graft", quantity: 1, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6100-B", storageTemp: "Refrigerated", status: "packed",
          items: [
            { name: "Insulin Aspart", quantity: 50, uom: "vial" },
            { name: "Tetanus Antitoxin", quantity: 20, uom: "ampoule" },
            { name: "Hepatitis B Vaccine", quantity: 40, uom: "vial" },
            { name: "Oxytocin Injection", quantity: 100, uom: "ampoule" }
          ]
        },
        {
          packageId: "PKG-6100-C", storageTemp: "Ambient", status: "processing",
          items: [
            { name: "Surgical Gowns", quantity: 200, uom: "unit" },
            { name: "Sterile Drape Sheets", quantity: 150, uom: "unit" },
            { name: "Face Masks (N95)", quantity: 500, uom: "unit" },
            { name: "Surgical Caps", quantity: 300, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6100-D", storageTemp: "Crt", status: "approved",
          items: [
            { name: "Saline 0.9% 1L", quantity: 100, uom: "bag" },
            { name: "Ringer's Lactate 500ml", quantity: 80, uom: "bag" },
            { name: "Dextrose 5% 1L", quantity: 50, uom: "bag" },
            { name: "Sterile Water 10ml", quantity: 200, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06105",
      orderId: "ORD-100205",
      dateInitiated: "Feb 01, 2026",
      paymentDate: "Feb 01, 2026",
      deliveryDate: "Feb 03, 2026",
      totalValue: 12500.00,
      packages: [
        {
          packageId: "PKG-6105-A", storageTemp: "Ambient", status: "completed",
          items: [{ name: "Hand Sanitizer 5L", quantity: 5, uom: "jerrycan" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06110",
      orderId: "ORD-100210",
      dateInitiated: "Feb 02, 2026",
      paymentDate: "Feb 02, 2026",
      deliveryDate: null,
      totalValue: 95400.00,
      packages: [
        {
          packageId: "PKG-6110-A", storageTemp: "Refrigerated", status: "dispatched",
          items: [
            { name: "Atracurium Injection", quantity: 50, uom: "ampoule" },
            { name: "Propofol 1% 20ml", quantity: 100, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6110-B", storageTemp: "Crt", status: "dispatched",
          items: [
            { name: "Cannula 20G", quantity: 200, uom: "unit" },
            { name: "IV Giving Sets", quantity: 150, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06120",
      orderId: null,
      dateInitiated: "Feb 02, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 245000.00,
      packages: [
        {
          packageId: "PKG-6120-A", storageTemp: "Ambient", status: "pending",
          items: [
            { name: "Examination Gloves (M)", quantity: 50, uom: "box" },
            { name: "Examination Gloves (L)", quantity: 50, uom: "box" },
            { name: "Alcohol Swabs", quantity: 5000, uom: "unit" },
            { name: "Wooden Tongue Depressors", quantity: 1000, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6120-R", storageTemp: "Refrigerated", status: "pending",
          items: [
            { name: "Povidone Iodine 500ml", quantity: 20, uom: "bottle" },
            { name: "Hydrogen Peroxide", quantity: 10, uom: "bottle" },
            { name: "Surgical Spirit", quantity: 25, uom: "bottle" },
            { name: "Chlorhexidine Gluconate", quantity: 15, uom: "bottle" }
          ]
        },
        {
          packageId: "PKG-6120-C", storageTemp: "Crt", status: "pending",
          items: [
            { name: "Gauze Swabs 10x10", quantity: 100, uom: "pack" },
            { name: "Crepe Bandage 10cm", quantity: 50, uom: "roll" },
            { name: "Adhesive Tape 2.5cm", quantity: 40, uom: "roll" },
            { name: "Orthopedic Padding", quantity: 30, uom: "roll" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06130",
      orderId: "ORD-100230",
      dateInitiated: "Feb 03, 2026",
      paymentDate: "Feb 03, 2026",
      deliveryDate: null,
      totalValue: 56000.00,
      packages: [
        {
          packageId: "PKG-6130-A", storageTemp: "Frozen", status: "delayed",
          items: [
            { name: "Yellow Fever Vaccine", quantity: 100, uom: "vial" },
            { name: "Oral Polio Vaccine", quantity: 150, uom: "vial" },
            { name: "Measles Vaccine", quantity: 80, uom: "vial" },
            { name: "BCG Vaccine", quantity: 120, uom: "vial" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06140",
      orderId: "ORD-100240",
      dateInitiated: "Feb 03, 2026",
      paymentDate: "Feb 04, 2026",
      deliveryDate: "Feb 06, 2026",
      totalValue: 12000.00,
      packages: [
        {
          packageId: "PKG-6140-A", storageTemp: "Ambient", status: "delivered with issues",
          items: [{ name: "Patient Files", quantity: 500, uom: "unit" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06150",
      orderId: "ORD-100250",
      dateInitiated: "Feb 04, 2026",
      paymentDate: "Feb 04, 2026",
      deliveryDate: null,
      totalValue: 312000.00,
      packages: [
        {
          packageId: "PKG-6150-A", storageTemp: "Refrigerated", status: "packed",
          items: [
            { name: "Lab Reagent Kit Alpha", quantity: 4, uom: "kit" },
            { name: "Lab Reagent Kit Beta", quantity: 2, uom: "kit" },
            { name: "Calibration Fluid", quantity: 10, uom: "vial" },
            { name: "Control Serum", quantity: 8, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6150-B", storageTemp: "Ambient", status: "packed",
          items: [
            { name: "Microscope Slides", quantity: 10, uom: "box" },
            { name: "Glass Beakers 250ml", quantity: 20, uom: "unit" },
            { name: "Pipettes 10ml", quantity: 100, uom: "unit" },
            { name: "Test Tube Racks", quantity: 5, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6150-C", storageTemp: "Crt", status: "packed",
          items: [
            { name: "Distilled Water 5L", quantity: 10, uom: "jerrycan" },
            { name: "Formalin 10% Solution", quantity: 5, uom: "bottle" },
            { name: "Xylene Solution", quantity: 2, uom: "bottle" },
            { name: "Paraffin Wax", quantity: 20, uom: "kg" }
          ]
        },
        {
          packageId: "PKG-6150-F", storageTemp: "Frozen", status: "approved",
          items: [
            { name: "Lab Coats (L)", quantity: 10, uom: "unit" },
            { name: "Biohazard Bags (L)", quantity: 500, uom: "unit" },
            { name: "Sharp Containers 5L", quantity: 20, uom: "unit" },
            { name: "Safety Goggles", quantity: 15, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06160",
      orderId: null,
      dateInitiated: "Feb 04, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 15000.00,
      packages: [
        {
          packageId: "PKG-6160-A", storageTemp: "Ambient", status: "rejected",
          items: [{ name: "Printer Toner (Black)", quantity: 3, uom: "cartridge" }]
        }
      ]
    },
    {
      requestId: "REQ-2026-06170",
      orderId: "ORD-100270",
      dateInitiated: "Feb 05, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: null,
      totalValue: 48000.00,
      packages: [
        {
          packageId: "PKG-6170-A", storageTemp: "Ambient", status: "processing",
          items: [
            { name: "Bed Sheets (Blue)", quantity: 100, uom: "unit" },
            { name: "Pillow Cases", quantity: 100, uom: "unit" }
          ]
        },
        {
          packageId: "PKG-6170-F", storageTemp: "Frozen", status: "processing",
          items: [
            { name: "Patient Gowns", quantity: 50, uom: "unit" },
            { name: "Blankets (Wool)", quantity: 30, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06180",
      orderId: "ORD-100280",
      dateInitiated: "Feb 05, 2026",
      paymentDate: "Feb 05, 2026",
      deliveryDate: "Feb 06, 2026",
      totalValue: 8800.00,
      packages: [
        {
          packageId: "PKG-6180-A", storageTemp: "Crt", status: "completed",
          items: [
            { name: "Dexamethasone 4mg", quantity: 100, uom: "ampoule" },
            { name: "Furosemide 20mg", quantity: 50, uom: "ampoule" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06190",
      orderId: null,
      dateInitiated: "Feb 06, 2026",
      paymentDate: null,
      deliveryDate: null,
      totalValue: 192000.00,
      packages: [
        {
          packageId: "PKG-6190-A", storageTemp: "Refrigerated", status: "approved",
          items: [
            { name: "Human Albumin 20%", quantity: 10, uom: "vial" },
            { name: "Immunoglobulin G", quantity: 5, uom: "vial" },
            { name: "Factor VIII", quantity: 8, uom: "vial" },
            { name: "Erythropoietin", quantity: 20, uom: "vial" }
          ]
        },
        {
          packageId: "PKG-6190-B", storageTemp: "Ambient", status: "approved",
          items: [
            { name: "Disposable Syringes 5ml", quantity: 1000, uom: "unit" },
            { name: "Disposable Syringes 10ml", quantity: 1000, uom: "unit" },
            { name: "Hypodermic Needles 21G", quantity: 2000, uom: "unit" },
            { name: "Hypodermic Needles 23G", quantity: 2000, uom: "unit" }
          ]
        }
      ]
    },
    {
      requestId: "REQ-2026-06200",
      orderId: "ORD-100300",
      dateInitiated: "Feb 06, 2026",
      paymentDate: "Feb 06, 2026",
      deliveryDate: null,
      totalValue: 2400.00,
      packages: [
        {
          packageId: "PKG-6200-A", storageTemp: "Ambient", status: "packed",
          items: [{ name: "Hand Soap 500ml", quantity: 24, uom: "bottle" }]
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
        <div class="package-count js-pkg-count" data-req-id=${reqOrd.requestId}></div>
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

  document.querySelectorAll('.js-pkg-count')
    .forEach(pkgColElem => {
      const elemReqId = pkgColElem.dataset.reqId;

      orderHistoryData.forEach(reqOrd => {
        if (elemReqId === reqOrd.requestId) {
          reqOrd.packages.forEach(pkg => {
            const storageChar = pkg.storageTemp[0]
            pkgColElem.innerHTML += `
              <span class="badge ${storageChar}">${storageChar}</span>
            `
          })
        }
      })
    })

  //Opening and closing the drawer
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