// Wait until the document has fully loaded to ensure all elements are accessible
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the login form
    var form = document.getElementById('login-form');

    // If the form exists
    if (form) {
        // Add a submit event listener
        form.addEventListener('submit', function(event) {
            // Prevent the form from doing a default form submission
            event.preventDefault();
            
            // Retrieve the input values from the form
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            // Check if the input fields are filled
            if (username === '' || password === '') {
                alert('All fields are required!');
                return;
            }
            
            // Prepare the data to be sent to the server
            var data = {
                username: username,
                password: password
            };

            // Send a POST request to the server with the login data
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    // If the response was not ok (status other than 2xx), throw error
                    throw new Error(response.statusText);
                }

                // Parse the response as JSON
                return response.json();
            })
            .then(data => {
                // If the server responded that the login was successful
                if (data.message === 'Login successful') {
                    alert('Logged in successfully!');
                    // Redirect the user to the tracker page
                    window.location.href = '/tracker';
                } else {
                    // Unexpected success message
                    alert('Unexpected success message: ' + data.message);
                }
            })
            // Catch and display any errors that occurred during the request
            .catch((error) => {
                alert('Failed to log in. Please check your username and password.');
                console.error('Error:', error);
            });
        });
    }
});
