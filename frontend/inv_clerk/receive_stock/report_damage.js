import { renderHeader } from "../header.js";

document.addEventListener('DOMContentLoaded', () => {
  renderHeader()

  document.querySelector('.form-wrapper')
    .innerHTML = `   
      <header class="form-header">
          <h1 class="main-title">Enter details to report a damaged or compromised item</h1>
      </header>

      <form id="reportDamageForm">
          
          <div class="form-section">
              <h2 class="section-title">Item Identification</h2>
              <div class="form-grid">
                  <div class="input-group">
                      <label for="damageItemCode">Item Code:</label>
                      <input type="text" id="damageItemCode" placeholder="e.g., PAR-500MG" required>
                  </div>
                  <div class="input-group">
                      <label for="damageBatchNo">Batch/Lot No.:</label>
                      <input type="text" id="damageBatchNo" required>
                  </div>
                  <div class="input-group">
                      <label for="discoveryDate">Date & Time Discovered:</label>
                      <input type="datetime-local" id="discoveryDate" required>
                  </div>
              </div>
          </div>

          <div class="form-section">
              <h2 class="section-title">Damage Details</h2>
              <div class="form-grid">
                  <div class="input-group">
                      <label for="damageType">Nature of Damage:</label>
                      <select id="damageType" required>
                          <option value="">Select Damage Type</option>
                          <option value="broken_seal">Broken Seal / Tampered</option>
                          <option value="leakage">Leakage / Spillage</option>
                          <option value="crushed">Crushed / Physical Damage</option>
                          <option value="temp_breach">Temperature Breach (Cold Chain)</option>
                          <option value="expired">Expired on Shelf</option>
                          <option value="other">Other (Explain Below)</option>
                      </select>
                  </div>
                  <div class="input-group">
                      <label for="damageQty">Quantity Affected:</label>
                      <input type="number" id="damageQty" required min="1">
                  </div>
                  <div class="input-group" style="grid-column: span 2;">
                      <label for="damageDescription">Detailed Description:</label>
                      <textarea id="damageDescription" rows="3" placeholder="Describe how the damage was found..."></textarea>
                  </div>
              </div>
          </div>

          <div class="form-section">
              <h2 class="section-title">Evidence & Immediate Action</h2>
              <div class="form-grid">
                  <div class="input-group">
                      <label for="damagePhoto">Upload Photo Evidence:</label>
                      <input type="file" id="damagePhoto" accept="image/*" required>
                  </div>
                  <div class="input-group">
                      <label for="immediateAction">Action Taken:</label>
                      <select id="immediateAction" required>
                          <option value="">Select Action</option>
                          <option value="quarantine">Moved to Quarantine Area</option>
                          <option value="disposed">Disposed (Biohazard/Waste)</option>
                          <option value="held">Left in place for Manager Inspection</option>
                      </select>
                  </div>
              </div>
          </div>
          
          <div class="center-button-container">
              <button type="reset" class="clear-btn">Clear Details</button>
              <button type="submit" class="confirm-btn" style="margin: 0;">Submit Damage Report</button>
          </div>
      </form>
    `

  // Simple script to set default discovery time to "now"
  document.getElementById('discoveryDate').value = dayjs().format("YYYY-MM-DD HH:mm");

  const damageNatureSelectElem = document.getElementById('damageType')
  const damageDescriptionElem = document.getElementById('damageDescription')

  //When user chooses other as nature of damage they have fill a detailed explanation
  damageNatureSelectElem.addEventListener('change', () => {
    if (damageNatureSelectElem.value === 'other') {
      damageDescriptionElem.required = true
    } else {
      damageDescriptionElem.required = false
    }
  })
})