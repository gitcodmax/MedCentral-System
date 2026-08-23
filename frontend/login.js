//
// JavaScript for Form Validation (MedCentralis Login)
//

document.querySelector('.js-login-container')
  .innerHTML = `        
    <header class="system-header">
        <img src="images/MedCentralis_logo.png">
    </header>

    <div class="login-card">
        
        <h2 class="card-title">SIGN IN</h2>

        <form id="loginForm">
            
            <div class="input-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required>
                <small class="error-text" id="emailError"></small>
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required>
                <small class="error-text" id="passwordError"></small>
            </div>

            <div class="action-links">
                <a href="#" class="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" id="loginButton">Sign In</button>

        </form>
        
    </div>            
  `

document.addEventListener('DOMContentLoaded', () => {
  // Get the form and the submit button
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Function to clear all existing error messages
  const clearErrors = () => {
    emailError.textContent = '';
    passwordError.textContent = '';
  };

  // Function to validate the form inputs
  const validateForm = () => {
    let isValid = true;
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === '') {
      emailError.textContent = 'Email is required.';
      isValid = false;
    }

    if (password === '') {
      passwordError.textContent = 'Password is required.';
      isValid = false;
    }

    return { isValid, email, password };
  };

  const redirectToDash = (roleId) => {
    if (roleId === 1) {
      window.location.href = `http://localhost:3000/inv_clerk/inv_clerk_dash.html`
    } else if (roleId === 2) {
      window.location.href = `http://localhost:3000/wh_manager/wh_manager_dash.html`
    } else if (roleId === 3) {
      window.location.href = `http://localhost:3000/org_portal/dash.html`
    } else if (roleId === 4) {
      window.location.href = `http://localhost:3000/admin_portal/dash.html`
    }
  }

  // Attach the validation function to the form's submit event
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const validateFormVal = validateForm()
    // Run the validation check
    if (validateFormVal.isValid) {
      const response = await fetch('http://localhost:3000/login/getUserDetails',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            {
              email: validateFormVal.email,
              password: validateFormVal.password
            }
          )
        }
      )

      const res = await response.json()
      if (res.msg === 'success') {
        loginForm.reset();
        clearErrors();
        for (i of ['userId', 'hosId']) {
          sessionStorage.removeItem(i)
        }

        if (res.role === 3) {
          sessionStorage.setItem('hosId', res.hosId)
        } else {
          sessionStorage.setItem('userId', res.userId)
        }

        redirectToDash(res.role)
      }
      if (res.msg === `Invalid credentials`) {
        alert(`Invalid credentials!! Try Again!!`)
      }

    } else {
      alert('Login failed: Please check the highlighted fields.');
    }
  });
});