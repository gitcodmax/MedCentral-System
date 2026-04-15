import { whManagerPagesLink } from "../global.js";

const getAdminStandards = async () => {
  const response = await fetch(`${whManagerPagesLink}/getAdminStandards`)
  const res = await response.json()
  return res.admin_standards
}

export async function populateDropdowns() {
  const adminStandards = await getAdminStandards()

  const mappings = [
      { data: adminStandards.categories, elementId: 'categorySelect' },
      { data: adminStandards.storageTemps, elementId: 'tempSelect' },
      { data: adminStandards.uomOptions, elementId: 'uomSelect' },
      { data: adminStandards.uomOptions, elementId: 'sellingUnitSelect' }
  ];

  mappings.forEach(mapping => {
      const selectElement = document.getElementById(mapping.elementId);
    if (selectElement) {
        mapping.data.forEach(obj => {
              const opt = document.createElement('option');
              opt.value = obj.id;
              opt.textContent = obj.name;
              selectElement.appendChild(opt);
          });
      }
  });
}