// Variables
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
});

// Functions
/**
 * Handles user login by sending credentials to the server and processing the response.
 */
async function handleLogin(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }) // Convert data to JSON
        });

        if (response.ok) {
            const authorization = response.headers.get('Authorization'); // Get the token from headers

            // Store the JWT token in localStorage
            localStorage.setItem('jwt', authorization);
            
            // Redirect to the index page
            window.location.href = 'index.html';
        } else {
            alert('Invalid login credentials'); // Inform the user
        }
    } catch (error) {
        console.error('Login error:', error); // Log any error
    }
}
