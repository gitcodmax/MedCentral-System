import { renderSuccessErrorOverlay, triggerStatus } from "../global.js";
import { getGeoRefData } from "./hospitals.js";
import { renderSidebar } from "./sidebar.js";
import { handleOverlay, displayCountyOptions, displayCountyZonesOptions } from "/global.js";

document.addEventListener('DOMContentLoaded', async () => {

  document.querySelector('.app-container')
    .innerHTML = `
        <div class="sidebar" id="sidebar"></div>

        <div class="main-wrapper">
            <header class="top-header" id="topHeader"></header>

            <main class="page-content">
                <div class="header-actions js-header-actions">
                    <button class="btn header-btn" id="createUserBtn"><i class="fas fa-user-plus"></i> Create
                        User</button>
                    <button class="btn header-btn" id="addDriverBtn"><i class="fas fa-truck-pickup"></i> Add
                        Driver</button>
                </div>

                <div class="card" id="sysUsersCard">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="sysUsersTbody"></tbody>
                        </table>
                    </div>
                </div>

                <div class="card hidden" id="driversCard">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Phone Number</th>
                                    <th>Vehicle No.</th>
                                    <th>Preferred County</th>
                                    <th>Preferred Zone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="driversTbody"></tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-overlay" id="createUserOverlay">
                    <div class="create-user-modal-content">
                        <div class="modal-header">
                            <h2>Create System User</h2>
                        </div>
                        <form>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control" placeholder="e.g. Jane" required>
                                </div>
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control" placeholder="e.g. Doe" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" class="form-control" placeholder="jane@warehouse.com" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Role</label>
                                    <select class="form-control" required>
                                        <option value="">Select User Role...</option>
                                        <option>Warehouse Manager</option>
                                        <option>Inventory Clerk</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <div class="password-wrapper">
                                        <input type="password" id="sysUserPassword" class="form-control"
                                            placeholder="••••••••" required>
                                        <button type="button" class="password-toggle">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group inline-flex">
                                <label>Active Account</label>
                                <label class="switch"><input type="checkbox" checked><span
                                        class="slider"></span></label>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn close-overlay-btn js-btn-close-overlay">Cancel</button>
                                <button type="submit" class="btn save-btn">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-overlay" id="addDriverOverlay">
                    <div class="add-driver-modal-content">
                        <div class="modal-header">
                            <h2>Add New Driver</h2>
                            <p class="modal-subtitle">Register a delivery partner and assign preferred zones.</p>
                        </div>

                        <form>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="driverFirstName">First Name</label>
                                    <input type="text" id="driverFirstName" class="form-control" placeholder="e.g. John"
                                        required>
                                </div>
                                <div class="form-group">
                                    <label for="driverLastName">Last Name</label>
                                    <input type="text" id="driverLastName" class="form-control" placeholder="e.g. Doe"
                                        required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone">Phone Number</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="phone" class="form-control" placeholder="+254..."
                                            required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="vehicleNo">Vehicle Number</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-truck"></i>
                                        <input type="text" id="vehicleNo" class="form-control" placeholder="KXX 000X"
                                            required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section-title">Logistics Preferences</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="county">Preferred County</label>
                                    <select id="addDriverCtySelect" class="form-control" required></select>
                                </div>
                                <div class="form-group">
                                    <label for="zone">Preferred Zone</label>
                                    <select id="addDriverZoneSelect" class="form-control" required></select>
                                </div>
                            </div>

                            <div class="form-group inline-flex status-row">
                                <div class="status-info">
                                    <label>Active for Assignments</label>
                                    <small>Allow this driver to be assigned to new delivery tasks immediately.</small>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>

                            <div class="modal-footer">
                                <button type="button"
                                    class="btn close-overlay-btn js-btn-close-overlay">Discard</button>
                                <button type="submit" class="btn save-btn">Register Driver</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-overlay" id="editUserOverlay">
                    <div class="create-user-modal-content">
                        <div class="modal-header">
                            <h2>Edit System User</h2>
                            <p class="edit-header-p">Modifying details for <span class="overlay-target-name"></span>
                            </p>
                        </div>

                        <form id="editUserForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>First Name</label>
                                    <input type="text" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" class="form-control" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" class="form-control" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Role</label>
                                    <select class="form-control" required>
                                        <option value="2">Warehouse Manager</option>
                                        <option value="1">Inventory Clerk</option>
                                    </select>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn close-overlay-btn js-btn-close-overlay">Cancel</button>
                                <button type="submit" class="btn save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-overlay" id="editDriverOverlay">
                    <div class="add-driver-modal-content">
                        <div class="modal-header">
                            <h2>Edit Driver Details</h2>
                            <p class="modal-subtitle">Update contact information or modify geographic service zones.</p>
                        </div>

                        <form id="editDriverForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editDriverFirstName">First Name</label>
                                    <input type="text" id="editDriverFirstName" class="form-control"
                                        required>
                                </div>
                                <div class="form-group">
                                    <label for="editDriverLastName">Last Name</label>
                                    <input type="text" id="editDriverLastName" class="form-control"
                                        required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editPhone">Phone Number</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-phone"></i>
                                        <input type="tel" id="editPhone" class="form-control"
                                            required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="editVehicleNo">Vehicle Number</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-truck"></i>
                                        <input type="text" id="editVehicleNo" class="form-control"
                                            required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section-title">Logistics Preferences</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editCounty">Preferred County</label>
                                    <select id="editDriverCounty" class="form-control" required></select>
                                </div>
                                <div class="form-group">
                                    <label for="editZone">Preferred Zone</label>
                                    <select id="editDriverZone" class="form-control" required></select>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn close-overlay-btn js-btn-close-overlay">Cancel
                                    Changes</button>
                                <button type="submit" class="btn save-btn">Update Driver</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-overlay" id="resetPasswordOverlay">
                    <div class="reset-pwd-modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h2>Reset User Password</h2>
                            <p class="reset-pwd-header-p">
                                Resetting password for: <strong class="overlay-target-name" id="resetUserTarget"></strong>
                            </p>
                        </div>

                        <form id="resetPasswordForm">
                            <div class="form-group">
                                <label for="newPassword">New Temporary Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="newPassword" class="form-control" placeholder="••••••••"
                                        required>
                                    <button type="button" class="password-toggle">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn close-overlay-btn js-btn-close-overlay">Cancel</button>
                                <button type="submit" class="btn save-btn">Confirm Reset</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal-overlay" id="deactivateOverlay">
                    <div class="deactivate-modal-content">

                        <div class="warning-icon-wrapper">
                            <i class="fas fa-user-slash"></i>
                        </div>

                        <div class="modal-header">
                            <h2>Confirm Deactivation</h2>
                            <p class="deactiv-header-p">
                                You are about to deactivate <strong class="overlay-target-name"
                                    id="deactivateTargetName">Sarah Connor</strong>.
                            </p>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn close-overlay-btn js-btn-close-overlay">
                                Keep Active
                            </button>
                            <button type="button" id="confirmDeactivateBtn" class="btn save-btn">
                                Deactivate Now
                            </button>
                        </div>
                    </div>
                </div>

                <div class="modal-overlay" id="activateOverlay">
                    <div class="activate-modal-content">

                        <div class="success-icon-wrapper">
                            <i class="fas fa-user-check"></i>
                        </div>

                        <div class="modal-header">
                            <h2>Confirm Activation</h2>
                            <p class="activ-header-p">
                                Restoring access for <strong class="overlay-target-name" id="reactivateTargetName">Harvey Specter</strong>.
                            </p>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn close-overlay-btn js-btn-close-overlay">
                                Keep Inactive
                            </button>
                            <button type="button" id="confirmReactivateBtn" class="btn save-btn">
                                Activate Now
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `

  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
      <div class="header-section">
        <h2>User Management</h2>
        <nav class="tabs-nav" id="tabsNav">
            <a href="#" class="tab-link active sys-users-link">System Users</a>
            <a href="#" class="tab-link drivers-link">Drivers</a>
        </nav>
      </div>
    `
  renderSuccessErrorOverlay()
  const GeoReferenceData = await getGeoRefData();

  const sysUsers = await getAllSysUsers()
  const drivers = await getAllDrivers()

  const systemUsersTbodyElem = document.getElementById('sysUsersTbody')
  const driversTbodyElem = document.getElementById('driversTbody')

  // Populate the json data in the system users table
  const sysUsersTableFrag = document.createDocumentFragment()
  const formatLastLogin = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  sysUsers.forEach(user => {
    const tblRow = document.createElement('tr')
    const statusLower = user.status.toLowerCase()
    const isActive = statusLower === 'active'
    tblRow.innerHTML = `
      <td><strong class="full-name">${user.firstName} ${user.lastName}</strong></td>
      <td>${user.email}</td>
      <td><span class="user-badge user-role">${user.role_id === 1 ? 'Inventory Clerk' : 'Warehouse Manager'}</span></td>
      <td><span class="user-badge status-${statusLower}">${user.status}</span></td>
      <td>${!user.lastLogin ? 'Not yet logged in' : formatLastLogin(user.lastLogin)}</td>
      <td>
          <div class="action-group">
              <button class="btn-icon edit-user-details-btn" data-user-id=${user.id} title="Edit"><i
                      class="fas fa-edit"></i></button>
              <button class="btn-icon reset-user-pwd-btn" data-user-id=${user.id} title="Reset Password"><i
                      class="fas fa-key"></i></button>
              <button class="btn-icon ${isActive ? 'btn-status-active deactivate-user-btn' : 'btn-status-inactive activate-user-btn'}"
                  data-user-id=${user.id} title="${isActive ? 'Deactivate User' : 'Activate User'}">
                  <i class="fas fa-${isActive ? 'unlock' : 'lock'}"></i>
              </button>
          </div>
      </td>
    `
    sysUsersTableFrag.appendChild(tblRow)
  })
  systemUsersTbodyElem.appendChild(sysUsersTableFrag)

  // Populate the mock data in the drivers table
  const driversTableFrag = document.createDocumentFragment()
  drivers.forEach(driver => {
    const tblRow = document.createElement('tr')
    const statusLower = driver.status.toLowerCase()
    const isActive = statusLower === 'active'
    tblRow.innerHTML = `
      <td><strong class="full-name">${driver.firstName} ${driver.lastName}</strong></td>
      <td>${driver.phone}</td>
      <td>${driver.vehicleNo}</td>
      <td>${driver.county_name}</td>
      <td>${driver.zone_name}</td>
      <td><span class="user-badge status-${statusLower}">${driver.status}</span></td>
      <td>
          <div class="action-group">
              <button class="btn-icon edit-driver-details-btn" data-driver-id=${driver.id} title="Edit"><i
                      class="fas fa-edit"></i></button>
              <button class="btn-icon ${isActive ? 'btn-status-active deactivate-driver-btn' :
        'btn-status-inactive activate-driver-btn'}" 
                title="${isActive ? 'Deactivate Driver' : 'Activate Driver'}" 
                data-driver-id=${driver.id}
              >
                  <i class="fas fa-${isActive ? 'unlock' : 'lock'}""></i>
              </button>
          </div>
      </td>
    `

    driversTableFrag.appendChild(tblRow)
  })
  driversTbodyElem.appendChild(driversTableFrag)

  // Navigation tab buttons code
  document.getElementById('tabsNav')
    .addEventListener('click', (e) => {
      const sysUsersCardElem = document.getElementById('sysUsersCard')
      const driversCardElem = document.getElementById('driversCard')

      if (e.target.classList.contains('drivers-link')) {
        document.querySelector('.sys-users-link')
          .classList.remove('active')
        e.target.classList.add('active')
        sysUsersCardElem.classList.add('hidden')
        driversCardElem.classList.remove('hidden')
      }

      if (e.target.classList.contains('sys-users-link')) {
        document.querySelector('.drivers-link')
          .classList.remove('active')
        e.target.classList.add('active')
        sysUsersCardElem.classList.remove('hidden')
        driversCardElem.classList.add('hidden')
      }
    })

  // Toggle logic for the password "Eye" icon
  const bindPasswordToggles = (() => {
    let isBound = false;

    return function toggleEyePassword() {
      if (isBound) return;
      isBound = true;

      document.addEventListener('click', (e) => {
        const toggleBtnElem = e.target.closest('.password-toggle');
        if (!toggleBtnElem) return;

        const wrapperElem = toggleBtnElem.closest('.password-wrapper');
        const passwordInputElem = wrapperElem?.querySelector('input');
        if (!passwordInputElem) return;

        passwordInputElem.type = passwordInputElem.type === 'password' ? 'text' : 'password';
        const isShowing = passwordInputElem.type === 'text';

        toggleBtnElem.querySelectorAll('i').forEach((iconElem) => {
          iconElem.classList.toggle('fa-eye', !isShowing);
          iconElem.classList.toggle('fa-eye-slash', isShowing);
        });
      });
    };
  })();

  // bind once; works for all password inputs/buttons in this page (even inside overlays)
  bindPasswordToggles();

  // Create a new user and add a new driver overlays
  document.querySelector('.js-header-actions')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      // Overlay to create a new user
      if (btn.id === 'createUserBtn') {
        const createUserOverlayElem = document.getElementById('createUserOverlay')
        handleOverlay(createUserOverlayElem)
      }

      // Overlay to add a new driver
      if (btn.id === 'addDriverBtn') {
        const addDriverOverlayElem = document.getElementById('addDriverOverlay')
        handleOverlay(addDriverOverlayElem)

        const addDriverCntySelectElem = document.getElementById('addDriverCtySelect')
        const addDriverZoneSelectElem = document.getElementById('addDriverZoneSelect')
        addDriverZoneSelectElem.value = ``
        displayCountyOptions(GeoReferenceData, addDriverCntySelectElem)

        addDriverCntySelectElem.addEventListener('change', (e) => {
          displayCountyZonesOptions(GeoReferenceData,
            parseInt(e.target.value), document.getElementById('addDriverZoneSelect'))
        })
      }
    })

  // Get a user's details
  function getUserDetails(userId, userType) {
    if (userType === 'system user') {
      return sysUsers.find(user => user.id === userId)
    } else if (userType === 'driver') {
      return drivers.find(driver => driver.id === userId)
    }
  }

  const deactivateOverlayElem = document.getElementById('deactivateOverlay')
  const activateOverlayElem = document.getElementById('activateOverlay')
  // System User action buttons(Edit, change password, activate, deactivate)
  systemUsersTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const btnUserId = Number(btn.dataset.userId)
    const userData = getUserDetails(btnUserId, 'system user')
    document.querySelectorAll('.overlay-target-name')
      .forEach(targetNameElem => targetNameElem.textContent = `${userData.firstName} ${userData.lastName}`)

    // Edit user details button
    if (btn.classList.contains('edit-user-details-btn')) {
      const editUserOverlayElem = document.getElementById('editUserOverlay')
      const form = document.getElementById('editUserForm')
      const inputs = form.querySelectorAll('input.form-control')
      const roleSelect = form.querySelector('select.form-control')
      if (userData) {
        inputs[0].value = userData.firstName
        inputs[1].value = userData.lastName
        inputs[2].value = userData.email
        roleSelect.value = userData.role_id
      }
      handleOverlay(editUserOverlayElem)

      form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const inputFullName = inputs[0].value + ' ' + inputs[1].value

        const response = await fetch('http://localhost:3000/admin/updateSysUsersData',
          {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              fullName: inputFullName,
              email: inputs[2].value,
              roleId: Number(roleSelect.value),
              userId: btnUserId
            })
          }
        )

        const result = await response.json()
        triggerStatus(result.msg)
      }, { once: true })
    }

    if (btn.classList.contains('reset-user-pwd-btn')) {
      const resetPwdOverlayElem = document.getElementById('resetPasswordOverlay')
      handleOverlay(resetPwdOverlayElem)

      document.getElementById('resetPasswordForm')
        .addEventListener('submit', async (e) => {
          e.preventDefault()

          const newPasswordElem = document.getElementById('newPassword')
          const response = await fetch('http://localhost:3000/admin/updateSysUsersPassword',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: btnUserId,
                plainPwd: newPasswordElem.value
              })
            }
          )

          const res = await response.json()
          triggerStatus(res.msg)

        }, { once: true })
    }

    if (btn.classList.contains('deactivate-user-btn')) {
      handleOverlay(deactivateOverlayElem)

      document.getElementById('confirmDeactivateBtn')
        .addEventListener('click', () => {
          updateDbStatus(btnUserId, userData.status, 'sysUser')
        }, { once: true })
    }

    if (btn.classList.contains('activate-user-btn')) {
      handleOverlay(activateOverlayElem)

      document.getElementById('confirmReactivateBtn')
        .addEventListener('click', () => {
          updateDbStatus(btnUserId, userData.status, 'sysUser')
        }, { once: true })
    }
  })

  // Driver action buttons(Edit, activate, deactivate)
  driversTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const btnDriverId = Number(btn.dataset.driverId)
    const userData = getUserDetails(btnDriverId, 'driver')
    document.querySelectorAll('.overlay-target-name')
      .forEach(targetNameElem => targetNameElem.textContent = `${userData.firstName} ${userData.lastName}`)

    if (btn.classList.contains('edit-driver-details-btn')) {
      const editDriverOverlayElem = document.getElementById('editDriverOverlay')

      const editDriverFirstNameElem = document.getElementById('editDriverFirstName')
      const editDriverLastNameElem = document.getElementById('editDriverLastName')
      const editPhoneElem = document.getElementById('editPhone')
      const editVehicleNoElem = document.getElementById('editVehicleNo')
      const editCountySelectElem = document.getElementById('editDriverCounty')
      const editZoneSelectElem = document.getElementById('editDriverZone')

      displayCountyOptions(GeoReferenceData, editCountySelectElem)
      if (userData) {
        displayCountyZonesOptions(GeoReferenceData, userData.county_id, editZoneSelectElem)
        editDriverFirstNameElem.value = userData.firstName
        editDriverLastNameElem.value = userData.lastName
        editPhoneElem.value = userData.phone
        editVehicleNoElem.value = userData.vehicleNo
        editCountySelectElem.value = userData.county_id
        editZoneSelectElem.value = userData.zone_id
      }
      handleOverlay(editDriverOverlayElem)

      editCountySelectElem.addEventListener('change', (e) => {
        displayCountyZonesOptions(GeoReferenceData, parseInt(e.target.value), editZoneSelectElem)
      })

      document.getElementById('editDriverForm')
        .addEventListener('submit', async (e) => {
          e.preventDefault()
          const driverFullName = editDriverFirstNameElem.value + ' ' + editDriverLastNameElem.value

          const response = await fetch('http://localhost:3000/admin/updateDriverData',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fullName: driverFullName,
                phoneNo: editPhoneElem.value,
                vehicleNo: editVehicleNoElem.value,
                zoneId: editZoneSelectElem.value,
                driverId: btnDriverId
              })
            })

          const res = await response.json()
          triggerStatus(res.msg)
        }, { once: true })
    }

    if (btn.classList.contains('deactivate-driver-btn')) {
      handleOverlay(deactivateOverlayElem)

      document.getElementById('confirmDeactivateBtn')
        .addEventListener('click', () => {
          updateDbStatus(btnDriverId, userData.status, 'driver')
        }, { once: true })
    }

    if (btn.classList.contains('activate-driver-btn')) {
      handleOverlay(activateOverlayElem)

      document.getElementById('confirmReactivateBtn')
        .addEventListener('click', () => {
          updateDbStatus(btnDriverId, userData.status, 'driver')
        }, { once: true })
    }
  })
})

async function getAllSysUsers() {
  const response = await fetch('http://localhost:3000/admin/getAllSysUsers')
  const result = await response.json()
  return result.sysUsersMod
}

async function getAllDrivers() {
  const response = await fetch('http://localhost:3000/admin/getAllDrivers')
  const result = await response.json()
  return result.allDriversMod
}

// Used by the buttons to activate and deactivate a user and driver
async function updateDbStatus(btnUserId, currentStatus, userType) {
  const response = await fetch(`http://localhost:3000/admin/deActivateUser`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: btnUserId,
        status: currentStatus.toLowerCase(),
        userType
      })
    }
  )

  const res = await response.json()
  triggerStatus(res.msg)
}