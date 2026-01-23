import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay, displayNoMatch } from "../overlay.js";
import { populateDropdowns } from "../standards.js";

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.page-container')
        .innerHTML = `
            <nav class="sidebar"></nav>

            <div class="registry-container">
                <header class="logo-container"></header>

                <section class="form-panel">
                    <div class="header">
                        <h2><i class="fas fa-plus-circle"></i> Register New Item</h2>
                        <p>Classify stock based on Admin-defined standards.</p>
                    </div>

                    <form id="itemForm">
                        <div class="input-grid">

                            <div class="form-group margin-set">
                                <label>Item Name</label>
                                <input type="text" id="itemName" placeholder="e.g. Amoxicillin 500mg" required>
                            </div>

                            <div class="form-group margin-set">
                                <label>SKU Code</label>
                                <input type="text" id="sku" placeholder="REF-00123" required>
                            </div>

                            <div class="form-group">
                                <label>Category <small>(Admin Standard)</small></label>
                                <select id="categorySelect" required>
                                    <option value="">Select category...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Storage Temp <small>(Admin Standard)</small></label>
                                <select id="tempSelect" required>
                                    <option value="">Select Storage Temp...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>UOM <small>(Bulk Unit)</small></label>
                                <select id="uomSelect" required>
                                    <option value="">Select Unit of Measurement...</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Selling Unit <small>(Retail Unit)</small></label>
                                <select id="sellingUnitSelect" required>
                                    <option value="">Select Selling Unit...</option>
                                </select>
                            </div>

                            <div class="form-group margin-set">
                                <label>Price per Selling Unit (Ksh)</label>
                                <input type="number" id="pricePerUnit" placeholder="0.00" required>
                            </div>

                            <button type="submit" class="submit-btn">Add to Registry</button>   
                        </div>
                    </form>
                </section>

                <div class="overlay" id="confirmItemOverlay">
                    <div class="confirmation-card">
                        <div class="confirm-header">
                            <h3><i class="fas fa-check-double"></i> Confirm Item Details</h3>
                            <p>Please verify the information below before finalizing the registry entry.</p>
                        </div>
                
                        <div class="confirm-body">
                            <div class="confirm-section">
                                <span class="label">Product Name</span>
                                <div class="value large" id="conf-name">Amoxicillin 500mg Capsules</div>
                            </div>
                
                            <div class="confirm-row">
                                <div class="confirm-section">
                                    <span class="label">SKU Code</span>
                                    <div class="value" id="conf-sku">MED-AMX-001</div>
                                </div>
                                <div class="confirm-section">
                                    <span class="label">Category</span>
                                    <div class="value" id="conf-category">Antibiotics</div>
                                </div>
                            </div>
                
                            <div class="confirm-row">
                                <div class="confirm-section">
                                    <span class="label">Storage Temperature</span>
                                    <div class="value" id="conf-temp">Ambient (15°C to 25°C)</div>
                                </div>
                                <div class="confirm-section">
                                    <span class="label">Unit Price (Ksh)</span>
                                    <div class="value highlight" id="conf-price">450.00</div>
                                </div>
                            </div>
                
                            <div class="confirm-unit-logic">
                                <div class="unit-box">
                                    <span class="label">Bulk UOM</span>
                                    <div class="value" id="conf-uom">Carton</div>
                                </div>
                                <i class="fas fa-arrow-right"></i>
                                <div class="unit-box">
                                    <span class="label">Selling Unit</span>
                                    <div class="value" id="conf-sell">Strip</div>
                                </div>
                            </div>
                        </div>
                
                        <div class="confirm-footer">
                            <button class="btn-edit js-btn-no">Back to Edit</button>
                            <button class="btn-confirm">Confirm & Save</button>
                        </div>
                    </div>
                </div>

                <section class="catalog-panel">
                    <div class="catalog-header">
                        <div class="left-catalog-header">
                            <h3><i class="fas fa-list"></i> Current Catalog</h3>
                        </div>
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="search-input" placeholder="Search SKU/Name...">
                        </div>
                    </div>

                    <div class="table-scroll">
                        <table class="catalog-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>UOM / Selling Unit</th>
                                    <th>Temp</th>
                                    <th>Price</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody class="js-items-tbody"></tbody>
                        </table>
                    </div>

                    <div class="no-match-container hidden js-no-match-container"></div>
                </section>

                <div class="overlay" id="delete-item-overlay">
                    <div class="notification-container">
                        <div class="modal-content">
                        <h3>Confirm Deletion</h3>
                        
                        <p class="item-info">
                            Delete <strong>SKU: <span class="confirm-sku js-confirm-sku"></span> </strong>
                            Name: <span class="confirm-name js-confirm-name"></span>?
                        </p>
                    
                        <div class="buttons">
                            <button class="btn-no js-btn-no" id="cancelDelete">No, Cancel</button>
                            <button class="btn-yes" id="confirmDelete">Yes, Delete</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    renderSidebar()
    displayNoMatch()

    const catalogItems = [
        {
            sku: "MED-AMX-001",
            name: "Amoxicillin 500mg Capsules",
            category: "Antibiotics",
            uom: "Carton",
            sellingUnit: "Strip",
            temp: "Ambient",
            price: 450.00
        },
        {
            sku: "VAC-BCG-002",
            name: "BCG Vaccine (Freeze-Dried)",
            category: "Vaccines",
            uom: "Box",
            sellingUnit: "Vial",
            temp: "Refrigerated",
            price: 1200.00
        },
        {
            sku: "SUR-GLV-003",
            name: "Surgical Gloves (Size 7.5)",
            category: "Surgical Gear",
            uom: "Carton",
            sellingUnit: "Pair",
            temp: "Ambient",
            price: 85.50
        },
        {
            sku: "INS-GLR-004",
            name: "Insulin Glargine (SoloStar)",
            category: "Diabetes Care",
            uom: "Pack",
            sellingUnit: "Pen",
            temp: "Refrigerated",
            price: 3200.00
        },
        {
            sku: "PAN-TAB-005",
            name: "Panadol Extra 500mg",
            category: "Analgesics",
            uom: "Box",
            sellingUnit: "Tablet",
            temp: "Ambient",
            price: 5.00
        },
        {
            sku: "IVF-SAL-006",
            name: "Normal Saline 0.9% (500ml)",
            category: "IV Fluids",
            uom: "Crate",
            sellingUnit: "Bottle",
            temp: "CRT",
            price: 180.00
        },
        {
            sku: "VAC-PLI-007",
            name: "Polio Vaccine (Oral)",
            category: "Vaccines",
            uom: "Box",
            sellingUnit: "Dose",
            temp: "Frozen",
            price: 150.00
        },
        {
            sku: "SYR-DIS-008",
            name: "Disposable Syringes (5ml)",
            category: "Consumables",
            uom: "Box",
            sellingUnit: "Single Item",
            temp: "Ambient",
            price: 12.00
        },
        {
            sku: "LAB-RGT-009",
            name: "Rapid COVID-19 Test Kit",
            category: "Diagnostics",
            uom: "Box",
            sellingUnit: "Kit",
            temp: "Ambient",
            price: 750.00
        },
        {
            sku: "ANT-CEF-010",
            name: "Ceftriaxone 1g Injection",
            category: "Antibiotics",
            uom: "Box",
            sellingUnit: "Vial",
            temp: "Ambient",
            price: 280.00
        }
    ];

    const itemsTbody = document.querySelector('.js-items-tbody')

    function displayItems(catalogItems) {
        const itemsFragment = document.createDocumentFragment()
        catalogItems.forEach(item => {
            const tblRow = document.createElement('tr')
            const tempLetter = (item.temp).slice(0, 1)

            tblRow.innerHTML = `
                <td class="sku-code"><strong>${item.sku}</strong></td>
                <td>${item.name}</td>
                <td>${item.uom} / ${item.sellingUnit}</td>
                <td><span class="badge ${tempLetter}">${tempLetter}</span></td>
                <td>${item.price}</td>
                <td class="btn-td"><button 
                class="delete-item-btn" 
                data-sku="${item.sku}">
                DELETE</button></td>
            `

            itemsFragment.appendChild(tblRow)
        })

        return itemsFragment
    }

    itemsTbody.appendChild(displayItems(catalogItems))

    populateDropdowns()

    //Populating the overlay with data from the inputs for confirmation
    const form = document.getElementById('itemForm')
    const confirmItemOverlay = document.getElementById('confirmItemOverlay')
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const itemName = form.elements.itemName.value.trim()
        const sku = form.elements.sku.value.trim()
        const categorySelected = form.elements.categorySelect.value
        const tempSelected = form.elements.tempSelect.value
        const uomSelected = form.elements.uomSelect.value
        const sellingUnitSelected = form.elements.sellingUnitSelect.value
        const pricePerUnit = form.elements.pricePerUnit.value

        document.getElementById('conf-name').textContent = itemName
        document.getElementById('conf-sku').textContent = sku
        document.getElementById('conf-category').textContent = categorySelected
        document.getElementById('conf-temp').textContent = tempSelected
        document.getElementById('conf-price').textContent = pricePerUnit
        document.getElementById('conf-uom').textContent = uomSelected
        document.getElementById('conf-sell').textContent = sellingUnitSelected

        confirmItemOverlay.classList.add('active')

        xRemoveOverlay(confirmItemOverlay)
        clickToRemoveOverlay(confirmItemOverlay)
    })

    // Search logic
    const noMatchContainerElem = document.querySelector('.no-match-container')
    const searchTerm = document.getElementById('search-input')
    searchTerm.addEventListener('keyup', handleSearch)
    function handleSearch() {
        const searchValue = searchTerm.value.toLowerCase().trim()
        const searchResult = catalogItems.filter(item => {
            const searchMatch = item.sku.toLowerCase().includes(searchValue)
                || item.name.toLowerCase().includes(searchValue)
            return searchMatch
        })

        itemsTbody.innerHTML = ``
        if (searchResult.length > 0) {
            itemsTbody.appendChild(displayItems(searchResult))
            noMatchContainerElem.classList.add('hidden')
        } else {
            noMatchContainerElem.classList.remove('hidden')
        }
    }

    // Notification Message to delete item
    const overlay = document.getElementById('delete-item-overlay')
    itemsTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item-btn')) {
            const deleteBtn = e.target
            const btnSku = deleteBtn.dataset.sku

            catalogItems.forEach(item => {
                if (item.sku === btnSku) {
                    document.querySelector('.js-confirm-sku')
                        .textContent = btnSku
                    document.querySelector('.js-confirm-name')
                        .textContent = item.name
                    overlay.classList.add('active')

                    clickToRemoveOverlay(overlay)
                    xRemoveOverlay(overlay)
                }
            })
        }
    })
})