import { renderSidebar } from "./sidebar.js"
import { handleOverlay } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `

  const HospitalMockData = [
    {
      id: "HOSP-2026-001",
      name: "Nairobi West Hospital",
      contactPerson: "Dr. Evans Kamau",
      phone: "+254 711 222 333",
      email: "admin@nairobiwest.co.ke",
      status: "active",
      county: "Nairobi",
      zone: "Westlands",
      registeredDate: "2025-11-10",
      departments: ["Emergency Room", "ICU", "Pharmacy"]
    },
    {
      id: "HOSP-2026-002",
      name: "Coast General Hospital",
      contactPerson: "Mary Atieno",
      phone: "+254 722 444 555",
      email: "info@coastgeneral.org",
      status: "active",
      county: "Mombasa",
      zone: "Mvita",
      registeredDate: "2025-12-15",
      departments: ["Surgery", "Pediatrics", "Laboratory"]
    },
    {
      id: "HOSP-2026-003",
      name: "Lake View Clinic",
      contactPerson: "Dr. Silas Omollo",
      phone: "+254 733 666 777",
      email: "records@lakeview.com",
      status: "inactive",
      county: "Kisumu",
      zone: "Kisumu Central",
      registeredDate: "2026-02-01",
      departments: ["Outpatient", "Laboratory"]
    },
    {
      id: "HOSP-2026-004",
      name: "Rift Valley Trauma Center",
      contactPerson: "Sarah Njeri",
      phone: "+254 744 888 999",
      email: "snjeri@rift-trauma.go.ke",
      status: "archived",
      county: "Nakuru",
      zone: "Nakuru West",
      registeredDate: "2024-05-20",
      departments: ["Orthopedics", "ER", "Blood Bank"]
    },
    {
      id: "HOSP-2026-005",
      name: "St. Anne’s Specialized",
      contactPerson: "Father Peter Ojiambo",
      phone: "+254 755 000 111",
      email: "admin@stannes.org",
      status: "active",
      county: "Nairobi",
      zone: "Kasarani",
      registeredDate: "2026-02-12",
      departments: ["Oncology", "Dialysis"]
    },
    {
      id: "HOSP-2026-006",
      name: "Mombasa Health Annex",
      contactPerson: "Alice Waweru",
      phone: "+254 766 111 222",
      email: "annex@mombasa.go.ke",
      status: "active",
      county: "Mombasa",
      zone: "Nyali",
      registeredDate: "2026-01-30",
      departments: ["Maternity", "Pharmacy"]
    },
    {
      id: "HOSP-2026-007",
      name: "Kisumu Children's Hospital",
      contactPerson: "Dr. Ben Ochieng",
      phone: "+254 777 333 444",
      email: "care@kisumukids.co.ke",
      status: "active",
      county: "Kisumu",
      zone: "Kisumu West",
      registeredDate: "2025-09-10",
      departments: ["Pediatrics", "Neonatal ICU"]
    },
    {
      id: "HOSP-2026-008",
      name: "Old City Dispensary",
      contactPerson: "Hassan Ali",
      phone: "+254 788 444 555",
      email: "hassan@oldcity.com",
      status: "archived",
      county: "Mombasa",
      zone: "Likoni",
      registeredDate: "2023-01-15",
      departments: ["General Medicine"]
    },
    {
      id: "HOSP-2026-009",
      name: "Nakuru Medical Plaza",
      contactPerson: "Jane Koech",
      phone: "+254 799 555 666",
      email: "jk@nakuruplaza.com",
      status: "inactive",
      county: "Nakuru",
      zone: "Lanet",
      registeredDate: "2025-10-05",
      departments: ["Dental", "ENT", "Optometry"]
    },
    {
      id: "HOSP-2026-010",
      name: "Westlands Health Hub",
      contactPerson: "Mark Tsoi",
      phone: "+254 700 999 000",
      email: "mtsoi@westlandshealth.com",
      status: "active",
      county: "Nairobi",
      zone: "Westlands",
      registeredDate: "2026-02-18",
      departments: ["ER", "Radiology", "Physiotherapy"]
    }
  ];

  // Display the hospital details in the table
  const hospitalDetailsTblFrag = document.createDocumentFragment()
  HospitalMockData.forEach(hos => {
    const tblRow = document.createElement('tr')

    let activeDeactiveBtnElem = ``
    if (hos.status === 'active') {
      activeDeactiveBtnElem = `
        <button title="Deactivate" class="text-danger deactivate-hos-btn" data-hos-id=${hos.id}><i class="fas fa-power-off"></i></button>
      `
    } else if (hos.status === 'inactive') {
      activeDeactiveBtnElem = `
        <button title="Activate" class="text-success activate-hos-btn" data-hos-id=${hos.id}><i class="fas fa-check"></i></button>
      `
    }

    tblRow.innerHTML = `
      <td><strong>${hos.name}</strong></td>
      <td>${hos.contactPerson}</td>
      <td>${hos.phone}</td>
      <td>${hos.email}</td>
      <td><span class="status-badge ${hos.status}">${hos.status}</span></td>
      <td>${hos.registeredDate}</td>
      <td class="action-btns">
        <button title="View" class="view-hos-btn" data-hos-id=${hos.id}><i class="fas fa-eye"></i></button>
        ${hos.status === 'archived' ? '' :
        `<button title="Edit" class="edit-hos-btn" data-hos-id=${hos.id}><i class="fas fa-edit"></i></button>`
      }
        ${activeDeactiveBtnElem}
      </td>
    `

    hospitalDetailsTblFrag.appendChild(tblRow)
  })
  document.getElementById('hosDetailsTbody')
    .appendChild(hospitalDetailsTblFrag)

  // Set up the overlay to add a new hospital
  const overlayElem = document.getElementById('addHospitalOverlay')
  const deptListContainerElem = document.getElementById('deptListContainer')
  document.getElementById('btnAddHospital')
    .addEventListener('click', () => {
      handleOverlay(overlayElem)

      // What happens when the add department button is 
      let rowIdCount = 1 //Counter id to assign to each of the departments rows created
      document.getElementById('addDeptBtn')
        .addEventListener('click', () => {
          let allFieldsEntered = false
          document.querySelectorAll('.dept-name-input')
            .forEach(deptInputElem => {
              if (deptInputElem.value === '') {
                allFieldsEntered = false
              } else {
                allFieldsEntered = true
              }
            })

          if (allFieldsEntered) {
            const elemRowId = rowIdCount++
            const div = document.createElement('div');
            div.className = 'dept-row'
            div.dataset.rowId = elemRowId
            div.innerHTML = `
              <input type="text" class="dept-name-input" name="depts[]" placeholder="e.g. Emergency Room" required>
              <button type="button" class="btn-remove" data-row-id=${elemRowId}>
                <i class="fas fa-trash-alt"></i>
              </button>
            `

            deptListContainerElem.appendChild(div);
          } else {
            alert('Enter department name in the field to add another one.')
          }
        })

      // What happens when a user deletes a department row when entering their names
      document.getElementById('modalBody')
        .addEventListener('click', (e) => {
          const btn = e.target.closest('button')
          if (!btn) return;

          if (btn.classList.contains('btn-remove')) {
            const removeBtnRowId = btn.dataset.rowId
            const deptRowRowId = btn.parentElement.dataset.rowId

            if (removeBtnRowId === deptRowRowId && deptListContainerElem.children.length > 1) {
              btn.parentElement.remove()
            } else {
              btn.parentElement.querySelector('input').value = ``
            }
          }
        })
    })

  //Get specific hospital details
  function getHospitalDetails(btnId) {
    return HospitalMockData.find(hos => hos.id === btnId)
  }

  // Set up the overlay to view and hospital details and activate/deactivate an account
  document.getElementById('hosDetailsTbody')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      const btnHosId = btn.dataset.hosId
      const hospital = getHospitalDetails(btnHosId)

      // Display hospital details
      if (btn.classList.contains('view-hos-btn')) {
        const viewHosOverlayElem = document.getElementById('viewHospitalOverlay')
        handleOverlay(viewHosOverlayElem)

        const hospStatus = hospital.status
        if(hospStatus === 'active'){
          document.querySelector('.js-status-badge')
            .classList.remove('inactive', 'archived')
        }else if(hospStatus === 'inactive'){
          document.querySelector('.js-status-badge')
            .classList.remove('active', 'archived')
        }else{
          document.querySelector('.js-status-badge')
            .classList.remove('active', 'inactive')
        }

        document.getElementById('viewHospName')
          .textContent = hospital.name
        document.querySelector('.js-view-hosp-id')
          .textContent = hospital.id
        document.querySelector('.js-status-badge')
          .textContent = hospital.status
        document.querySelector('.js-status-badge')
          .classList.add(hospital.status)
        document.getElementById('viewContact')
          .textContent = hospital.contactPerson
        document.getElementById('viewEmail')
          .textContent = hospital.email
        document.getElementById('viewPhone')
          .textContent = hospital.phone
        document.getElementById('viewDate')
          .textContent = hospital.registeredDate
        document.getElementById('viewCounty')
          .textContent = hospital.county
        document.getElementById('viewZone')
          .textContent = hospital.zone

        const deptFrag = document.createDocumentFragment()
        const deptContainerElem = document.getElementById('viewDepts')
        deptContainerElem.innerHTML = ``
        hospital.departments.forEach(dept => {
          const deptTag = document.createElement('span')
          deptTag.innerHTML = `<span class="view-tag">${dept}</span>`
          deptFrag.appendChild(deptTag)
        })
        deptContainerElem.appendChild(deptFrag)
      }

      // Display container to edit hospital details
      if (btn.classList.contains('edit-hos-btn')) {
        const editHosOverlayElem = document.getElementById('editHospitalOverlay')
        handleOverlay(editHosOverlayElem)
      }

      // Notify user they are about to activate an account
      if (btn.classList.contains('activate-hos-btn')) {
        const activateHosOverlayElem = document.getElementById('activateHospitalOverlay')
        handleOverlay(activateHosOverlayElem)
      }

      // Account Deactivation Notification
      if (btn.classList.contains('deactivate-hos-btn')) {
        const deactivateHosOverlayElem = document.getElementById('deactivateHospitalOverlay')
        handleOverlay(deactivateHosOverlayElem)
      }
    })
})