document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const baseUrl = "http://localhost:8080";
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${baseUrl}/dologin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            console.log('Full response:', response);
            const jwt = response.headers.get('Authorization');
            console.log('JWT Token:', jwt);

            if (jwt) {
                localStorage.setItem('jwt', jwt);
                localStorage.setItem('userEmail', email);
                window.location.href = '../html/index.html';
            } else {
                alert('No token received');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});