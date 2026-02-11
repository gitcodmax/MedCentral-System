import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "./overlay.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()

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
        { packageId: "ORD-5542-C", status: "pending" }
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
        { packageId: "ORD-5612-C", status: "processing" }
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
        { packageId: "ORD-5650-A", status: "completed" },
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
        { packageId: "ORD-5722-A", status: "pending" }
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
        { packageId: "ORD-5900-C", status: "pending" }
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
        <button class="btn-primary receive-pkg">Receive Package</button>
      </td>
    `

    incomingPackagesTblFrag.appendChild(tblRow)
  })

  receiveItemsTbodyElem.appendChild(incomingPackagesTblFrag)

  receiveItemsTbodyElem.addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if(!btn) return;

      if(btn.classList.contains('view-pkg-btn')){
        const overlayElem = document.getElementById('packageDetailsOverlay')
        handleOverlay(overlayElem)
      }

      if(btn.classList.contains('receive-pkg')){
        const overlayElem = document.getElementById('inspectionOverlay')
        handleOverlay(overlayElem)
      }
    })
})