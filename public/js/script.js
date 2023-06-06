// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the user's ID when the page loads
    fetch('/api/user')
    .then(response => response.json())
    .then(data => {
        console.log('User ID:', data.userId);
        // Store the user ID in a global variable for later use
        window.userId = data.userId;
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Get the form element
    var form = document.getElementById('calculator-form');

    // Functionality if form is present
    if (form) {
        // Event listener for form submission
        form.addEventListener('submit', function (event) {
            // Prevent the form from submitting normally
            event.preventDefault();

            // Get the values of the form fields
            var name = document.getElementById('name').value;
            var age = document.getElementById('age').value;
            var height = document.getElementById('height').value;
            var weight = document.getElementById('weight').value;
            var gender = document.querySelector('input[name="gender"]:checked').value;
            var activity = document.getElementById('activity').value;
            var goal = document.querySelector('select[name="goal"]').value;

            console.log(`Form submitted with: 
                Name: ${name}
                Gender: ${gender}
                Age: ${age}
                Weight: ${weight}
                Height: ${height}
                Activity Level: ${activity}
                Goal: ${goal}`);

            // Validate the form fields
            if (age === '' || height === '' || weight === '') {
                alert('All fields are required!');
                return;  // exit the function if fields are empty
            } else if (age < 0 || height < 0 || weight < 0) {
                alert('Values must be positive!');
                return;  // exit the function if fields are negative
            }

            // Construct an object with the form data
            var data = {
                name: name,
                gender: gender,
                age: parseInt(age),
                weight: parseFloat(weight),
                height: parseFloat(height),
                activity: activity,
                goal: goal
            };

            console.log('Data to be sent to the server:', data);

            // Send a POST request to the server
            fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                alert(data.message);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    // Fetching tracker data when the tracker page loads
    var trackerForm = document.getElementById('tracker-form');
    if (trackerForm) {
        window.onload = function() {
            getData();
        }

        // When the tracker form is submitted
        trackerForm.addEventListener('submit', function(e) {
            console.log("Form submission event triggered.");
            e.preventDefault();

            // Get form data
            var date = document.getElementById('date').value;
            var caloriesEaten = document.getElementById('caloriesEaten').value;
            var caloriesBurned = document.getElementById('caloriesBurned').value;
            var weight = document.getElementById('weight').value;
            var user_id = sessionStorage.getItem('user_id');

            // Send a POST request
            var data = {
                date: date,
                caloriesEaten: parseInt(caloriesEaten),
                caloriesBurned: parseInt(caloriesBurned),
                weight: parseFloat(weight),
                user_id: window.user_id
            };

            fetch('/trackerData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                alert(data.message);
                getData();
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        });

        function getData() {
            var user_id = sessionStorage.getItem('user_id');
            // Send a GET request to '/trackerData'
            fetch('/trackerData?user_id=${window.user_id}')
                .then(response => response.json())
                .then(data => {
                    console.log('Server response:', data);
                    
                    // Clear the existing table rows
                    const table = document.getElementById('history-table').getElementsByTagName('tbody')[0];
                    table.innerHTML = '';
        
                    // Clear the existing chart data
                    const ctx = document.getElementById('progress-chart').getContext('2d');
                    if(window.chart) {
                        window.chart.destroy();
                    }

                    // Sort the data array by date in ascending order
                    data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
                    data.forEach(item => {
                        // Convert date string to a JavaScript Date object
                        var date = new Date(item.date);
                        // Convert date object to local date string
                         var localDate = date.toLocaleDateString();

                        // Add a new row to the table for each item
                        const row = table.insertRow();
                        row.innerHTML = `
                            <td>${localDate}</td>
                            <td>${item.caloriesEaten}</td>
                            <td>${item.caloriesBurned}</td>
                            <td>${item.weight}</td>
                        `;
                    });
        
                    // Create a new chart with the data
                    window.chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: data.map(item => {
                                var date = new Date(item.date);
                                return date.toLocaleDateString();
                            }),
                            datasets: [{
                                label: 'Weight',
                                data: data.map(item => item.weight),
                                fill: false,
                                borderColor: "#2b50a0",
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: false,
                            scales: {
                                x: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    display: true,
                                    title: {
                                        display: true,
                                        text: 'Weight (lbs)'
                                    }
                                }
                            }
                        }
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        
        // Fetch data every 30 seconds (30000 milliseconds)
        setInterval(getData, 30000);
    }

    // Registration form handling
    var registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        // Validate the form data
        if (username === '' || password === '' || confirmPassword === '') {
            alert('All fields are required!');
            return;  // exit the function
        } else if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;  // exit the function
        }

        // Prepare data to be sent to the server
        var data = {
            username: username,
            password: password
        };

        // Send a POST request to the server
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                // Redirect user to login page or home page
                window.location.href = '/login';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

    // Login form handling
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        // Validate the form data
        if (username === '' || password === '') {
            alert('Both fields are required!');
            return;  // exit the function
        }

        // Prepare data to be sent to the server
        var data = {
            username: username,
            password: password
        };

        // Send a POST request to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                // Redirect user to home page
                window.location.href = '/';
            } else {
                alert(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}
});
