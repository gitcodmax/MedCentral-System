import { renderSidebar } from "./sidebar.js"

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar()
  document.querySelector('.js-header-left')
    .innerHTML = `
    <div class="page-title">
      <h2>Hospital Management</h2>
    </div> 
  `

  // Set up the overlay
  const overlayElem = document.getElementById('addHospitalOverlay')
  document.getElementById('btnAddHospital')
    .addEventListener('click', () => {
      overlayElem.classList.add('active')

      document.querySelectorAll('.close-overlay')
        .forEach(btn => {
          btn.addEventListener('click', () => {
            overlayElem.classList.remove('active')
          })
        })

      overlayElem.addEventListener('click', (e) => {
        if (e.target === overlayElem) overlayElem.classList.remove('active')
    })
    })
})