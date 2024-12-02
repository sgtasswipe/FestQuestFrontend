document.addEventListener("DOMContentLoaded", () => {
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const baseUrl = "http://localhost:8080";
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch( `${baseUrl}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });
    console.log(response)

    if (response.ok) {
        alert('Login successful!');
        window.location.href = '../html/index.html'; // Redirect to dashboard
    } else {
        alert('Invalid login. Please try again.');
    }
})});
