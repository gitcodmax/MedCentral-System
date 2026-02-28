import { renderSidebar } from "./sidebar.js";
import { handleOverlay, displayCountyOptions, displayCountyZonesOptions } from "/global.js";

document.addEventListener('DOMContentLoaded', () => {
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

  const UsersMockData = {
    "systemUsers": [
      {
        "id": "USR-001",
        "firstName": "Sarah",
        "lastName": "Connor",
        "email": "s.connor@warehouse.com",
        "role": "Inventory Clerk",
        "status": "Active",
        "lastLogin": "2026-02-28T08:30:00Z"
      },
      {
        "id": "USR-002",
        "firstName": "Mike",
        "lastName": "Ross",
        "email": "m.ross@warehouse.com",
        "role": "Warehouse Manager",
        "status": "Active",
        "lastLogin": "2026-02-27T17:15:00Z"
      },
      {
        "id": "USR-003",
        "firstName": "Elena",
        "lastName": "Fisher",
        "email": "e.fisher@warehouse.com",
        "role": "Inventory Clerk",
        "status": "Active",
        "lastLogin": "2026-02-28T09:00:00Z"
      },
      {
        "id": "USR-004",
        "firstName": "Harvey",
        "lastName": "Specter",
        "email": "h.specter@warehouse.com",
        "role": "Warehouse Manager",
        "status": "Inactive",
        "lastLogin": "2026-01-12T11:20:00Z"
      },
      {
        "id": "USR-005",
        "firstName": "Arthur",
        "lastName": "Morgan",
        "email": "a.morgan@warehouse.com",
        "role": "Inventory Clerk",
        "status": "Active",
        "lastLogin": "2026-02-25T14:05:00Z"
      }
    ],
    "drivers": [
      {
        "id": "DRV-501",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+254 712 345 678",
        "vehicleNo": "KDB 123X",
        "county_id": 47,
        "county_name": "Nairobi",
        "zone_id": 4701,
        "zone_name": "Westlands",
        "status": "Active"
      },
      {
        "id": "DRV-502",
        "firstName": "Amos",
        "lastName": "Burton",
        "phone": "+254 722 987 654",
        "vehicleNo": "KCC 777Z",
        "county_id": 1,
        "county_name": "Mombasa",
        "zone_id": 102,
        "zone_name": "Nyali",
        "status": "Active"
      },
      {
        "id": "DRV-503",
        "firstName": "James",
        "lastName": "Holden",
        "phone": "+254 733 111 222",
        "vehicleNo": "KDD 456Y",
        "county_id": 47,
        "county_name": "Nairobi",
        "zone_id": 4704,
        "zone_name": "Embakasi",
        "status": "Inactive"
      },
      {
        "id": "DRV-504",
        "firstName": "Naomi",
        "lastName": "Nagata",
        "phone": "+254 700 444 555",
        "vehicleNo": "KAA 999A",
        "county_id": 41,
        "county_name": "Kisumu",
        "zone_id": 4101,
        "zone_name": "Kisumu Central",
        "status": "Active"
      },
      {
        "id": "DRV-505",
        "firstName": "Alex",
        "lastName": "Kamal",
        "phone": "+254 788 000 333",
        "vehicleNo": "KBZ 555B",
        "county_id": 32,
        "county_name": "Nakuru",
        "zone_id": 3204,
        "zone_name": "Lanet",
        "status": "Active"
      }
    ]
  }

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

  const systemUsersTbodyElem = document.getElementById('sysUsersTbody')
  const driversTbodyElem = document.getElementById('driversTbody')

  // Populate the json data in the system users table
  const sysUsersTableFrag = document.createDocumentFragment()
  const formatLastLogin = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  UsersMockData.systemUsers.forEach(user => {
    const tblRow = document.createElement('tr')
    const statusLower = user.status.toLowerCase()
    const isActive = statusLower === 'active'
    tblRow.innerHTML = `
      <td><strong class="full-name">${user.firstName} ${user.lastName}</strong></td>
      <td>${user.email}</td>
      <td><span class="user-badge user-role">${user.role}</span></td>
      <td><span class="user-badge status-${statusLower}">${user.status}</span></td>
      <td>${formatLastLogin(user.lastLogin)}</td>
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
  UsersMockData.drivers.forEach(driver => {
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
      return UsersMockData.systemUsers.find(user => user.id === userId)
    } else if (userType === 'driver') {
      return UsersMockData.drivers.find(driver => driver.id === userId)
    }
  }

  const deactivateOverlayElem = document.getElementById('deactivateOverlay')
  const activateOverlayElem = document.getElementById('activateOverlay')
  // System User action buttons(Edit, change password, activate, deactivate)
  systemUsersTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const userData = getUserDetails(btn.dataset.userId, 'system user')
    document.querySelectorAll('.overlay-target-name')
      .forEach(targetNameElem => targetNameElem.textContent = `${userData.firstName} ${userData.lastName}`)

    // Edit user details button
    if (btn.classList.contains('edit-user-details-btn')) {
      const editUserOverlayElem = document.getElementById('editUserOverlay')
      if (userData) {
        const form = document.getElementById('editUserForm')
        const inputs = form.querySelectorAll('input.form-control')
        const roleSelect = form.querySelector('select.form-control')
        inputs[0].value = userData.firstName
        inputs[1].value = userData.lastName
        inputs[2].value = userData.email
        roleSelect.value = userData.role
      }
      handleOverlay(editUserOverlayElem)
    }

    if (btn.classList.contains('reset-user-pwd-btn')) {
      const resetPwdOverlayElem = document.getElementById('resetPasswordOverlay')
      handleOverlay(resetPwdOverlayElem)
    }

    if (btn.classList.contains('deactivate-user-btn')) {
      handleOverlay(deactivateOverlayElem)
    }

    if (btn.classList.contains('activate-user-btn')) {
      handleOverlay(activateOverlayElem)
    }
  })

  // Driver action buttons(Edit, activate, deactivate)
  driversTbodyElem.addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return;

    const userData = getUserDetails(btn.dataset.driverId, 'driver')
    document.querySelectorAll('.overlay-target-name')
      .forEach(targetNameElem => targetNameElem.textContent = `${userData.firstName} ${userData.lastName}`)

    if (btn.classList.contains('edit-driver-details-btn')) {
      const editDriverOverlayElem = document.getElementById('editDriverOverlay')

      const editCountySelectElem = document.getElementById('editDriverCounty')
      const editZoneSelectElem = document.getElementById('editDriverZone')

      displayCountyOptions(GeoReferenceData, editCountySelectElem)
      if (userData) {
        displayCountyZonesOptions(GeoReferenceData, userData.county_id, editZoneSelectElem)
        document.getElementById('editDriverFirstName').value = userData.firstName
        document.getElementById('editDriverLastName').value = userData.lastName
        document.getElementById('editPhone').value = userData.phone
        document.getElementById('editVehicleNo').value = userData.vehicleNo
        editCountySelectElem.value = userData.county_id
        editZoneSelectElem.value = userData.zone_id
      }
      handleOverlay(editDriverOverlayElem)

      editCountySelectElem.addEventListener('change', (e) => {
        displayCountyZonesOptions(GeoReferenceData, parseInt(e.target.value), editZoneSelectElem)
      })
    }

    if (btn.classList.contains('deactivate-driver-btn')) {
      handleOverlay(deactivateOverlayElem)
    }

    if (btn.classList.contains('activate-driver-btn')) {
      handleOverlay(activateOverlayElem)
    }
  })
})