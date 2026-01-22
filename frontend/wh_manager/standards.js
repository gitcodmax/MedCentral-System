const adminStandards = {
  categories: [
      "Antibiotics",
      "Vaccines",
      "Analgesics",
      "Surgical Gear",
      "IV Fluids",
      "Diagnostics",
      "Consumables",
      "Diabetes Care"
  ],

  storageTemps: [
      "Ambient (15°C to 25°C)",
      "CRT (Controlled Room Temp)",
      "Refrigerated (2°C to 8°C)",
      "Frozen (-20°C)"
  ],

  uomOptions: [
      "Pallet",
      "Crate",
      "Carton",
      "Box",
      "Pack",
      "Bundle"
  ],

  sellingUnits: [
      "Vial",
      "Tablet",
      "Strip",
      "Pen",
      "Bottle",
      "Dose",
      "Pair",
      "Kit",
      "Single Item"
  ]
};

//Displays all the options in the select tags as defined by the admin
export function populateDropdowns() {
  const mappings = [
      { data: adminStandards.categories, elementId: 'categorySelect' },
      { data: adminStandards.storageTemps, elementId: 'tempSelect' },
      { data: adminStandards.uomOptions, elementId: 'uomSelect' },
      { data: adminStandards.sellingUnits, elementId: 'sellingUnitSelect' }
  ];

  mappings.forEach(mapping => {
      const selectElement = document.getElementById(mapping.elementId);
      if (selectElement) {
          mapping.data.forEach(optionText => {
              const opt = document.createElement('option');
              opt.value = optionText;
              opt.textContent = optionText;
              selectElement.appendChild(opt);
          });
      }
  });
}