//
// JavaScript for Form Validation (MedCentral Login)
//

document.querySelector('.js-login-container')
  .innerHTML = `        
    <header class="system-header">
        <img src="images/MedCentral_logo_small.png">
    </header>

    <div class="login-card">
        
        <h2 class="card-title">SIGN IN</h2>

        <form id="loginForm">
            
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" required>
                <small class="error-text" id="usernameError"></small>
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
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Function to clear all existing error messages
    const clearErrors = () => {
        usernameError.textContent = '';
        passwordError.textContent = '';
    };

    // Function to validate the form inputs
    const validateForm = () => {
        let isValid = true;
        clearErrors(); // Start by clearing old errors

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 1. Validate Username
        if (username === '') {
            usernameError.textContent = 'Username is required.';
            isValid = false;
        } 
        // Optional: Add more complex validation (e.g., minimum length, format check)
        // else if (username.length < 4) {
        //     usernameError.textContent = 'Username must be at least 4 characters long.';
        //     isValid = false;
        // }

        // 2. Validate Password
        if (password === '') {
            passwordError.textContent = 'Password is required.';
            isValid = false;
        }
        // Optional: Add more complex validation (e.g., minimum length)
        // else if (password.length < 8) {
        //     passwordError.textContent = 'Password must be at least 8 characters long.';
        //     isValid = false;
        // }

        return isValid;
    };

    // Attach the validation function to the form's submit event
    loginForm.addEventListener('submit', (event) => {
        // Prevent the default form submission (which would refresh the page)
        event.preventDefault(); 

        // Run the validation check
        if (validateForm()) {
            // If validation passes (isValid is true):
            
            // In a real application, you would send the data to a server here:
            // fetch('/api/login', { method: 'POST', body: new FormData(loginForm) })
            //   .then(response => ...)

            // For this static demo, we'll just log success and reset the form
            console.log('Login successful! Navigating to dashboard...');
            
            // Example of a simulated success action:
            alert('Login successful! (In a real system, you would now be redirected.)');
            loginForm.reset();
            clearErrors(); // Clear the form and any residual errors

        } else {
            // If validation fails (isValid is false)
            console.log('Login failed: Please check the highlighted fields.');
            // The error messages are already set by validateForm()
        }
    });
});