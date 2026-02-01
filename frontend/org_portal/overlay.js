//Opens the overlay and closes it when the close buttons are clicked
export function handleOverlay(overlay) {
  overlay.classList.add('active')

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