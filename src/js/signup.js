document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const baseUrl = "http://festquest-backend:8080";

    // Functions
    /**
     * Handles the signup process by sending user data to the server.
     * @param {Event} event - The form submission event.
     */
    async function handleSignup(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${baseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            console.log(response);

            if (response.ok) {
                alert('Signup successful! Redirecting to login...');
                window.location.href = './login.html';
            } else {
                console.log("error when creating");
                const errorMessage = await response.text();
                alert(`Signup failed: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    // Event listeners
    signupForm.addEventListener('submit', handleSignup);
});
