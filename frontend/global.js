export function getStorageTempIcon(storageTemp){
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

export function displayNoMatchFound(){
  const noMatchElem = document.querySelector('.js-no-match-found')
  if(noMatchElem){
    noMatchElem.innerHTML = `
      <div class="no-match-elements">
        <i class="fa-solid fa-face-frown frowned-face"></i>
        <p>No Match Found!!</p>
      </div>         
    `
  }
}