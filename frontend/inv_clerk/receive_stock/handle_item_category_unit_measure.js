//This file controls the unit of measure options that are
// displayed depending on the item category selected

const packagingUnits = [
  { value: '', text: 'Select Unit' },
  { value: 'BOX', text: 'Box' },
  { value: 'CARTON', text: 'Carton/Case' },
  { value: 'VIAL', text: 'Vial' },
  { value: 'BOTTLE', text: 'Bottle' },
  { value: 'KIT', text: 'Kit' },
  { value: 'EACH', text: 'Each (Unit)' },
];

// Metric options for bulk and chemical items
const metricWeightUnits = [
  { value: '', text: 'Select Unit' },
  { value: 'KG', text: 'Kilogram (KG)' },
  { value: 'GM', text: 'Gram (GM)' },
  { value: 'MG', text: 'Milligram (MG)' },
];

// Metric options for liquid items
const metricVolumeUnits = [
  { value: '', text: 'Select Unit' },
  { value: 'LTR', text: 'Liter (LTR)' },
  { value: 'ML', text: 'Milliliter (ML)' },
];

// Metric options for length/area items
const metricLengthUnits = [
  { value: '', text: 'Select Unit' },
  { value: 'MTR', text: 'Meter (MTR)' },
  { value: 'MM', text: 'Millimeter (MM)' },
];


//Updates the unit of measure according to the category of the item
export const updateUnitOfMeasureOptions = (itemCategorySelect, unitOfMeasureSelect) => {
  const categorySelected = itemCategorySelect.value;
  let newOptions = packagingUnits

  if (categorySelected === 'bulk_chemical') {
    newOptions = metricWeightUnits;
  } else if (categorySelected === 'pharmaceutical_liquid') {
    newOptions = metricVolumeUnits;
  } else if (categorySelected === 'rolled_goods') {
    newOptions = metricLengthUnits;
  }

  unitOfMeasureSelect.innerHTML = ''

  newOptions.forEach((optionData) => {
    const option = document.createElement('option')
    option.value = optionData.value
    option.textContent = optionData.text
    unitOfMeasureSelect.appendChild(option)
  })

}