import { renderSidebar } from "./sidebar.js"
import { handleOverlay, displayNoMatchFound } from "../global.js"

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.app-container')
    .innerHTML = `    
      <div class="sidebar" id="sidebar"></div>

      <div class="main-wrapper">
        <header class="top-header" id="topHeader"></header>

        <main class="content">

          <section class="management-actions-container">
            <div class="action-left">
              <button class="btn btn-primary" id="btnAddHospital">
                <i class="fas fa-plus-circle"></i> Add New Hospital
              </button>
            </div>

            <div class="action-right">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="hospitalSearch" placeholder="Search by hospital name...">
              </div>

              <div class="filter-box">
                <i class="fas fa-filter"></i>
                <select id="statusFilter">
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </section>

          <div class="modal-overlay" id="addHospitalOverlay">
            <div class="modal-card">
              <div class="modal-header">
                <div class="modal-title">
                  <i class="fas fa-plus-circle"></i>
                  <div>
                    <h3>Register New Hospital</h3>
                    <p>Enter the details to add a new facility to the network.</p>
                  </div>
                </div>
                <button class="modal-close-btn js-btn-close-overlay">&times;</button>
              </div>

              <form id="hospital-form">
                <div class="modal-body" id="modalBody">
                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label>Hospital Name</label>
                      <div class="input-wrapper">
                        <i class="fas fa-h-square"></i>
                        <input type="text" name="hosp_name" placeholder="e.g. Metro General Hospital" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Contact Person</label>
                      <div class="input-wrapper">
                        <i class="fas fa-user-md"></i>
                        <input type="text" name="hosp_contact" placeholder="Dr. Jane Smith" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Phone Number</label>
                      <div class="input-wrapper">
                        <i class="fas fa-phone"></i>
                        <input type="tel" name="hosp_phone" placeholder="+1 (555) 000-0000" required>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label>Email Address</label>
                      <div class="input-wrapper">
                        <i class="fas fa-envelope"></i>
                        <input type="email" name="hosp_email" placeholder="admin@hospital-domain.org" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hosp-county">Hospital County</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-marker-alt"></i>
                        <select name="hosp_county" id="hospCounty" required>
                          <option value="" disabled selected>Select County</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hosp-zone">Zone / Sub-County</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-signs"></i>
                        <select name="hosp_zone" id="hospZone" required></select>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label>Select Active Departments</label>
                      <div id="deptContainer" class="dept-selector-grid">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel js-btn-close-overlay">Cancel</button>
                  <button type="submit" class="btn-submit">Register Facility</button>
                </div>
              </form>
            </div>
          </div>

          <section class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date Registered</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="hosDetailsTbody"></tbody>
            </table>
            <div class="no-match-container js-no-match-found hidden"></div>
          </section>

          <div class="modal-overlay" id="viewHospitalOverlay">
            <div class="modal-card view-card">
              <div class="modal-header">
                <div class="modal-title">
                  <i class="fas fa-file-medical"></i>
                  <div>
                    <h3 id="viewHospName"></h3>
                    <p>Registration ID: <span class="view-hosp-id js-view-hosp-id"></span></p>
                  </div>
                </div>
                <div class="header-right">
                  <span class="status-badge js-status-badge"></span>
                  <button class="modal-close-btn js-btn-close-overlay">&times;</button>
                </div>
              </div>

              <div class="view-hos-modal-body">
                <div class="info-section">
                  <h4 class="section-label"><i class="fas fa-info-circle"></i> Administrative Details</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <label>Contact Person</label>
                      <p id="viewContact"></p>
                    </div>
                    <div class="detail-item">
                      <label>Email Address</label>
                      <p id="viewEmail"></p>
                    </div>
                    <div class="detail-item">
                      <label>Phone Number</label>
                      <p id="viewPhone"></p>
                    </div>
                    <div class="detail-item">
                      <label>Date Registered</label>
                      <p id="viewDate"></p>
                    </div>
                  </div>
                </div>

                <div class="info-section">
                  <h4 class="section-label"><i class="fas fa-map-marked-alt"></i> Location & Logistics</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <label>County</label>
                      <p id="viewCounty"></p>
                    </div>
                    <div class="detail-item">
                      <label>Zone / Sub-County</label>
                      <p id="viewZone"></p>
                    </div>
                  </div>
                </div>

                <div class="info-section">
                  <h4 class="section-label"><i class="fas fa-th-list"></i> Active Departments</h4>
                  <div class="view-dept-tags" id="viewDepts"></div>
                </div>
              </div>

              <div class="close-btn-container">
                <button class="close-view-hos js-btn-close-overlay">Close</button>
              </div>
            </div>
          </div>

          <div class="modal-overlay" id="editHospitalOverlay">
            <div class="modal-card">
              <div class="modal-header header-edit">
                <div class="modal-title">
                  <i class="fas fa-edit"></i>
                  <div>
                    <h3>Edit Facility Details</h3>
                    <p>Updating: <span class="edit-header-hosp-name" id="editHeaderHospName"></span></p>
                  </div>
                </div>
                <button class="modal-close-btn js-btn-close-overlay">&times;</button>
              </div>

              <form id="edit-hospital-form">
                <div class="modal-body">
                  <div class="edit-status-bar">
                    <div class="status-info">
                      <label>Current Status</label>
                      <select name="edit_status" id="editStatus" class="status-select">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div class="id-info">
                      <label>System UUID</label>
                      <div class="edit-uuid" id="editUuid"></div>
                    </div>
                  </div>

                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label>Hospital Name</label>
                      <div class="input-wrapper">
                        <i class="fas fa-h-square"></i>
                        <input type="text" id="editHospName" name="edit_hosp_name" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Contact Person</label>
                      <div class="input-wrapper">
                        <i class="fas fa-user-md"></i>
                        <input type="text" id="editHospContact" name="edit_hosp_contact" required>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Phone Number</label>
                      <div class="input-wrapper">
                        <i class="fas fa-phone"></i>
                        <input type="tel" id="editHospPhone" name="edit_hosp_phone" required>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label>Official Email Address</label>
                      <div class="input-wrapper">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="editHospEmail" name="edit_hosp_email" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>County</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-marker-alt"></i>
                        <select id="editHospCounty" name="edit_hosp_county" required></select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Zone</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-signs"></i>
                        <select id="editHospZone" name="edit_hosp_zone" required></select>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label>Select Active Departments</label>
                      <div id="editDeptContainer" class="dept-selector-grid"></div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel js-btn-close-overlay">Cancel
                    Changes</button>
                  <button type="submit" class="btn-submit btn-update" id="updateHospBtn">Save Updates</button>
                </div>
              </form>
            </div>
          </div>

          <div class="modal-overlay" id="activateHospitalOverlay">
            <div class="modal-card mini-modal">
              <div class="modal-status-header bg-success">
                <i class="fas fa-user-check"></i>
              </div>

              <div class="modal-body text-center">
                <h3>Activate Hospital Account?</h3>
                <p>You are about to activate <strong><span
                      class="activate-hosp-name js-activate-hosp-name"></span></strong>.
                </p </div>

                <div class="modal-footer flex-center">
                  <button class="btn-cancel js-btn-close-overlay">No, Cancel</button>
                  <button class="btn-submit bg-success" id="confirm-activate-btn">Yes, Activate Account</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-overlay" id="deactivateHospitalOverlay">
            <div class="modal-card mini-modal">
              <div class="modal-status-header bg-danger">
                <i class="fas fa-user-slash"></i>
              </div>

              <form id="deactivation-form">
                <div class="modal-body">
                  <div class="text-center">
                    <h3>Deactivate Hospital?</h3>
                    <p>You are about to suspend <strong><span class="deactivate-hosp-name js-deactivate-hosp-name">General
                          Medical
                          Center</span></strong>.</p>
                  </div>

                  <div class="form-group full-width mt-1">
                    <label for="deactivate-reason">Reason for Deactivation <span class="text-danger">*</span></label>
                    <textarea class="deactivate-reason"
                      placeholder="e.g. Contract expired, facility maintenance, or security breach..."
                      required></textarea>
                  </div>
                </div>

                <div class="modal-footer flex-center">
                  <button type="button" class="btn-cancel js-btn-close-overlay">Cancel</button>
                  <button type="submit" class="btn-submit deactivate-btn">Confirm Deactivation</button>
                </div>
              </form>
            </div>
          </div>

        </main>
      </div>
    `

  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `
  displayNoMatchFound()

  const HospitalMockData = [
    {
      id: "HOSP-2026-001",
      name: "Nairobi West Hospital",
      contactPerson: "Dr. Evans Kamau",
      phone: "+254 711 222 333",
      email: "admin@nairobiwest.co.ke",
      status: "active",
      registeredDate: "2025-11-10",
      location: { county_id: 47, county_name: "Nairobi", zone_id: 4701, zone_name: "Westlands" },
      departments: [
        { id: 10, name: "Emergency Room" },
        { id: 15, name: "ICU" },
        { id: 22, name: "Pharmacy" }
      ]
    },
    {
      id: "HOSP-2026-002",
      name: "Coast General Hospital",
      contactPerson: "Mary Atieno",
      phone: "+254 722 444 555",
      email: "info@coastgeneral.org",
      status: "active",
      registeredDate: "2025-12-15",
      location: { county_id: 1, county_name: "Mombasa", zone_id: 101, zone_name: "Mvita" },
      departments: [
        { id: 11, name: "Pediatrics" },
        { id: 22, name: "Pharmacy" },
        { id: 25, name: "Laboratory" }
      ]
    },
    {
      id: "HOSP-2026-003",
      name: "Lake View Clinic",
      contactPerson: "Dr. Silas Omollo",
      phone: "+254 733 666 777",
      email: "records@lakeview.com",
      status: "inactive",
      registeredDate: "2026-02-01",
      location: { county_id: 41, county_name: "Kisumu", zone_id: 4101, zone_name: "Kisumu Central" },
      departments: [
        { id: 10, name: "Emergency Room" },
        { id: 25, name: "Laboratory" }
      ]
    },
    {
      id: "HOSP-2026-004",
      name: "Rift Valley Trauma Center",
      contactPerson: "Sarah Njeri",
      phone: "+254 744 888 999",
      email: "snjeri@rift-trauma.go.ke",
      status: "archived",
      registeredDate: "2024-05-20",
      location: { county_id: 32, county_name: "Nakuru", zone_id: 3202, zone_name: "Nakuru West" },
      departments: [
        { id: 10, name: "Emergency Room" },
        { id: 14, name: "Radiology" }
      ]
    },
    {
      id: "HOSP-2026-005",
      name: "St. Anne’s Specialized",
      contactPerson: "Father Peter Ojiambo",
      phone: "+254 755 000 111",
      email: "admin@stannes.org",
      status: "active",
      registeredDate: "2026-02-12",
      location: { county_id: 47, county_name: "Nairobi", zone_id: 4703, zone_name: "Kasarani" },
      departments: [
        { id: 12, name: "Oncology" },
        { id: 22, name: "Pharmacy" }
      ]
    },
    {
      id: "HOSP-2026-006",
      name: "Mombasa Health Annex",
      contactPerson: "Alice Waweru",
      phone: "+254 766 111 222",
      email: "annex@mombasa.go.ke",
      status: "active",
      registeredDate: "2026-01-30",
      location: { county_id: 1, county_name: "Mombasa", zone_id: 102, zone_name: "Nyali" },
      departments: [
        { id: 13, name: "Maternity" },
        { id: 22, name: "Pharmacy" }
      ]
    },
    {
      id: "HOSP-2026-007",
      name: "Kisumu Children's Hospital",
      contactPerson: "Dr. Ben Ochieng",
      phone: "+254 777 333 444",
      email: "care@kisumukids.co.ke",
      status: "active",
      registeredDate: "2025-09-10",
      location: { county_id: 41, county_name: "Kisumu", zone_id: 4103, zone_name: "Kisumu West" },
      departments: [
        { id: 11, name: "Pediatrics" },
        { id: 15, name: "ICU" }
      ]
    },
    {
      id: "HOSP-2026-008",
      name: "Old City Dispensary",
      contactPerson: "Hassan Ali",
      phone: "+254 788 444 555",
      email: "hassan@oldcity.com",
      status: "archived",
      registeredDate: "2023-01-15",
      location: { county_id: 1, county_name: "Mombasa", zone_id: 103, zone_name: "Likoni" },
      departments: [
        { id: 22, name: "Pharmacy" }
      ]
    },
    {
      id: "HOSP-2026-009",
      name: "Nakuru Medical Plaza",
      contactPerson: "Jane Koech",
      phone: "+254 799 555 666",
      email: "jk@nakuruplaza.com",
      status: "inactive",
      registeredDate: "2025-10-05",
      location: { county_id: 32, county_name: "Nakuru", zone_id: 3204, zone_name: "Lanet" },
      departments: [
        { id: 14, name: "Radiology" },
        { id: 25, name: "Laboratory" }
      ]
    },
    {
      id: "HOSP-2026-010",
      name: "Westlands Health Hub",
      contactPerson: "Mark Tsoi",
      phone: "+254 700 999 000",
      email: "mtsoi@westlandshealth.com",
      status: "active",
      registeredDate: "2026-02-18",
      location: { county_id: 47, county_name: "Nairobi", zone_id: 4701, zone_name: "Westlands" },
      departments: [
        { id: 10, name: "Emergency Room" },
        { id: 14, name: "Radiology" }
      ]
    }
  ];

  const GeoReferenceData = [
    {
      county_id: 47,
      county_name: "Nairobi",
      zones: [
        { id: 4701, name: "Westlands" },
        { id: 4702, name: "Dagoretti" },
        { id: 4703, name: "Kasarani" },
        { id: 4704, name: "Embakasi" },
        { id: 4705, name: "Kibra" }
      ]
    },
    {
      county_id: 1,
      county_name: "Mombasa",
      zones: [
        { id: 101, name: "Mvita" },
        { id: 102, name: "Nyali" },
        { id: 103, name: "Likoni" },
        { id: 104, name: "Kisauni" },
        { id: 105, name: "Changamwe" }
      ]
    },
    {
      county_id: 41,
      county_name: "Kisumu",
      zones: [
        { id: 4101, name: "Kisumu Central" },
        { id: 4102, name: "Kisumu East" },
        { id: 4103, name: "Kisumu West" },
        { id: 4104, name: "Seme" }
      ]
    },
    {
      county_id: 32,
      county_name: "Nakuru",
      zones: [
        { id: 3201, name: "Nakuru East" },
        { id: 3202, name: "Nakuru West" },
        { id: 3203, name: "Naivasha" },
        { id: 3204, name: "Lanet" }
      ]
    }
  ];

  const MasterDepartments = [
    { id: 10, name: "Emergency Room" },
    { id: 11, name: "Pediatrics" },
    { id: 12, name: "Oncology" },
    { id: 13, name: "Maternity" },
    { id: 14, name: "Radiology" },
    { id: 15, name: "ICU" },
    { id: 22, name: "Pharmacy" },
    { id: 25, name: "Laboratory" }
  ];

  const hosDetailsTbodyElem = document.getElementById('hosDetailsTbody')
  // Display the hospital details in the table
  function displayAllHospitals(hosData) {
    const hospitalDetailsTblFrag = document.createDocumentFragment()
    hosData.forEach(hos => {
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

    hosDetailsTbodyElem.appendChild(hospitalDetailsTblFrag)
  }

  displayAllHospitals(HospitalMockData)

  // Displays the chips in the container
  function displayDeptChips(deptContainerElem) {
    deptContainerElem.innerHTML = MasterDepartments.map(dept => `
      <div class="dept-chip" data-dept-id=${dept.id}>
        ${dept.name}
      </div>
    `).join('')
  }

  // Set up the overlay to add a new hospital
  const addHosOverlayElem = document.getElementById('addHospitalOverlay')
  document.getElementById('btnAddHospital')
    .addEventListener('click', () => {
      handleOverlay(addHosOverlayElem)

      const addHosCountyElem = document.getElementById('hospCounty')
      const addHosZoneElem = document.getElementById('hospZone')
      addHosZoneElem.value = ``
      displayCountyOptions(addHosCountyElem)

      addHosCountyElem.addEventListener('change', (e) => {
        const selectedId = parseInt(e.target.value)
        displayCountyZonesOptions(selectedId, addHosZoneElem)
      })


      let selectedDeptIds = new Set()
      const deptContainerElem = document.getElementById('deptContainer')
      displayDeptChips(deptContainerElem)
      // Handles the toggling when the chips are clicked
      handleDeptChipsToggle(addHosOverlayElem, selectedDeptIds)

    })

  //Get specific hospital details
  function getHospitalDetails(btnId) {
    return HospitalMockData.find(hos => hos.id === btnId)
  }

  // Hnadle the toggling of the department chips
  function handleDeptChipsToggle(overlay, selectedDeptIds) {
    overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('dept-chip')) {
        const deptChipElem = e.target
        const chipId = parseInt(deptChipElem.dataset.deptId)

        if (selectedDeptIds.has(chipId)) {
          selectedDeptIds.delete(chipId)
          deptChipElem.classList.remove('selected')
        } else {
          selectedDeptIds.add(chipId)
          deptChipElem.classList.add('selected')
        }
      }
    })
  }

  // Display the zones as options in the zone dropdown
  function displayCountyZonesOptions(countyId, selectTag) {
    const county = GeoReferenceData.find(c => c.county_id === countyId)
    selectTag.innerHTML = '<option value="" disabled selected>Select Zone</option>'
    if (county) {
      county.zones.forEach(zone => {
        const opt = document.createElement('option')
        opt.value = zone.id
        opt.textContent = zone.name
        selectTag.appendChild(opt)
      })
    }
  }

  // Display the counties as options in the county dropdown
  function displayCountyOptions(selectTag) {
    selectTag.innerHTML = '<option value="" disabled selected>Select County</option>'
    GeoReferenceData.forEach(county => {
      const opt = document.createElement('option')
      opt.value = county.county_id
      opt.textContent = county.county_name
      selectTag.appendChild(opt)
    })
  }

  // Set up the overlay to view and edit hospital details and activate/deactivate an account
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
        if (hospStatus === 'active') {
          document.querySelector('.js-status-badge')
            .classList.remove('inactive', 'archived')
        } else if (hospStatus === 'inactive') {
          document.querySelector('.js-status-badge')
            .classList.remove('active', 'archived')
        } else {
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
          .textContent = hospital.location.county_name
        document.getElementById('viewZone')
          .textContent = hospital.location.zone_name

        const deptFrag = document.createDocumentFragment()
        const deptContainerElem = document.getElementById('viewDepts')
        deptContainerElem.innerHTML = ``
        hospital.departments.forEach(dept => {
          const deptTag = document.createElement('span')
          deptTag.innerHTML = `<span class="view-tag">${dept.name}</span>`
          deptFrag.appendChild(deptTag)
        })
        deptContainerElem.appendChild(deptFrag)
      }

      // Display container to edit hospital details
      if (btn.classList.contains('edit-hos-btn')) {
        const editHosOverlayElem = document.getElementById('editHospitalOverlay')
        handleOverlay(editHosOverlayElem)

        const editHospCountyElem = document.getElementById('editHospCounty')
        const editHospZoneElem = document.getElementById('editHospZone')

        displayCountyOptions(editHospCountyElem)
        displayCountyZonesOptions(hospital.location.county_id, editHospZoneElem)

        editHospCountyElem.addEventListener('change', (e) => {
          const selectedId = parseInt(e.target.value)
          displayCountyZonesOptions(selectedId, editHospZoneElem)
        })

        document.getElementById('editHeaderHospName')
          .textContent = hospital.name
        document.getElementById('editStatus')
          .value = hospital.status
        document.getElementById('editUuid')
          .textContent = hospital.id
        document.getElementById('editHospName')
          .value = hospital.name
        document.getElementById('editHospContact')
          .value = hospital.contactPerson
        document.getElementById('editHospPhone')
          .value = hospital.phone
        document.getElementById('editHospEmail')
          .value = hospital.email
        editHospCountyElem.value = hospital.location.county_id
        editHospZoneElem.value = hospital.location.zone_id

        const editDeptContainerElem = document.getElementById('editDeptContainer')
        displayDeptChips(editDeptContainerElem)

        // Display chips already selected
        const hospDeptIds = hospital.departments.map(dept => dept.id)
        let selectedDeptIds = new Set()
        hospDeptIds.forEach(id => {
          selectedDeptIds.add(parseInt(id))
          const targetChip = document.querySelector(`.dept-chip[data-dept-id="${id}"]`)
          if (targetChip) {
            targetChip.classList.add('selected')
          }
        })

        handleDeptChipsToggle(editHosOverlayElem, selectedDeptIds)
      }

      // Notify user they are about to activate an account
      if (btn.classList.contains('activate-hos-btn')) {
        const activateHosOverlayElem = document.getElementById('activateHospitalOverlay')
        handleOverlay(activateHosOverlayElem)

        document.querySelector('.js-activate-hosp-name')
          .textContent = hospital.name
      }

      // Account Deactivation Notification
      if (btn.classList.contains('deactivate-hos-btn')) {
        const deactivateHosOverlayElem = document.getElementById('deactivateHospitalOverlay')
        handleOverlay(deactivateHosOverlayElem)

        document.querySelector('.js-deactivate-hosp-name')
          .textContent = hospital.name
      }
    })

  // Filtering/Search logic
  const hospitalSearchElem = document.getElementById('hospitalSearch')
  const statusFilterElem = document.getElementById('statusFilter')

  function searchFilterHandler() {
    const searchValue = hospitalSearchElem.value
    const statusValue = statusFilterElem.value

    const searchResult = HospitalMockData.filter((hos) => {
      const hospNameMatch = hos.name.toLowerCase().includes(searchValue.toLowerCase())
      const statusMatch = statusValue === 'all' || hos.status === statusValue

      return hospNameMatch && statusMatch
    })

    hosDetailsTbodyElem.innerHTML = ``
    if (searchResult.length === 0) {
      document.querySelector('.js-no-match-found')
        .classList.remove('hidden')
    } else {
      displayAllHospitals(searchResult)
      document.querySelector('.js-no-match-found')
        .classList.add('hidden')
    }
  }

  hospitalSearchElem.addEventListener('keyup', searchFilterHandler)
  statusFilterElem.addEventListener('change', searchFilterHandler)
})