/**
 * Login Page JavaScript
 * Handles user authentication and login functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginId = document.getElementById('loginId');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors
        FormValidator.clearError('loginIdError');
        FormValidator.clearError('loginPasswordError');
        FormValidator.clearError('formError');

        // Validate inputs
        if (!validateLoginForm()) {
            return;
        }

        // Disable button and show loading
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';

        try {
            const loginIdValue = loginId.value.trim();
            const passwordValue = loginPassword.value;

            // Call login API
            const response = await APIClient.post('/auth/login', {
                identifier: loginIdValue,
                password: passwordValue
            });

            // Store auth token and user data
            Storage.set('authToken', response.token);
            Storage.set('user', response.user);

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } catch (error) {
            console.error('Login Error:', error);
            document.getElementById('formError').textContent = 'Login failed. Please check your credentials.';
            document.getElementById('formError').style.display = 'block';

            // Re-enable button
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    });

    // Real-time validation
    loginId.addEventListener('blur', validateLoginId);
    loginPassword.addEventListener('blur', validateLoginPassword);

    // Clear error on input
    loginId.addEventListener('input', function() {
        if (this.value.trim()) {
            FormValidator.clearError('loginIdError');
        }
    });

    loginPassword.addEventListener('input', function() {
        if (this.value) {
            FormValidator.clearError('loginPasswordError');
        }
    });

    // Check if already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
});

/**
 * Validate login ID (Partner ID or Mobile)
 */
function validateLoginId() {
    const loginId = document.getElementById('loginId').value.trim();
    const errorSpan = document.getElementById('loginIdError');

    if (!loginId) {
        FormValidator.showError('loginIdError', 'Partner ID or Mobile Number is required');
        return false;
    }

    // Check if it's a mobile number or Partner ID format
    const isMobile = FormValidator.isValidMobile(loginId);
    const isPartnerId = /^4S\d{4,}$/i.test(loginId);

    if (!isMobile && !isPartnerId) {
        FormValidator.showError('loginIdError', 'Please enter a valid Partner ID or Mobile Number');
        return false;
    }

    FormValidator.clearError('loginIdError');
    return true;
}

/**
 * Validate login password
 */
function validateLoginPassword() {
    const password = document.getElementById('loginPassword').value;
    const errorSpan = document.getElementById('loginPasswordError');

    if (!password) {
        FormValidator.showError('loginPasswordError', 'Password is required');
        return false;
    }

    if (password.length < 6) {
        FormValidator.showError('loginPasswordError', 'Password must be at least 6 characters');
        return false;
    }

    FormValidator.clearError('loginPasswordError');
    return true;
}

/**
 * Validate entire login form
 */
function validateLoginForm() {
    const isIdValid = validateLoginId();
    const isPasswordValid = validateLoginPassword();

    return isIdValid && isPasswordValid;
}