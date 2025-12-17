document.addEventListener('DOMContentLoaded', () => {

  const stockReceipt = JSON.parse(sessionStorage.getItem('stockReceipt')) || {}

  console.log(stockReceipt)

  document.querySelector('.js-go-back-btn')
    .addEventListener('click', () => {
      console.log('Go back button clicked')
      window.history.back()
    })
})