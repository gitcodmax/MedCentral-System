import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "./overlay.js"

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.app-container')
    .innerHTML = `
    <nav class="sidebar js-sidebar"></nav>

    <main class="app-content">
      <div class="main-content-logo"></div>

      <div class="page-content">

        <header class="page-header">
          <div>
            <h1>Incoming Packages – Pending Confirmation</h1>
            <p>Verify and log medical supplies upon arrival at the loading dock.</p>
          </div>

          <div class="summary-counter">
            <span class="count-value">12</span>
            <span class="count-label">Packages Awaiting Confirmation</span>
          </div>
        </header>

        <section class="table-card">
          <table class="packages-table">
            <thead>
              <tr>
                <th>Package ID</th>
                <th>Order ID</th>
                <th>Delivery Date & Time</th>
                <th class="text-right">Details</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody id="packagesTbody"></tbody>
          </table>
        </section>
      </div>

      <div class="modal-overlay" id="packageDetailsOverlay">
        <div class="context-modal">
          <div class="modal-header">
            <div class="header-titles">
              <p>Order Group: <strong class="ord-id overlay-ord-id"></strong></p>
            </div>
            <button class="close-modal-btn js-btn-close-overlay">&times;</button>
          </div>

          <div class="modal-body">
            <section class="current-package-info">
              <div class="info-card">
                <div class="info-tag-main">
                  <span class="label">Viewing Package</span>
                  <span class="value overlay-pkg-id"></span>
                </div>
                <div class="info-meta">
                  <span><i class="fas fa-thermometer-half"></i> Storage: <strong
                      class="js-storage-temp"></strong></span>
                  <span><i class="fas fa-calendar"></i> Delivery: <strong class="js-delivery-date"></strong></span>
                </div>
              </div>

              <div class="items-list-container">
                <h3>Items in this Package</h3>
                <table class="pkg-items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody id="packageItems"></tbody>
                </table>
              </div>
            </section>

            <hr class="section-divider">

            <section class="order-sibling-section">
              <h3>Associated Packages (<span class="ord-id overlay-ord-id"></span>)</h3>
              <p class="section-desc js-section-desc"></p>

              <div class="sibling-grid" id="siblingsContainer"></div>
            </section>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary js-btn-close-overlay">Close</button>
          </div>
        </div>
      </div>

      <div class="modal-overlay" id="inspectionOverlay">
        <div class="inspection-modal">
          <header class="inspection-header">
            <div class="header-title">
              <h2>Inspection & Verification</h2>
              <span>ID: <strong class="pkg-id overlay-pkg-id"></strong></span> | <span>Order: <strong
                  class="ord-id overlay-ord-id"></strong></span>
            </div>
            <button class="close-modal-btn js-btn-close-overlay">&times;</button>
          </header>

          <div class="modal-body" id="inspectionModalBody"></div>

          <footer class="modal-footer">
            <div class="footer-btns">
              <button class="btn-secondary js-btn-close-overlay">Close</button>
              <button class="btn-primary js-btn-confirm-inspection">Confirm Verification</button>
            </div>
          </footer>
        </div>
      </div>
    </main>
    `

  renderSidebar('receive_ord')

  //Primary Item Status
  const itemStatusOptions = [
    { id: "STAT-GOOD", label: "Good Condition" },
    { id: "STAT-DMG", label: "Damaged" },
    { id: "STAT-EXP", label: "Expired" },
    { id: "STAT-WRNG", label: "Wrong Item" }
  ];

  // Specific Damage Types
  const commonDamageTypes = [
    { id: "DMG-SEAL", label: "Broken/Tampered Seal" },
    { id: "DMG-LEAK", label: "Leaking/Spillage" },
    { id: "DMG-CRUSH", label: "Crushed/Compressed Packaging" },
    { id: "DMG-TEMP", label: "Temperature Indicator Triggered" },
    { id: "DMG-MOIST", label: "Water/Moisture Damage" },
    { id: "DMG-VIAL", label: "Cracked Glass/Vial" },
    { id: "DMG-CONTAM", label: "Visible Contamination" },
    { id: "DMG-OTHR", label: "Other" }
  ];

  const receivingData = [
    {
      orderId: "ORD-5542",
      packageId: "ORD-5542-R", // Refrigerated
      deliveryDateTime: "Feb 11, 2026 | 09:15 AM",
      storageTemp: "Refrigerated",
      items: [
        { name: "Insulin Glargine 100U/mL", quantity: 12, uom: "Vial", sku: "INS-GL-001", batchNo: "BN9901A", expiryDate: "Dec 2027" },
        { name: "Hepatitis B Vaccine (Adult)", quantity: 5, uom: "Vial", sku: "VAC-HB-022", batchNo: "BN2230B", expiryDate: "Aug 2026" }
      ],
      siblingPackages: [
        { packageId: "ORD-5542-A", status: "completed" },
        { packageId: "ORD-5542-C", status: "processing" }
      ]
    },
    {
      orderId: "ORD-5580",
      packageId: "ORD-5580-A", // Ambient
      deliveryDateTime: "Feb 11, 2026 | 10:05 AM",
      storageTemp: "Ambient",
      items: [
        { name: "Surgical Face Masks (3-Ply)", quantity: 50, uom: "Box", sku: "PPE-FM-105", batchNo: "LOT-2025-X", expiryDate: "Jan 2030" },
        { name: "Examination Gloves (Medium)", quantity: 100, uom: "Box", sku: "PPE-GL-M2", batchNo: "LOT-2025-Y", expiryDate: "Oct 2029" },
        { name: "Hand Sanitizer 500ml", quantity: 24, uom: "Bottle", sku: "SAN-HZ-500", batchNo: "LOT-2025-Z", expiryDate: "Mar 2027" },
        { name: "Disposable Gowns", quantity: 200, uom: "Unit", sku: "PPE-GW-01", batchNo: "LOT-2025-A", expiryDate: "N/A" }
      ],
      siblingPackages: [] // Single package order
    },
    {
      orderId: "ORD-5612",
      packageId: "ORD-5612-F", // Frozen
      deliveryDateTime: "Feb 11, 2026 | 11:20 AM",
      storageTemp: "Frozen",
      items: [
        { name: "Fresh Frozen Plasma", quantity: 10, uom: "Bag", sku: "BLD-FP-001", batchNo: "BK-8821", expiryDate: "Feb 2027" },
        { name: "Cryoprecipitate", quantity: 4, uom: "Unit", sku: "BLD-CP-005", batchNo: "BK-8822", expiryDate: "May 2026" }
      ],
      siblingPackages: [
        { packageId: "ORD-5612-C", status: "delivered" }
      ]
    },
    {
      orderId: "ORD-5650",
      packageId: "ORD-5650-C", // CRT
      deliveryDateTime: "Feb 11, 2026 | 12:45 PM",
      storageTemp: "Crt",
      items: [
        { name: "Saline 0.9% 1000ml", quantity: 40, uom: "Bag", sku: "IVF-SL-1L", batchNo: "IV-55620", expiryDate: "Jun 2028" },
        { name: "Dextrose 5% 500ml", quantity: 20, uom: "Bag", sku: "IVF-DX-500", batchNo: "IV-55621", expiryDate: "Jul 2028" }
      ],
      siblingPackages: [
        { packageId: "ORD-5650-A", status: "delivered with issue" },
        { packageId: "ORD-5650-B", status: "completed" },
        { packageId: "ORD-5650-D", status: "dispatched" }
      ]
    },
    {
      orderId: "ORD-5701",
      packageId: "ORD-5701-A",
      deliveryDateTime: "Feb 11, 2026 | 01:10 PM",
      storageTemp: "Ambient",
      items: [
        { name: "Paracetamol 500mg Tablets", quantity: 50, uom: "Pack", sku: "PHM-PC-500", batchNo: "PX-112", expiryDate: "Nov 2027" }
      ],
      siblingPackages: []
    },
    {
      orderId: "ORD-5722",
      packageId: "ORD-5722-R",
      deliveryDateTime: "Feb 11, 2026 | 01:30 PM",
      storageTemp: "Refrigerated",
      items: [
        { name: "Oxytocin Injection 10IU", quantity: 100, uom: "Ampoule", sku: "PHM-OX-10", batchNo: "OX-778", expiryDate: "Jan 2027" },
        { name: "Atracurium 25mg/2.5ml", quantity: 50, uom: "Ampoule", sku: "PHM-AT-25", batchNo: "AT-441", expiryDate: "Mar 2027" }
      ],
      siblingPackages: [
        { packageId: "ORD-5722-A", status: "delayed" }
      ]
    },
    {
      orderId: "ORD-5740",
      packageId: "ORD-5740-A",
      deliveryDateTime: "Feb 11, 2026 | 02:00 PM",
      storageTemp: "Ambient",
      items: [
        { name: "Adhesive Bandages (Assorted)", quantity: 20, uom: "Box", sku: "SUR-BD-01", batchNo: "SB-009", expiryDate: "Dec 2030" }
      ],
      siblingPackages: []
    },
    {
      orderId: "ORD-5789",
      packageId: "ORD-5789-C",
      deliveryDateTime: "Feb 11, 2026 | 02:45 PM",
      storageTemp: "Crt",
      items: [
        { name: "Lidocaine 2% Injection", quantity: 30, uom: "Vial", sku: "PHM-LC-02", batchNo: "LC-220", expiryDate: "Sep 2027" },
        { name: "Epinephrine 1mg/ml", quantity: 50, uom: "Ampoule", sku: "PHM-EP-01", batchNo: "EP-991", expiryDate: "Aug 2026" }
      ],
      siblingPackages: [
        { packageId: "ORD-5789-R", status: "processing" }
      ]
    },
    {
      orderId: "ORD-5810",
      packageId: "ORD-5810-A",
      deliveryDateTime: "Feb 11, 2026 | 03:15 PM",
      storageTemp: "Ambient",
      items: [
        { name: "Gauze Swabs 10cm x 10cm", quantity: 100, uom: "Pack", sku: "SUR-GZ-10", batchNo: "GZ-445", expiryDate: "N/A" }
      ],
      siblingPackages: []
    },
    {
      orderId: "ORD-5855",
      packageId: "ORD-5855-F",
      deliveryDateTime: "Feb 11, 2026 | 03:50 PM",
      storageTemp: "Frozen",
      items: [
        { name: "Varicella Vaccine", quantity: 20, uom: "Vial", sku: "VAC-VZ-11", batchNo: "VZ-332", expiryDate: "Jan 2027" }
      ],
      siblingPackages: []
    },
    {
      orderId: "ORD-5900",
      packageId: "ORD-5900-R",
      deliveryDateTime: "Feb 11, 2026 | 04:20 PM",
      storageTemp: "Refrigerated",
      items: [
        { name: "Anti-D Immunoglobulin", quantity: 15, uom: "Vial", sku: "BLD-AD-05", batchNo: "AD-119", expiryDate: "Oct 2026" }
      ],
      siblingPackages: [
        { packageId: "ORD-5900-A", status: "packed" },
        { packageId: "ORD-5900-C", status: "dispatched" }
      ]
    },
    {
      orderId: "ORD-6001",
      packageId: "ORD-6001-A",
      deliveryDateTime: "Feb 11, 2026 | 04:45 PM",
      storageTemp: "Ambient",
      items: [
        { name: "Hypodermic Needles 21G", quantity: 10, uom: "Box", sku: "SUR-ND-21", batchNo: "ND-551", expiryDate: "May 2030" },
        { name: "Syringes 5ml Luer Lock", quantity: 10, uom: "Box", sku: "SUR-SY-05", batchNo: "SY-882", expiryDate: "May 2030" }
      ],
      siblingPackages: []
    }
  ];

  const receiveItemsTbodyElem = document.getElementById('packagesTbody')

  // Display the packages in the page
  const incomingPackagesTblFrag = document.createDocumentFragment()
  receivingData.forEach(pkg => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
      <td><span class="id-tag">${pkg.packageId}</span></td>
      <td><span class="id-tag secondary">${pkg.orderId}</span></td>
      <td>${pkg.deliveryDateTime}</td>
      <td class="text-right">
        <button class="view-pkg-btn" data-pkg-id=${pkg.packageId}><i class="fas fa-eye"></i> View Package Details</button>
      </td>
      <td class="text-right">
        <button class="btn-primary receive-pkg" data-pkg-id=${pkg.packageId}>Receive Package</button>
      </td>
    `

    incomingPackagesTblFrag.appendChild(tblRow)
  })

  receiveItemsTbodyElem.appendChild(incomingPackagesTblFrag)

  const inspectionOverlayElem = document.getElementById('inspectionOverlay')
  receiveItemsTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const btnPkgId = btn.dataset.pkgId

    // Renders the order and package id in the page
    function displayOrdPkgId(pkg) {
      document.querySelectorAll('.overlay-ord-id')
        .forEach(orderIdElem => {
          orderIdElem.textContent = `${pkg.orderId}`
        })

      document.querySelectorAll('.overlay-pkg-id')
        .forEach(pkgIdElem => {
          pkgIdElem.textContent = `${pkg.packageId}`
        })
    }

    // Button to view package details
    if (btn.classList.contains('view-pkg-btn')) {
      const overlayElem = document.getElementById('packageDetailsOverlay')
      handleOverlay(overlayElem)

      const packageItemsTbody = document.getElementById('packageItems')
      receivingData.forEach(pkg => {
        if (pkg.packageId === btnPkgId) {
          displayOrdPkgId(pkg)

          document.querySelector('.js-storage-temp')
            .textContent = `${pkg.storageTemp}`

          document.querySelector('.js-delivery-date')
            .textContent = `${pkg.deliveryDateTime.split('|')[0].trim()}`

          //Display the items in the package in the overlay
          packageItemsTbody.innerHTML = ``
          const packageItems = pkg.items
          const packageItemsFrag = document.createDocumentFragment()

          packageItems.forEach(item => {
            const tblRow = document.createElement('tr')

            tblRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity} ${item.uom}</td>
              `
            packageItemsFrag.appendChild(tblRow)
          })

          packageItemsTbody.appendChild(packageItemsFrag)

          // Populate details in the siblings container
          const allPackagesSectionDescElem = document.querySelector('.js-section-desc')
          const totalSiblingPkgs = pkg.siblingPackages.length
          const siblingsContainerElem = document.getElementById('siblingsContainer')
          siblingsContainerElem.innerHTML = ``
          siblingsContainerElem.innerHTML = `
            <div class="sibling-card active">
              <div class="sibling-id">${pkg.packageId}</div>
              <div class="sibling-status">
                <span class="status-indicator current"></span>
                current
              </div>
            </div>
          `
          if (totalSiblingPkgs === 0) {
            allPackagesSectionDescElem.textContent = `This order contains only 1 package.`
          } else {
            allPackagesSectionDescElem.textContent =
              `This order is split into ${totalSiblingPkgs + 1} physical packages.`

            pkg.siblingPackages.forEach(pkg => {
              siblingsContainerElem.innerHTML += `
                    <div class="sibling-card">
                      <div class="sibling-id">${pkg.packageId}</div>
                      <div class="sibling-status">
                        <span class="status-indicator ${pkg.status === 'delivered with issue' ? 'delivered-issue' : pkg.status}"></span>
                        ${pkg.status}
                      </div>
                    </div>
                  `
            })
          }
        }
      })
    }

    // Button to perform inspection
    if (btn.classList.contains('receive-pkg')) {
      handleOverlay(inspectionOverlayElem)

      document.querySelector('.js-btn-confirm-inspection')
        .dataset.packageId = btnPkgId

      receivingData.forEach(pkg => {
        if (btnPkgId === pkg.packageId) {
          displayOrdPkgId(pkg)

          const inspectionModalBodyElem = document.getElementById('inspectionModalBody')
          inspectionModalBodyElem.innerHTML = ``

          const modalBodyFrag = document.createDocumentFragment()
          pkg.items.forEach(item => {
            const inspectionCardDiv = document.createElement('div')
            inspectionCardDiv.className = `inspection-card`

            inspectionCardDiv.innerHTML = `
            
              <div class="card-header">
                <div class="item-identity">
                  <span class="sku">SKU: ${item.sku}</span>
                  <h3 class="item-name">${item.name}</h3>
                </div>
                <div class="item-logistics">
                  <span>Batch: <strong class="badge grn">${item.batchNo}</strong></span>
                  <span>Exp: <strong class="blue badge">${item.expiryDate}</strong></span>
                </div>
              </div>

              <div class="card-grid">
                <div class="input-group">
                  <label>Expected Qty</label>
                  <div class="readonly-value">${item.quantity} ${item.uom}</div>
                </div>

                <div class="input-group">
                  <label>Item Status</label>
                  <select class="status-select js-status-select" id="statusSelect-${item.sku}"></select>
                </div>

                <div class="input-group issue-box">
                  <label>Issue Details (If any)</label>
                  <div class="issue-flex">
                    <input type="number" placeholder="Qty Affected" id="qtyInput-${item.sku}" class="qty-input" min=1 max=${item.quantity}>
                    <select class="damage-type js-damage-type" id="damageType-${item.sku}">
                      <option value=''>Type of damage...</option>
                    </select>
                  </div>
                </div>

                <div class="input-group">
                  <label>Evidence</label>
                  <div class="photo-upload-zone">
                    <i class="fas fa-camera"></i>
                    <span class="photo-label">Upload Photo</span>
                    <input type="file" accept="image/*" hidden class="evidence-image" id='evidenceImage-${item.sku}' data-item-sku=${item.sku}>
                  </div>
                </div>
              </div>

              <div class="photo-uploaded-details" id="photoUploaded-${item.sku}"></div>

              <div class="item-footer">
                <textarea placeholder="Additional notes or 'Other' damage type..." class="notes-input" id='otherDamageType-${item.sku}'></textarea>
              </div>
            
            `

            modalBodyFrag.appendChild(inspectionCardDiv)
          })

          inspectionModalBodyElem.appendChild(modalBodyFrag)
        }
      })

      // Set up the item status options in the drop down
      document.querySelectorAll('.js-status-select')
        .forEach(itemStatusElem => {
          itemStatusOptions.forEach(itemStatus => {
            itemStatusElem.innerHTML += `
              <option value=${itemStatus.id}>${itemStatus.label}</option>
            `
          })
        })

      // Display the damage types in the type of damage input
      document.querySelectorAll('.js-damage-type')
        .forEach(damageTypeInputElem => {
          commonDamageTypes.forEach(damageType => {
            damageTypeInputElem.innerHTML += `
              <option value=${damageType.id}>${damageType.label}</option>
            `
          })
        })

      // Trigger a click in the hidden input tag to upload an image
      document.querySelectorAll('.photo-upload-zone')
        .forEach(uploadZoneElem => {
          uploadZoneElem.addEventListener('click', () => {
            uploadZoneElem.querySelector('.evidence-image').click()
          })
        })

      // Notify the user image has been uploaded
      document.querySelectorAll('.evidence-image')
        .forEach(imageInputElem => {
          imageInputElem.addEventListener('change', (e) => {
            const imageInputItemSku = imageInputElem.dataset.itemSku
            const file = e.target.files[0];
            if (!file) return;

            alert(`Photo ${file.name} uploaded.`)
            document.getElementById(`photoUploaded-${imageInputItemSku}`)
              .textContent = `Photo Uploaded: ${file.name}`
          })
        })
    }
  })

  // Set up button to confirm the items inspection
  inspectionOverlayElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('js-btn-confirm-inspection')) {
      const confirmBtnPkgId = btn.dataset.packageId

      // Validate the inputs for item inspection
      for (const pkg of receivingData) {
        if (pkg.packageId === confirmBtnPkgId) {
          for (const item of pkg.items) {
            const statusSelectElem = document.getElementById(`statusSelect-${item.sku}`);
            const quantityInputElem = document.getElementById(`qtyInput-${item.sku}`)
            const evidenceImageElem = document.getElementById(`evidenceImage-${item.sku}`)
            const damageTypeElem = document.getElementById(`damageType-${item.sku}`)
            const otherDamageTypeElem = document.getElementById(`otherDamageType-${item.sku}`)

            if (statusSelectElem.value === 'STAT-GOOD') continue;

            let errorMessage = "";
            if (!quantityInputElem.value) {
              errorMessage = `Enter qty affected in ${item.name}`;
            } else if (!evidenceImageElem.value) {
              errorMessage = `Enter the evidence image for ${item.name}`;
            } else if (statusSelectElem.value === 'STAT-DMG') {
              if (!damageTypeElem.value) {
                errorMessage = `Enter the damage type for ${item.name}`;
              } else if (damageTypeElem.value === 'DMG-OTHR' && !otherDamageTypeElem.value.trim()) {
                errorMessage = `Enter the type of damage in ${item.name} text area`;
              }
            }

            if (errorMessage) {
              alert(errorMessage);
              return;
            }
          }
        }
      }
    }
  })

})