document.addEventListener("DOMContentLoaded", () => {
    // Attach event listener for the login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

// Asynchronous function to handle login
async function handleLogin(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Collect input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(email, password); // Debugging logs
    console.log("Starting login process...");

    try {
        // Send POST request to backend
        const response = await fetch('http://localhost:8080/dologin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }) // Convert data to JSON
        });

        // Check if the response is successful
        if (response.ok) {
            const authorization = response.headers.get('Authorization'); // Get the token from headers

                console.log("Authorization token received:", authorization);

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
