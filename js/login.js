document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Get stored user data
        const userData = JSON.parse(localStorage.getItem('userData'));

        // Check if credentials match
        if (userData && userData.email === email && userData.password === password) {
            // Set login state
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            // Show error message
            showError('Invalid email or password');
        }
    });
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #e74c3c;
        background-color: #fde8e7;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        text-align: center;
    `;
    errorDiv.textContent = message;

    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Insert error message before the form
    const form = document.querySelector('form');
    form.parentNode.insertBefore(errorDiv, form);
}
