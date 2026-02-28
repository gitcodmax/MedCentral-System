import { renderSidebar } from "./sidebar.js";
import { handleOverlay } from "/global.js";

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
      // Overlay to create a new user
      if (e.target.id === 'createUserBtn') {
        const createUserOverlayElem = document.getElementById('createUserOverlay')
        handleOverlay(createUserOverlayElem)
      }

      // Overlay to add a new driver
      if (e.target.id === 'addDriverBtn') {
        const addDriverOverlayElem = document.getElementById('addDriverOverlay')
        handleOverlay(addDriverOverlayElem)
      }
    })

  const deactivateOverlayElem = document.getElementById('deactivateOverlay')
  const activateOverlayElem = document.getElementById('activateOverlay')
  // System User action buttons(Edit, change password, activate, deactivate)
  document.getElementById('sysUsersTbody')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      // Edit user details button
      if (btn.classList.contains('edit-user-details-btn')) {
        const editUserOverlayElem = document.getElementById('editUserOverlay')
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
  document.getElementById('driversTbody')
    .addEventListener('click', (e) => {
      const btn = e.target.closest('button')
      if (!btn) return;

      if (btn.classList.contains('edit-driver-details-btn')) {
        const editDriverOverlayElem = document.getElementById('editDriverOverlay')
        handleOverlay(editDriverOverlayElem)
      }

      if (btn.classList.contains('deactivate-driver-btn')) {
        handleOverlay(deactivateOverlayElem)
      }

      if (btn.classList.contains('activate-driver-btn')) {
        handleOverlay(activateOverlayElem)
      }
    })
})