
//Close the overlay by clicking the x icon
export function xRemoveOverlay(overlay) {
  if (overlay.classList.contains('active')) {
    document.querySelectorAll('.js-close-overlay-btn, .js-btn-no')
      .forEach(btn => {
        btn.addEventListener('click', () => {
          overlay.classList.remove('active');
        });
      });
  }
}

//Click the overlay to close it
export function clickToRemoveOverlay(overlay) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active')
    }
  })
}

//Renders the no match message to the page
export function displayNoMatch(){
  const noMatchElem = document.querySelectorAll('.js-no-match-container')
  noMatchElem.forEach(elem => {
    elem.innerHTML = `
    <div class="no-match-elements">
      <i class="fa-solid fa-face-frown frowned-face"></i>
      <p>No Match Found!!</p>
    </div>
  `
  })
}