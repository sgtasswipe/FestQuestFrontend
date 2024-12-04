import alerts from './misc/alerts.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const baseUrl = "http://localhost:8080";
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log(response);

        if (response.ok) {
            alerts.success('Login successful', 'Redirecting to home page');
            setTimeout(() => {
                window.location.href = '../html/index.html'; // Redirect after alert
            }, 1000);
        } else {
            alerts.warning('Login failed', 'Please check your email and password',2400);
        }
    });
});
