// Define a logout function
function logout() {
    // Send a GET request to the server to log the user out
    fetch('/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
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
        // If the server responded that the logout was successful
        if (data.message === 'Logout successful') {
            alert('Logged out successfully!');
        }
    })
    // Catch and display any errors that occurred during the request
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Attach the logout function to the logout button's click event
document.getElementById('logout').addEventListener('click', logout);
