// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
// Get the form element
var form = document.getElementById('calculator-form');

// Add an event listener for form submission
form.addEventListener('submit', function (event) {
    // prevent the form from submitting normally
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
        return;  // exit the function
    } else if (age < 0 || height < 0 || weight < 0) {
        alert('Values must be positive!');
        return;  // exit the function
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
});

// Fetching tracker data when the tracker page loads.
var trackerForm = document.getElementById('tracker-form');
if (trackerForm) {
    window.onload = function() {
        getData();
    }

    // When the tracker form is submitted
    trackerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        var date = document.getElementById('date').value;
        var caloriesEaten = document.getElementById('caloriesEaten').value;
        var caloriesBurned = document.getElementById('caloriesBurned').value;
        var weight = document.getElementById('weight').value;

        // Send a POST request
        var data = {
            date: date,
            caloriesEaten: parseInt(caloriesEaten),
            caloriesBurned: parseInt(caloriesBurned),
            weight: parseFloat(weight)
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // After the POST request is complete, get the data again
        getData();
    });

    function getData() {
        // Send a GET request to '/trackerData'
        fetch('/trackerData')
            .then(response => response.json())
            .then(data => {
                // Update the table and chart with the data
                // ...
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
