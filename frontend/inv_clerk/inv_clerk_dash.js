import { renderHeader } from "./header.js";
import { inventoryAlerts } from "../wh_manager/wh_manager_dash.js"
import { invClerkPagesLink, renderSuccessErrorOverlay, triggerStatus } from "../global.js";

export const userId = Number(localStorage.getItem('userId'))

document.addEventListener('DOMContentLoaded', async () => {

  renderHeader()
  renderSuccessErrorOverlay()

  const inventory = await inventoryAlerts()

  //Handles display of the stock alerts in the dash
  const alertsContainer = document.querySelector('.js-alerts-container')
  for (const item in inventory) {
    const itemDetails = inventory[item]
    alertsContainer.innerHTML += `
                <div class="alert-pill ${itemDetails['stockLevel']}-stock">${itemDetails['itemDetails']}</div>
            `
  }

  //Handle clicking the pack order button 
  // Function to show the overlay
  const confirmPackedBtnElem = document.getElementById('packedBtn')
  const pkgWtInputElem = document.getElementById('packageWeightInput')
  function openOrderOverlay(packageId) {
    document.getElementById('displayPkgId').innerText = packageId;
    document.getElementById('orderOverlay').style.display = 'flex';
    confirmPackedBtnElem.dataset.packageId = packageId
    pkgWtInputElem.dataset.packageId = packageId
    pkgWtInputElem.value = ``
  }

  // Function to hide the overlay
  function closeOrderOverlay() {
    document.getElementById('orderOverlay').style.display = 'none';
    tableBody.innerHTML = ``
  }

  // Function to handle the packing confirmation
  //========================================
  //Once an order has been packed, update the table in the database and 
  // remove it from pending orders
  function markOrderAsPacked() {
    const packageId = document.getElementById('displayPkgId').innerText;

    // In a real system, you'd send an API call here
    alert(`Package ${packageId} has been successfully packed and inventory levels updated!`);

    closeOrderOverlay();
    // You could also refresh the UI here to show the order as 'Packed'
  }

  // Close overlay if user clicks outside the modal box
  window.onclick = function (event) {
    const overlay = document.getElementById('orderOverlay');
    const confirmationOverlay = document.getElementById('confirmationOverlay')
    if (event.target == overlay) {
      closeOrderOverlay();
    } else if (event.target == confirmationOverlay) {
      closeOverlay()
    }
  }

  const ordersData = await getOrdersData(userId)

  // Generate a packages list
  function getPackagesFromOrders(orders) {
    const packagesList = []

    orders.forEach(order => {
      order.packages.forEach(pkg => {
        packagesList.push({
          packageId: pkg.packageId,
          orderId: order.orderId,
          orderCreatedDate: order.orderCreatedDate,
          customer: order.customerName,
          storageReq: pkg.storageRequirement,
          items: pkg.items
        })
      })
    })

    return packagesList
  }

  //Display all the pending orders
  const ordersContainer = document.querySelector('.order-cards-container')
  const packagesData = await getPackagesFromOrders(ordersData)
  packagesData.forEach(async (pkg) => {
    ordersContainer.innerHTML += `
            <div class="order-card-item">
                <h3>
                    <span class="pkg-id">${pkg.packageId}</span> |
                    <span class="ord-id">${pkg.orderId}</span>
                </h3>
                <p>Storage Temp.: <span class="pkg-value">${pkg.storageReq}</span></p>
                <p>Hospital: <span class="pkg-value">${pkg.customer}</span></p>
                <p>Items: <span class="pkg-value">${pkg.items.length} Item(s)</span></p>
                <button class="action-btn primary small-pack-btn js-pack-order-btn" data-package-id=${pkg.packageId}>Pack Order</button>
            </div>
        `
  })


  //Display the pending orders and the right order details in the overlay
  const tableBody = document.getElementById('pickingItemList');
  document.querySelectorAll('.js-pack-order-btn')
    .forEach((packOrderBtn) => {
      packOrderBtn.addEventListener('click', () => {
        const btnPkgId = packOrderBtn.dataset.packageId

        openOrderOverlay(btnPkgId)

        packagesData.forEach((pkg) => {
          if (btnPkgId === pkg.packageId) {
            document.getElementById('displayPkgId').innerText = pkg.packageId
            document.getElementById('hospital-name').innerText = pkg.customer
            document.getElementById('date-confirmed').innerText = pkg.orderCreatedDate
            const tempBadge = document.getElementById('tempBadge')
            const storageLetter = pkg.storageReq.slice(0, 1)
            tempBadge.className = 'badge ' + storageLetter
            tempBadge.textContent = storageLetter

            pkg.items.forEach((item) => {
              const row = `
                                    <tr>
                                        <td>
                                            <strong>${item.itemName}</strong><br>
                                            <small>SKU: ${item.sku}</small>
                                        </td>
                                        <td><span class="shelf-tag">${item.shelfId}</span></td>
                                        <td><span class="batch-tag">${item.batchNumber}</span></td>
                                        <td class="qty-cell">${item.quantityToPack}</td>
                                        <td>${item.unitOfMeasure}</td>
                                    </tr>
                                `
              tableBody.innerHTML += row;
            })
          }
        })
      })
    })

  // Confirm orders packed Button
  if (document.getElementById('orderOverlay')) {
    confirmPackedBtnElem.addEventListener('click', async () => {
      if (confirmPackedBtnElem.dataset.packageId === pkgWtInputElem.dataset.packageId) {
        if (pkgWtInputElem.value === '') {
          alert('Enter package weight!!')
        } else {
          const packageId = Number(confirmPackedBtnElem.dataset.packageId.slice(4))
          const packageWeight = pkgWtInputElem.value
          // Send to db
          const response = await fetch(`${invClerkPagesLink}/packedOrderPkgs`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ packageId, packageWeight })
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)
        }
      }
    })
  }

  //Close the Order details card overlay
  document.querySelector('.js-close-overlay-btn')
    .addEventListener('click', () => {
      closeOrderOverlay()
    })

  const kpiAndTablesData = await getKpiTablesData(userId)

  // Populate KPI grid from kpi_metrics
  const { kpi_metrics, dispatch_queue, in_transit_monitoring } = kpiAndTablesData

  if (kpi_metrics) {
    const awaitingElem = document.querySelector('.kpi-value.pkgs-to-pack')
    const readyElem = document.querySelector('.kpi-value.packed-pkgs')
    const inTransitElem = document.querySelector('.kpi-value.in-transit')

    if (awaitingElem) awaitingElem.textContent = kpi_metrics.awaiting_packing
    if (readyElem) readyElem.textContent = kpi_metrics.ready_for_dispatch
    if (inTransitElem) inTransitElem.textContent = kpi_metrics.active_in_transit
  }

  document.querySelector('.dispatch-pkgs').textContent = dispatch_queue.length
  document.querySelector('.in-transit-pkgs').textContent = in_transit_monitoring.length

  // Populate Ready for Dispatch table
  const dispatchTblFrag = document.createDocumentFragment()
  const dispatchTbodyElem = document.getElementById('dispatchTbody')
  dispatch_queue.forEach(pkg => {
    const tblRow = document.createElement('tr')

    tblRow.innerHTML = `
            <td><strong class="pkg-id">${pkg.package_id}</strong></td>
            <td class="ord-id">${pkg.order_id}</td>
            <td>${pkg.destination}</td>
            <td>
                <div class="user-info">
                    <i class="fas fa-user-circle"></i> ${pkg.driver_assigned}
                </div>
            </td>
            <td><span class="plate-number">${pkg.vehicle_plate}</span></td>
            <td><span class="badge ${pkg.storage_req.slice(0, 1)}">${pkg.storage_req.slice(0, 1)}</span></td>
            <td>
                <button class="btn-dispatch" id="confirmDispatch" data-pkg-id=${pkg.package_id}>
                    <i class="fas fa-check-circle"></i> Confirm Dispatch
                </button>
            </td>
        `

    dispatchTblFrag.appendChild(tblRow)
  })
  dispatchTbodyElem.appendChild(dispatchTblFrag)

  // Populate In-Transit Monitoring table
  const transitTblFrag = document.createDocumentFragment()
  const transitTbodyElem = document.getElementById('transitTbody')

  if (transitTbodyElem && Array.isArray(in_transit_monitoring)) {

    in_transit_monitoring.forEach((delivery) => {
      const isDelayed = delivery.status === 'Delayed'

      const tblRow = document.createElement('tr')
      tblRow.innerHTML = `
                <td><strong>#${delivery.delivery_id}</strong></td>
                <td><span class="pkg-id">${delivery.package_id}</span></td>
                <td>${delivery.destination}</td>
                <td>
                    <button class="view-vehicle-details-btn" 
                    id="viewVehicleInfoBtn" data-deliv-id=${delivery.delivery_id}>
                      View
                    </button>
                </td>
                <td>${delivery.dispatch_date}</td>
                <td><span class="status-badge badge-${delivery.status.toLowerCase()}">${delivery.status}</span></td>
                <td class="action-cell">
                    <button class="btn-action  ${isDelayed ? 'btn-disp' : 'btn-delay'}"    
                        title="Mark as ${isDelayed ? 'Delay Issue fixed' : 'Delayed'}" data-deliv-id=${delivery.delivery_id}
                    >
                        <i class="fas fa-clock"></i> ${isDelayed ? 'Proceed' : 'Delay'}
                    </button>
                    <button class="btn-action btn-delivered" 
                        ${isDelayed ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                        title="${isDelayed ? 'Fix delay issue' : 'Confirm Delivery'}" data-deliv-id=${delivery.delivery_id}
                    >
                        <i class="fas fa-house-circle-check"></i> Delivered
                    </button>
                </td>
            `

      transitTblFrag.appendChild(tblRow)
    })

    transitTbodyElem.appendChild(transitTblFrag)
  }

  // Opening the overlay to confirm dispatch, delay and delivery
  function openConfirmation(type, id) {
    const overlay = document.getElementById('confirmationOverlay');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const icon = document.getElementById('modalIcon');
    const iconContainer = document.getElementById('modalIconContainer');
    const delayInput = document.getElementById('delayReasonContainer');
    const confirmBtn = document.getElementById('confirmActionButton');

    // Reset styles
    iconContainer.className = 'modal-icon';
    delayInput.style.display = 'none';

    if (type === 'dispatch') {
      title.innerText = 'Confirm Dispatch';
      message.innerHTML = `Are you sure Package <span class="overlay-id">${id}</span> is loaded and ready to leave?`;
      icon.className = 'fas fa-shipping-fast';
      iconContainer.classList.add('theme-dispatch');
      confirmBtn.style.backgroundColor = '#10b981';
    }
    else if (type === 'delay') {
      title.innerText = 'Report Delay';
      message.innerHTML = `Logging a delay for Shipment <span class="overlay-id">${id}</span>.`;
      icon.className = 'fas fa-clock';
      iconContainer.classList.add('theme-delay');
      delayInput.style.display = 'block';
      confirmBtn.style.backgroundColor = '#f97316';
    }
    else if (type === 'proceed') {
      title.innerText = 'Delay Issue Fixed';
      message.innerHTML = `Delay for Shipment <span class="overlay-id">${id}</span> sorted.`;
      icon.className = 'fas fa-shipping-fast';
      iconContainer.classList.add('theme-dispatch');
      confirmBtn.style.backgroundColor = '#10b981';
    }
    else if (type === 'delivery') {
      title.innerText = 'Confirm Delivery';
      message.innerHTML = `Finalize delivery for Shipment <span class="overlay-id">${id}</span>?`;
      icon.className = 'fas fa-check-double';
      iconContainer.classList.add('theme-delivery');
      confirmBtn.style.backgroundColor = '#008B00';
    }

    overlay.style.display = 'flex';

    // Set the action for the confirm button
    confirmBtn.onclick = async () => {
      const packageId = Number(id.slice(4))

      if (type === 'dispatch') {
        const response = await fetch(`${invClerkPagesLink}/dispatchOrderPkgs`, 
          {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({packageId})
          }
        )

        const res = await response.json()
        triggerStatus(res.msg)
      } else if (type === 'delay') {
        const response = await fetch(`${invClerkPagesLink}/delayOrderPkgs`, 
          {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({packageId})
          }
        )

        const res = await response.json()
        triggerStatus(res.msg)
      } else if (type === 'delivery') {
        console.log(`Action: delivery confirmed for ID: ${packageId}`);
      } else if (type === 'proceed') {
        const response = await fetch(`${invClerkPagesLink}/fixDelayPkg`, 
          {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({packageId})
          }
        )

        const res = await response.json()
        triggerStatus(res.msg)
      }
    };

    document.querySelector('.btn-close-overlay').onclick = closeOverlay
  }

  function closeOverlay() {
    document.getElementById('confirmationOverlay').style.display = 'none';
  }

  dispatchTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    if (btn.id === 'confirmDispatch') {
      const btnPkgId = btn.dataset.pkgId
      openConfirmation('dispatch', btnPkgId)
    }
  })

  transitTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const btnDeliveryId = btn.dataset.delivId

    if (btn.classList.contains('btn-delay')) {
      openConfirmation('delay', btnDeliveryId)
    }
    if (btn.classList.contains('btn-delivered')) {
      openConfirmation('delivery', btnDeliveryId)
    }
    if (btn.classList.contains('btn-disp')) {
      openConfirmation('proceed', btnDeliveryId)
    }   

    if (btn.id === 'viewVehicleInfoBtn') {
      const vehicleOverlayElem = document.getElementById('vehicleDetailsOverlay')
      const delivery = in_transit_monitoring.find(deliv => deliv.delivery_id === btnDeliveryId)

      document.querySelectorAll('.js-vehicle-plates')
        .forEach(elem => elem.textContent = delivery.vehicle_plate)
      document.getElementById('ovDriverName')
        .textContent = delivery.driver
      document.getElementById('ovDriverPhone')
        .textContent = delivery.driver_phone
      vehicleOverlayElem.style.display = 'flex';

      vehicleOverlayElem.addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay'))
          vehicleOverlayElem.style.display = 'none';
      })
    }
  })

})

const getKpiTablesData = async (clerkId) => {
  const response = await fetch(`${invClerkPagesLink}/getKpiTblsData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId })
    }
  )

  const result = await response.json()
  return result.kpi_tables_data
}

const getOrdersData = async (clerkId) => {
  const response = await fetch(`${invClerkPagesLink}/getOrdersData`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkId })
    }
  )

  const res = await response.json()
  return res.orders_data
}