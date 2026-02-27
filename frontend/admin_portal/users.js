import { renderSidebar } from "./sidebar.js";
import {handleOverlay} from "/global.js";

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

  document.querySelector('.js-header-actions')
    .addEventListener('click', (e) => {
      // Toggle logic for the password "Eye" icon
      const toggleBtnElem = document.querySelector('.password-toggle');
      const passwordInputElem = document.getElementById('sysUserPassword');
      const iconElem = toggleBtnElem.querySelector('i');

      toggleBtnElem.addEventListener('click', () => {
        const isPassword = passwordInputElem.type === 'password';
        passwordInputElem.type = isPassword ? 'text' : 'password';
        iconElem.classList.toggle('fa-eye');
        iconElem.classList.toggle('fa-eye-slash');
      });

      // Container to create a new user
      if (e.target.id === 'createUserBtn') {
        const createUserOverlayElem = document.getElementById('createUserOverlay')   
        handleOverlay(createUserOverlayElem)
      }
    })
})