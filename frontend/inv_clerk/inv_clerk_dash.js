import { renderHeader } from "./header.js";

document.addEventListener('DOMContentLoaded', () => {

    renderHeader()

    // document.querySelector('.dashboard-stack')
    //     .innerHTML = ``
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Code for the stock alerts has been repeated in another file(wh_manager)
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Mock data from the API for use in the stock alerts
    const inventory = {
        "PAR-500MG": {
            itemDetails: "Paracetamol 500mg(20 boxes)",
            stockLevel: "low" // Value sent from API: 'warning', 'low', 'critical', or 'healthy'
        },
        "AMX-250": {
            itemDetails: "Amoxicillin 250mg(5 bottles)",
            stockLevel: "critical"
        },
        "GLOV-LAT-M": {
            itemDetails: "Latex Gloves(10 cartons)",
            stockLevel: "warning"
        }
    };

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
        if (event.target == overlay) {
            closeOrderOverlay();
        }
    }

    //Mock up data for the order
    const ordersData = [
        {
            orderId: "ORD-8821",
            customerName: "St. Jude Medical Center",
            orderCreatedDate: "2026-02-18",
            // An order contains an array of distinct packages
            packages: [
                {
                    packageId: "PKG-440",
                    storageRequirement: "Ambient",
                    items: [
                        {
                            itemName: "Paracetamol 500mg",
                            sku: "PAR-500MG",
                            shelfId: "A-12-04",
                            storageTemp: "Ambient",
                            batchNumber: "A30B45",
                            quantityToPack: 50,
                            unitOfMeasure: "BOX"
                        },
                        {
                            itemName: "Latex Gloves (Size M)",
                            sku: "GLOV-LAT-M",
                            shelfId: "C-05-22",
                            storageTemp: "CRT",
                            batchNumber: "C45F20",
                            quantityToPack: 5,
                            unitOfMeasure: "CARTON"
                        }
                    ]
                },
                {
                    packageId: "PKG-441",
                    storageRequirement: "Refrigerated",
                    items: [
                        {
                            itemName: "Insulin Vials",
                            sku: "INS-V10",
                            shelfId: "REF-01-A",
                            storageTemp: "Refrigerated",
                            batchNumber: "ICE-442",
                            quantityToPack: 20,
                            unitOfMeasure: "VIAL"
                        }
                    ]
                }
            ]
        },
        {
            orderId: "ORD-8822",
            customerName: "City General Clinic",
            orderCreatedDate: "2026-02-19",
            packages: [
                {
                    packageId: "PKG-442",
                    storageRequirement: "CRT",
                    items: [
                        {
                            itemName: "Amoxicillin 250mg",
                            sku: "AMOX-250",
                            shelfId: "B-02-11",
                            storageTemp: "Frozen",
                            batchNumber: "AMX-992",
                            quantityToPack: 20,
                            unitOfMeasure: "BOTTLE"
                        }
                    ]
                }
            ]
        }
    ];

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
    const packagesData = getPackagesFromOrders(ordersData)
    console.log(packagesData)
    packagesData.forEach((pkg) => {
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
        confirmPackedBtnElem.addEventListener('click', () => {
            if (confirmPackedBtnElem.dataset.packageId === pkgWtInputElem.dataset.packageId) {
                if (pkgWtInputElem.value === '') {
                    alert('Enter package weight!!')
                } else {
                    // Send to db
                    console.log('Package packed', pkgWtInputElem.value)
                }
            }
        })
    }

    //Close the Order details card overlay
    document.querySelector('.js-close-overlay-btn')
        .addEventListener('click', () => {
            closeOrderOverlay()
        })

    const kpiAndTablesMockData = {
        "kpi_metrics": {
            "awaiting_packing": 18,
            "ready_for_dispatch": 12,
            "active_in_transit": 8,
            "reported_delays": 2,
            "delivered_today": 24
        },
        "dispatch_queue": [
            {
                "package_id": "PKG-445",
                "order_id": "ORD-905",
                "destination": "Central Pharmacy",
                "driver_assigned": "Jane Wilson",
                "vehicle_plate": "KBD 123X",
                "storage_req": "Refrigerated",
                "priority": "High"
            },
            {
                "package_id": "PKG-446",
                "order_id": "ORD-908",
                "destination": "City General",
                "driver_assigned": "John Doe",
                "vehicle_plate": "KCC 789Y",
                "storage_req": "Coom Temp",
                "priority": "Normal"
            },
            {
                "package_id": "PKG-448",
                "order_id": "ORD-912",
                "destination": "St. Mary's Clinic",
                "driver_assigned": "Sarah Smith",
                "vehicle_plate": "KDA 456Z",
                "storage_req": "Frozen",
                "priority": "Urgent"
            }
        ],
        "in_transit_monitoring": [
            {
                "delivery_id": "DLV-8825",
                "package_id": "PKG-445",
                "destination": "Central Pharmacy",
                "driver": "Jane Wilson",
                "vehicle_plate": "KBD 123X",
                "dispatch_date": "2026-03-01",
                "status": "Dispatched"
            },
            {
                "delivery_id": "DLV-8821",
                "package_id": "PKG-440",
                "destination": "City General Hospital",
                "driver": "John Doe",
                "vehicle_plate": "KCC 789Y",
                "dispatch_date": "2026-02-28",
                "status": "Delayed"
            },
            {
                "delivery_id": "DLV-8830",
                "package_id": "PKG-452",
                "destination": "Northwest Medical",
                "driver": "Mike Ross",
                "vehicle_plate": "KBE 555A",
                "dispatch_date": "2026-03-01",
                "status": "Dispatched"
            }
        ]
    }

    // Populate KPI grid from kpi_metrics
    const { kpi_metrics, dispatch_queue, in_transit_monitoring } = kpiAndTablesMockData

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
                <button class="btn-dispatch">
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
                    <div class="user-info">
                        <span class="driver-name">${delivery.driver}</span>
                        <span class="plate-number">${delivery.vehicle_plate}</span>
                    </div>
                </td>
                <td>${delivery.dispatch_date}</td>
                <td><span class="status-badge badge-${delivery.status.toLowerCase()}">${delivery.status}</span></td>
                <td class="action-cell">
                    <button class="btn-action btn-delay"${isDelayed ? ' disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Mark as Delayed">
                        <i class="fas fa-clock"></i> ${isDelayed ? 'Delayed' : 'Delay'}
                    </button>
                    <button class="btn-action btn-delivered" title="Confirm Delivery">
                        <i class="fas fa-house-circle-check"></i> Delivered
                    </button>
                </td>
            `

            transitTblFrag.appendChild(tblRow)
        })

        transitTbodyElem.appendChild(transitTblFrag)
    }

});