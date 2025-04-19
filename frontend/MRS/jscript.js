document.getElementById('sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Handle success (e.g., redirect to homepage)
            window.location.href = '/';  // Redirect to homepage or another page after successful login
        } else {
            // Handle error (e.g., show error message)
            alert(data.message);  // Show the error message returned from the server
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
});
