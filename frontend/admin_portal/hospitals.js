import { renderSidebar } from "./sidebar.js"
import { handleOverlay, displayNoMatchFound, 
  displayCountyOptions, displayCountyZonesOptions, 
 renderSuccessErrorOverlay, triggerStatus} from "../global.js"

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
                      <label for="hospName">Hospital Name</label>
                      <div class="input-wrapper">
                        <i class="fas fa-h-square"></i>
                        <input type="text" id="hospName" name="hosp_name" placeholder="e.g. Metro General Hospital" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hospContact">Contact Person</label>
                      <div class="input-wrapper">
                        <i class="fas fa-user-md"></i>
                        <input type="text" id="hospContact" name="hosp_contact" placeholder="Dr. Jane Smith" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hospPhone">Phone Number</label>
                      <div class="input-wrapper">
                        <i class="fas fa-phone"></i>
                        <input type="tel" id="hospPhone" name="hosp_phone" placeholder="+1 (555) 000-0000" required>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label for="hospEmail">Email Address</label>
                      <div class="input-wrapper">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="hospEmail" name="hosp_email" placeholder="admin@hospital-domain.org" required>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hospCounty">Hospital County</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-marker-alt"></i>
                        <select name="hosp_county" id="hospCounty" required>
                          <option value="" disabled selected>Select County</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="hospZone">Zone / Sub-County</label>
                      <div class="input-wrapper">
                        <i class="fas fa-map-signs"></i>
                        <select name="hosp_zone" id="hospZone" required></select>
                      </div>
                    </div>

                    <div class="form-group full-width">
                      <label>Select Active Departments</label>
                      <div id="deptContainer" class="dept-selector-grid"></div>
                    </div>

                    <div class="form-group full-width">
                      <label for="hospPwd">Password</label>
                      <div class="input-wrapper">
                        <i class="fas fa-key"></i>
                        <input type="text" id="hospPwd" name="hosp_pwd" placeholder="-----" required>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-cancel js-btn-close-overlay">Cancel</button>
                  <button type="submit" class="btn-submit" id="registerNewHospital">Register Facility</button>
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

              <form id="editHospitalForm">
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
                  <button class="btn-submit bg-success" id="activateHosBtn">Yes, Activate Account</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-overlay" id="deactivateHospitalOverlay">
            <div class="modal-card mini-modal">
              <div class="modal-status-header bg-danger">
                <i class="fas fa-user-slash"></i>
              </div>

              <form id="deactivationForm">
                <div class="modal-body">
                  <div class="text-center">
                    <h3>Deactivate Hospital?</h3>
                    <p>You are about to suspend <strong><span class="deactivate-hosp-name js-deactivate-hosp-name">General
                          Medical
                          Center</span></strong>.</p>
                  </div>

                  <div class="form-group full-width mt-1">
                    <label for="deactivate-reason">Reason for Deactivation <span class="text-danger">*</span></label>
                    <textarea class="deactivate-reason" id="deactivateReason"
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


          <div class="modal-overlay" id="resetPasswordOverlay">
            <div class="reset-pwd-modal-content" style="max-width: 400px;">
              <div class="reset-pwd-modal-header">
                  <h2>Reset Hospital Password</h2>
                  <p class="reset-pwd-header-p">
                      Resetting password for: <strong class="overlay-target-name" id="resetHosTarget"></strong>
                  </p>
              </div>

              <form id="resetPasswordForm">
                  <div class="form-group">
                      <label for="newPassword">New Password</label>
                      <div class="password-wrapper">
                          <input type="text" id="newPassword" class="form-control" placeholder="••••••••"
                              required>
                          <button type="button" class="password-toggle">
                              <i class="fas fa-eye"></i>
                          </button>
                      </div>
                  </div>

                  <div class="modal-footer">
                      <button type="button" class="btn-cancel js-btn-close-overlay">Cancel</button>
                      <button type="submit" class="btn-submit">Confirm Reset</button>
                  </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    `

  renderSuccessErrorOverlay()
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `
  displayNoMatchFound()

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
          `<button title="Edit" class="edit-hos-btn" data-hos-id=${hos.id}><i class="fas fa-edit"></i></button>
          <button class="reset-password-btn" data-hos-id=${hos.id} title="Reset Password"><i class="fas fa-key"></i></button>`
        }
        ${activeDeactiveBtnElem}
      </td>
    `

      hospitalDetailsTblFrag.appendChild(tblRow)
    })

    hosDetailsTbodyElem.appendChild(hospitalDetailsTblFrag)
  }

  // Display hospitals on the table
  async function displayDbHosData() {
    const hospitalsData = await getSavedHospitalsDetails()
    displayAllHospitals(hospitalsData)
  }
  displayDbHosData()

  // Displays the chips in the container
  async function displayDeptChips(deptContainerElem) {
    const MasterDepartments = await getDepartments()
    deptContainerElem.innerHTML = MasterDepartments.map(dept => `
      <div class="dept-chip" data-dept-id=${dept.id}>
        ${dept.name}
      </div>
    `).join('')
  }



  // Set up the overlay to add a new hospital
  const addHosOverlayElem = document.getElementById('addHospitalOverlay')
  document.getElementById('btnAddHospital')
    .addEventListener('click', async () => {
      handleOverlay(addHosOverlayElem)

      const GeoReferenceData = await getGeoRefData()

      const addHosCountyElem = document.getElementById('hospCounty')
      const addHosZoneElem = document.getElementById('hospZone')
      addHosZoneElem.value = ``
      displayCountyOptions(GeoReferenceData, addHosCountyElem)

      addHosCountyElem.addEventListener('change', (e) => {
        const selectedId = parseInt(e.target.value)
        displayCountyZonesOptions(GeoReferenceData, selectedId, addHosZoneElem)
      })


      let selectedDeptIds = new Set()
      const deptContainerElem = document.getElementById('deptContainer')
      await displayDeptChips(deptContainerElem)
      // Handles the toggling when the chips are clicked
      handleDeptChipsToggle(addHosOverlayElem, selectedDeptIds)

      // Submit new hospital details
      document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault()

        if (selectedDeptIds.size <= 2) {
          alert('Enter more than two departments for the hospital!!')
        } else {
          // Input Elements
          const nameInput = document.getElementById('hospName');
          const contactInput = document.getElementById('hospContact');
          const phoneInput = document.getElementById('hospPhone');
          const emailInput = document.getElementById('hospEmail');
          const zoneSelect = document.getElementById('hospZone');
          const passwordInput = document.getElementById('hospPwd');

          const response = await fetch('http://localhost:3000/admin/newHosDetails',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: nameInput.value,
                contact: contactInput.value,
                phone: phoneInput.value,
                email: emailInput.value,
                zone: zoneSelect.value,
                password: passwordInput.value,
                status: 'active',
                selectedDeptIds: [...selectedDeptIds]
              })
            }
          )

          const result = await response.json()
          if (result.newHosDetails) {
            triggerStatus('success')
            location.reload()
          } else {
            triggerStatus('error')
          }
        }
      })
    })

  //Get specific hospital details
  async function getHospitalDetails(btnId) {
    const hospitalsData = await getSavedHospitalsDetails()
    return hospitalsData.find(hos => hos.id === Number(btnId))
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

  // Set up the overlay to view and edit hospital details and activate/deactivate an account
  document.getElementById('hosDetailsTbody')
    .addEventListener('click', async (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      const btnHosId = btn.dataset.hosId
      const hospital = await getHospitalDetails(btnHosId)
      const GeoReferenceData = await getGeoRefData()

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

        const editStatusElem = document.getElementById('editStatus');
        const editUuidElem = document.getElementById('editUuid');
        const editHospNameElem = document.getElementById('editHospName');
        const editHospContactElem = document.getElementById('editHospContact');
        const editHospPhoneElem = document.getElementById('editHospPhone');
        const editHospEmailElem = document.getElementById('editHospEmail');
        const editHospCountyElem = document.getElementById('editHospCounty')
        const editHospZoneElem = document.getElementById('editHospZone')

        displayCountyOptions(GeoReferenceData, editHospCountyElem)
        displayCountyZonesOptions(GeoReferenceData, hospital.location.county_id, editHospZoneElem)

        editHospCountyElem.addEventListener('change', (e) => {
          const selectedId = parseInt(e.target.value)
          displayCountyZonesOptions(GeoReferenceData, selectedId, editHospZoneElem)
        })

        document.getElementById('editHeaderHospName')
          .textContent = hospital.name
        editStatusElem.value = hospital.status
        editUuidElem.textContent = hospital.id
        editHospNameElem.value = hospital.name
        editHospContactElem.value = hospital.contactPerson
        editHospPhoneElem.value = hospital.phone
        editHospEmailElem.value = hospital.email
        editHospCountyElem.value = hospital.location.county_id
        editHospZoneElem.value = hospital.location.zone_id

        const editDeptContainerElem = document.getElementById('editDeptContainer')
        await displayDeptChips(editDeptContainerElem)

        // Display chips already selected
        const hospDeptIds = hospital.departments.map(dept => Number(dept.id))
        const selectedDeptIds = new Set(hospDeptIds)
        hospDeptIds.forEach((id) => {
          const targetChip = editDeptContainerElem.querySelector(
            `.dept-chip[data-dept-id="${id}"]`
          )
          if (targetChip) targetChip.classList.add('selected')
        })

        handleDeptChipsToggle(editHosOverlayElem, selectedDeptIds)

        if (selectedDeptIds.size <= 2) {
          alert('Enter more than two departments for the hospital!!')
        } else {
          // Saving the updates made
          document.getElementById('editHospitalForm')
            .addEventListener('submit', async (e) => {
              e.preventDefault()

              const response = await fetch('http://localhost:3000/admin/updateHosDetails',
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    hosId: btnHosId,
                    name: editHospNameElem.value,
                    contact: editHospContactElem.value,
                    phone: editHospPhoneElem.value,
                    email: editHospEmailElem.value,
                    zone: editHospZoneElem.value,
                    status: editStatusElem.value,
                    selectedDeptIds: [...selectedDeptIds]
                  })
                }
              )

              const result = await response.json()
              if (result.updatedHosDetails) {
                triggerStatus('success')
                location.reload()
              } else {
                triggerStatus('error')
              }
            }, { once: true })
        }
      }

      // Notify user they are about to activate an account
      if (btn.classList.contains('activate-hos-btn')) {
        const activateHosOverlayElem = document.getElementById('activateHospitalOverlay')
        handleOverlay(activateHosOverlayElem)

        document.querySelector('.js-activate-hosp-name')
          .textContent = hospital.name

        activateHosOverlayElem.addEventListener('click', async (e) => {
          if (e.target.id === 'activateHosBtn') {
            const response = await fetch('http://localhost:3000/admin/activateHos',
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hosId: btnHosId })
              }
            )

            const result = await response.json()
            triggerStatus(result.msg)
          }
        })
      }

      // Account Deactivation Notification
      if (btn.classList.contains('deactivate-hos-btn')) {
        const deactivateHosOverlayElem = document.getElementById('deactivateHospitalOverlay')
        handleOverlay(deactivateHosOverlayElem)

        document.querySelector('.js-deactivate-hosp-name')
          .textContent = hospital.name

        document.getElementById('deactivationForm')
          .addEventListener('submit', async (e) => {
            e.preventDefault()

            const deactivateReasonElem = document.getElementById('deactivateReason')

            const response = await fetch('http://localhost:3000/admin/deactivateHos',
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  hosId: btnHosId,
                  reason: deactivateReasonElem.value
                })
              }
            )

            const result = await response.json()
            triggerStatus(result.msg)

          }, { once: true })
      }

      // Reset password notif
      if (btn.classList.contains('reset-password-btn')) {
        const resetPasswordOverlayElem = document.getElementById('resetPasswordOverlay')
        handleOverlay(resetPasswordOverlayElem)

        document.getElementById('resetHosTarget')
          .textContent = hospital.name
        const newPasswordElem = document.getElementById('newPassword')

        resetPasswordOverlayElem.addEventListener('submit', async (e) => {
          e.preventDefault()

          const response = await fetch('http://localhost:3000/admin/updateHosPassword',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ hosId: btnHosId, password: newPasswordElem.value })
            }
          )
          const result = await response.json()
          triggerStatus(result.msg)
        })
      }
    })

  // Filtering/Search logic
  const hospitalSearchElem = document.getElementById('hospitalSearch')
  const statusFilterElem = document.getElementById('statusFilter')

  async function searchFilterHandler() {
    const searchValue = hospitalSearchElem.value
    const statusValue = statusFilterElem.value

    const hospitalsData = await getSavedHospitalsDetails()
    const searchResult = hospitalsData.filter((hos) => {
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

// API calls
async function getSavedHospitalsDetails() {
  const response = await fetch('http://localhost:3000/admin/getSavedHospitals')
  const result = await response.json()
  return result.savedHos
}

export async function getGeoRefData() {
  const response = await fetch('http://localhost:3000/admin/getGeoRefData')
  const result = await response.json()
  return result.countyData
}

async function getDepartments() {
  const response = await fetch('http://localhost:3000/admin/getDepartments')
  const result = await response.json()
  return result.departmentsData
}