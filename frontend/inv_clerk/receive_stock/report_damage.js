import { invClerkPagesLink } from "../../global.js";
import { renderHeader } from "../header.js";

document.addEventListener('DOMContentLoaded', async () => {
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
                      <label for="damageItemName">Item Name:</label>
                      <select id="damageItemName" required>
                          <option value="">Select Item Name</option>
                      </select>
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

  const itemsDamages = await getItemsDamages()

  // Set up items names as options
  const damageItemNameSelectElem = document.getElementById('damageItemName')
  const itemNamesOptions = itemsDamages.items.map(item =>
    `<option value="${item.itemId}">${item.itemName}</option>`).join(' ')
  damageItemNameSelectElem.innerHTML += itemNamesOptions

  // Set up damage types as options
  const damageNatureSelectElem = document.getElementById('damageType')
  const damageTypesOptions = itemsDamages.damageTypes.map(dType =>
    `<option value="${dType.damageId}">${dType.damageLabel}</option>`).join(' ')
  damageNatureSelectElem.innerHTML += damageTypesOptions

  const damageDescriptionElem = document.getElementById('damageDescription')

  //When user chooses other as nature of damage they have fill a detailed explanation
  damageNatureSelectElem.addEventListener('change', () => {
    const dmgType = itemsDamages.damageTypes.find(dmg => dmg.damageLabel.toLowerCase().includes('other'))
    if (damageNatureSelectElem.value === `${dmgType.damageId}`) {
      damageDescriptionElem.required = true
    } else {
      damageDescriptionElem.required = false
    }
  })
})

const getItemsDamages = async () => {
  const response = await fetch(`${invClerkPagesLink}/getItemsDamages`)
  const res = await response.json()
  return res.items_damages
}