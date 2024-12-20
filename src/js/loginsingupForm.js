const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const container = document.querySelector(".container");
const baseUrl = "http://40.127.181.161";

// Event listeners for sliding between forms
signInBtn.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

// Event listeners for form submissions
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

// Functions
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const authorization = response.headers.get('Authorization');

            localStorage.setItem('jwt', authorization);

            window.location.href = 'questboard.html';
        } else {
            alert('Invalid login credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleSignup(event) {
    event.preventDefault();

    const form = event.target;
    const firstName = form.querySelector('input[name="firstName"]').value;
    const lastName  = form.querySelector('input[name="lastName"]').value;
    const email     = form.querySelector('input[name="email"]').value;
    const password  = form.querySelector('input[name="password"]').value;

    try {
        const response = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        if (response.ok) {
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Signup successful!';
            successMessage.style.cssText = 'color: green; margin: 10px 0;';
            signupForm.insertBefore(successMessage, signupForm.firstChild);
            setTimeout(() => successMessage.remove(), 3000);
            setTimeout(() => {
                // Switch to the login form after a delay
                container.classList.remove("right-panel-active");
            }, 2000); // Delay of 2 seconds
        } else {
            const errorMessage = await response.text();
            alert(`Signup failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
