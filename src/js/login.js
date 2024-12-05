document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/dologin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });


        if (response.ok) {
            const authorization = response.headers.get('Authorization');

            if (authorization) {
                console.log(authorization)
                localStorage.setItem('jwt', authorization);
                window.location.href = 'index.html';
            }
        } else {
            alert('Invalid login credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}
