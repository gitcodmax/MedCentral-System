import { orgPortalPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../global.js"
import { hosId } from "./dash.js"
import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "/global.js"

document.addEventListener('DOMContentLoaded', async () => {
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
            <span class="count-value" id="noDeliveredPkgs"></span>
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
  renderSuccessErrorOverlay()

  const itemStatusOptions = await getReceivedItemsStatuses()
  const commonDamageTypes = await getCommonDamageTypes()

  const receivingData = await getDeliveredPackages(hosId)
  const noDelivPkgElem = document.getElementById('noDeliveredPkgs')
  noDelivPkgElem.textContent = !receivingData ? '0' : receivingData.length
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
                        <span class="status-indicator ${pkg.status.toLowerCase() === 'delivered with issue' ?
                          'delivered-issue' : pkg.status.toLowerCase()}"
                        ></span>
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
  inspectionOverlayElem.addEventListener('click', async (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.classList.contains('js-btn-confirm-inspection')) {
      const confirmBtnPkgId = btn.dataset.packageId

      // Validate the inputs for item inspection
      for (const pkg of receivingData) {
        if (pkg.packageId === confirmBtnPkgId) {
          let deliveryIssuesArr = [];
          let errorMessage = "";

          for (const item of pkg.items) {
            const requestItemId = item.requestItemId; 
            const deliveryId = pkg.deliveryId;

            const statusSelectElem = document.getElementById(`statusSelect-${item.sku}`);
            const quantityInputElem = document.getElementById(`qtyInput-${item.sku}`);
            const evidenceImageElem = document.getElementById(`evidenceImage-${item.sku}`);
            const damageTypeElem = document.getElementById(`damageType-${item.sku}`);
            const otherDamageTypeElem = document.getElementById(`otherDamageType-${item.sku}`);

            // Skip good items
            if (statusSelectElem.value === 'STAT-GOOD') continue;

            if (!quantityInputElem.value) {
              errorMessage = `Enter qty affected in ${item.name}`;
            } else if (statusSelectElem.value === 'STAT-DMG') {
              if (!damageTypeElem.value) {
                errorMessage = `Enter the damage type for ${item.name}`;
              } else if (damageTypeElem.value === '7' && !otherDamageTypeElem.value.trim()) {
                errorMessage = `Enter the type of damage in ${item.name} in the text area`;
              }
            }

            if (errorMessage) break;

            // Collect valid "issue" data
            deliveryIssuesArr.push({
              requestItemId: requestItemId,
              deliveryId: deliveryId,
              damageStatus: statusSelectElem.value,
              quantityAffected: Number(quantityInputElem.value),
              damageType: damageTypeElem.value !== '' ? Number(damageTypeElem.value) : null,
              otherDamageType: otherDamageTypeElem.value !== '' ? otherDamageTypeElem.value.trim() : null
            });
          }

          // After checking all items in this package
          if (errorMessage) {
            alert(errorMessage);
            return;
          }

          // Success - now you have ALL issues collected properly
          if (deliveryIssuesArr.length > 0) {

            const response = await fetch(`${orgPortalPagesLink}/saveDeliveredItemsWithIssues`, 
              {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({deliveryIssuesArr})
              }
            )

            const res = await response.json()
            triggerStatus(res.msg)

          } else {
            const packageIdMod = pkg.packageId
            const packageId = Number(packageIdMod.slice(4, (packageIdMod.length - 2)))
            const deliveryId = pkg.deliveryId

            const response = await fetch(`${orgPortalPagesLink}/updatePackageStatus`, 
              {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({packageId, deliveryId})
              }
            )

            const res = await response.json()
            triggerStatus(res.msg)
          }
        }
      }
    }
  })

})

// Get the delivered packages from the db
async function getDeliveredPackages(hosId) {
  const response = await fetch(`${orgPortalPagesLink}/getAllDeliveredPackages`,
    {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({ hosId })
    }
  )

  const res = await response.json()
  return res.deliveredPkgs.deliveries_made
}

async function getCommonDamageTypes() {
  const response = await fetch(`${orgPortalPagesLink}/getCommonDamageTypes`)
  const res = await response.json()
  return res.commonDamageTypes
}

async function getReceivedItemsStatuses() {
  const response = await fetch(`${orgPortalPagesLink}/getReceivedItemsStatus`)
  const res = await response.json()
  return res.recievedItemsStatuses
}