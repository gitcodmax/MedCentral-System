import { renderSidebar } from "../sidebar.js";
import { xRemoveOverlay, clickToRemoveOverlay } from "../overlay.js";

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar()

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

    // Search logic
    const searchTerm = document.getElementById('search-input')
    searchTerm.addEventListener('keyup', handleSearch)
    function handleSearch(){
        const searchValue = searchTerm.value.toLowerCase().trim()
        const searchResult = catalogItems.filter(item => {
            const searchMatch = item.sku.toLowerCase().includes(searchValue)
                || item.name.toLowerCase().includes(searchValue)
            return searchMatch
        })

        itemsTbody.innerHTML = ``
        if(searchResult.length > 0) {
            itemsTbody.appendChild(displayItems(searchResult))
        }
    }

    // Notification Message to delete item
    const overlay = document.getElementById('delete-item-overlay')
    itemsTbody.addEventListener('click', (e) => {
        if(e.target.classList.contains('delete-item-btn')){
            const deleteBtn = e.target
            const btnSku = deleteBtn.dataset.sku

            catalogItems.forEach(item => {
                if(item.sku === btnSku){
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