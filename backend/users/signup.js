document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        // Validate if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, username, email, password, confirmPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            // Signup successful, show a success message and redirect to login
            alert('Signup successful! You can now login.');
            window.location.href = '/login.html';  // Redirect to the login page
        } else {
            // Signup failed, show error message
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup');
    }
});
