import { renderHeader } from "./header.js";

document.addEventListener('DOMContentLoaded', () => {

    renderHeader()

    document.querySelector('.dashboard-stack')
        .innerHTML = `
        <section class="stock-alerts card layout-section">
            <div class="card-title-container">
                <h2>Stock Alerts</h2>
                <div class="alert-key">
                    <span class="key-item">
                        <span class="key-color yellow"></span> Warning
                    </span>
                    <span class="key-item">
                        <span class="key-color orange"></span> Low
                    </span>
                    <span class="key-item">
                        <span class="key-color red"></span> Critical
                    </span>
                </div>
            </div>
            <div class="alerts-container js-alerts-container"></div>
        </section>

        <section class="pending-orders card layout-section">
            <h2>Pending Orders</h2>
            <div class="order-cards-container"></div>
        </section>

        <div id="orderOverlay" class="overlay">
            <div class="overlay-content">
                <header class="overlay-header">
                    <div class="order-info">
                        <h2>Order #<span id="displayOrderId"></span> for <span id="hospital-name">Hospital</span></h2>
                        <div class="order-date-status">
                            <p>Order Created On: <span class="status-tag" id="date-confirmed"></span></p>
                            <p>Status: <span class="status-tag">Ready for Packing</span></p>
                        </div>
                    </div>
                    <button class="close-overlay-btn js-close-overlay-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </header>

                <section class="overlay-body">
                    <p class="instruction">Please retrieve and verify the following items for this order.</p>

                    <table class="picking-table">
                        <thead>
                            <tr>
                                <th>Item Details</th>
                                <th>Batch/Lot No.</th>
                                <th>Qty to Pack</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody id="pickingItemList"></tbody>
                    </table>
                </section>

                <footer class="overlay-footer">
                    <button class="packed-btn" onclick="markOrderAsPacked()">
                        <i class="fas fa-check-circle"></i> Confirm All Items Packed
                    </button>
                </footer>
            </div>
        </div>
        
        `

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
    function openOrderOverlay(orderId) {
        document.getElementById('displayOrderId').innerText = orderId;
        document.getElementById('orderOverlay').style.display = 'flex';
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
        const orderId = document.getElementById('displayOrderId').innerText;

        // In a real system, you'd send an API call here
        alert(`Order ${orderId} has been successfully packed and inventory levels updated!`);

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
            "ORD-8821": {
                customerName: "St. Jude Medical Center",
                orderCreatedDate: "2025-12-18",
                items: [
                    { itemName: "Paracetamol 500mg", sku: "PAR-500MG", batchNumber: "A30B45", quantityToPack: 50, unitOfMeasure: "BOX" },
                    { itemName: "Latex Gloves (Size M)", sku: "GLOV-LAT-M", batchNumber: "C45F20", quantityToPack: 5, unitOfMeasure: "CARTON" }
                ]
            }
        },
        {
            "ORD-8822": {
                customerName: "City General Clinic",
                orderCreatedDate: "2025-12-19",
                items: [
                    { itemName: "Amoxicillin 250mg", sku: "AMOX-250", batchNumber: "AMX-992", quantityToPack: 20, unitOfMeasure: "BOTTLE" }
                ]
            }
        },
        {
            "ORD-8823": {
                customerName: "Hope Children's Hospital",
                orderCreatedDate: "2025-12-20",
                items: [
                    { itemName: "Insulin Vials", sku: "INS-V10", batchNumber: "ICE-442", quantityToPack: 100, unitOfMeasure: "VIAL" }
                ]
            }
        }
    ];

    //Display all the pending orders
    const ordersContainer = document.querySelector('.order-cards-container')
    ordersData.forEach((order) => {
        for (const orderId in order) {
            const orderDetails = order[orderId]

            ordersContainer.innerHTML += `
                <div class="order-card-item">
                    <h3>Order #${orderId}</h3>
                    <p>Hospital: ${orderDetails.customerName}</p>
                    <p>Items: ${orderDetails.items.length} Item(s)</p>
                    <button class="action-btn primary small-pack-btn js-pack-order-btn" data-order-id=${orderId}>Pack Order</button>
                </div>
            `
        }
    })


    //Display the pending orders and the right order details in the overlay
    const tableBody = document.getElementById('pickingItemList');
    document.querySelectorAll('.js-pack-order-btn')
        .forEach((packOrderBtn) => {
            packOrderBtn.addEventListener('click', () => {
                const btnOrderId = packOrderBtn.dataset.orderId

                openOrderOverlay(btnOrderId)

                ordersData.forEach((order) => {
                    for (const orderId in order) {
                        if (btnOrderId === orderId) {
                            const orderDetails = order[orderId]
                            document.getElementById('displayOrderId').innerText = orderId
                            document.getElementById('hospital-name').innerText = orderDetails.customerName
                            document.getElementById('date-confirmed').innerText = orderDetails.orderCreatedDate

                            const orderItems = orderDetails.items
                            orderItems.forEach((item) => {
                                const row = `
                                    <tr>
                                        <td>
                                            <strong>${item.itemName}</strong><br>
                                            <small>SKU: ${item.sku}</small>
                                        </td>
                                        <td><span class="batch-tag">${item.batchNumber}</span></td>
                                        <td class="qty-cell">${item.quantityToPack}</td>
                                        <td>${item.unitOfMeasure}</td>
                                    </tr>
                                `
                                tableBody.innerHTML += row;
                            })
                        }
                    }
                })
            })
        })

    //Close the Order details card overlay
    document.querySelector('.js-close-overlay-btn')
        .addEventListener('click', () => {
            closeOrderOverlay()
        })
});