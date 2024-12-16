document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            const href = backButton.getAttribute('data-href');
            if (href) {
                // Using window.location.href is allowed when called from a script file
                window.location.href = href;
            }
        });
    }
});
