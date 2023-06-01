// Get the form element
var form = document.getElementById('calorieForm');

// Add an event listener for form submission
form.addEventListener('submit', function (event) {
    // prevent the form from submitting normally
    event.preventDefault();

    // Get the values of the form fields
    var age = document.getElementById('age').value;
    var height = document.getElementById('height').value;
    var weight = document.getElementById('weight').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var activity = document.querySelector('input[name="activity"]:checked').value;
    var goal = document.querySelector('input[name="goal"]:checked').value;

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
    // make a fetch request to the /calculate route
    fetch('/calculate', {
        method: 'POST',
        body: new URLSearchParams({
            'age': age,
            'height': height,
            'weight': weight,
            'gender': gender,
            'activity': activity,
            'goal': goal
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.json())
    .then(data => {
        // display the response message to the user
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
