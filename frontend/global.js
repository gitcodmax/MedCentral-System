export function getStorageTempIcon(storageTemp) {
  let storageTempIcon = 'fa-solid fa-house-medical-circle-check'
  if (storageTemp === 'crt') {
    storageTempIcon = `fas fa-thermometer-half`
  } else if (storageTemp === 'refrigerated') {
    storageTempIcon = `fas fa-snowflake`
  } else if (storageTemp === 'frozen') {
    storageTempIcon = `fas fa-icicles`
  }

  return storageTempIcon
}

export function displayNoMatchFound() {
  const noMatchElem = document.querySelector('.js-no-match-found')
  if (noMatchElem) {
    noMatchElem.innerHTML = `
      <div class="no-match-elements">
        <i class="fa-solid fa-face-frown frowned-face"></i>
        <p>No Match Found!!</p>
      </div>         
    `
  }
}

//Opens the overlay and closes it when the close buttons are clicked
//Used in org_portal and admin_portal
export function handleOverlay(overlay) {
  if (overlay) overlay.classList.add('active')

  document.querySelectorAll('.js-btn-close-overlay')
    .forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active')
      })
    })

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active')
    }
  })
}

// Display the zones as options in the zone dropdown
export function displayCountyZonesOptions(geoData, countyId, selectTag) {
  const county = geoData.find(c => c.county_id === countyId)
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
export function displayCountyOptions(geoData, selectTag) {
  selectTag.innerHTML = '<option value="" disabled selected>Select County</option>'
  geoData.forEach(county => {
    const opt = document.createElement('option')
    opt.value = county.county_id
    opt.textContent = county.county_name
    selectTag.appendChild(opt)
  })
}

// Add the html to display the success and error messages
export function renderSuccessErrorOverlay() {
  const successErrorHTML = `
    <div id="successOverlay" class="modal-overlay">
      <div class="modal-card db-notif-card">
        <div class="icon-wrapper success-theme">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="modal-title">Saved successfully</h2>
        <p class="modal-text">Records are now up to date.</p>
      </div>
    </div>

    <div id="errorOverlay" class="modal-overlay">
      <div class="modal-card db-notif-card">
        <div class="icon-wrapper error-theme">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 class="modal-title">Save failed</h2>
        <p class="modal-text">Could not connect to the server. Please retry.</p>
      </div>
    </div>
  `

  document.querySelector('main')
    ?.insertAdjacentHTML('beforeend', successErrorHTML)
  document.querySelector('.registry-container')
    ?.insertAdjacentHTML('beforeend', successErrorHTML)
  document.querySelector('.receipt-container')
    ?.insertAdjacentHTML('beforeend', successErrorHTML)
}

// Display the notification message based on db response
export function triggerStatus(type) {
  const overlayId = type === 'success' || type === 'successful' ? 'successOverlay' : 'errorOverlay';
  const dbNotifOverlay = document.getElementById(overlayId);

  handleOverlay(dbNotifOverlay)

  setTimeout(() => {
    location.reload()
    dbNotifOverlay.classList.remove('active');
    // 'Successful' is returned when receiving stock items only 
    // which needs deleting of the stock details stored in the session storage 
    // if the stock data was successfully saved.
    if (type === 'successful') {
      sessionStorage.removeItem("stockReceipt")
      window.location.href = 'http://localhost:3000/inv_clerk/receive_stock/receive_stock.html';
    }
  }, 3000);
}

export const getUserName = async (userId) => {
  const response = await fetch(`http://localhost:3000/login/getUserName`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }
  )

  const res = await response.json()
  return res.full_name
}

export const adminPagesLink = `http://localhost:3000/admin`
export const orgPortalPagesLink = `http://localhost:3000/org`
export const whManagerPagesLink = `http://localhost:3000/whManager`
export const invClerkPagesLink = `http://localhost:3000/invClerk`