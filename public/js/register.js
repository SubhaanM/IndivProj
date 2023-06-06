// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {

    // Get the registration form element
    var form = document.getElementById('register-form');

    // Check if the form exists
    if (form) {

        // Add an event listener for form submission
        form.addEventListener('submit', function(event) {
            // Prevent the form from submitting normally
            event.preventDefault();

            // Get the values of the form fields
            var username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            var password = document.getElementById('password').value;

            // Validate the form fields
            if (username === '' || email === '' || password === '') {
                alert('All fields are required!');
                return;
            }

            // Construct an object with the user's data
            var data = {
                username: username,
                email: email,
                password: password
            };

            // Send a POST request to the server with the user's data
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                // If the server responds with a non-ok status code (not 2xx), throw an error
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                // Parse the response as JSON
                return response.json();
            })
            .then(data => {
                // Display the server's message
                if (data.message) {
                    alert(data.message);
                }
                // If the registration was successful, redirect the user to the login page
                if (data.success) {
                    window.location.href = '/login';
                }
            })
            // Log any errors that occurred during the request
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});