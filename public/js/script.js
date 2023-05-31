// Get the form element
var form = document.getElementById('calorieForm');

// Add an event listener for form submission
form.addEventListener('submit', function (event) {
    // Get the values of the form fields
    var age = document.getElementById('age').value;
    var height = document.getElementById('height').value;
    var weight = document.getElementById('weight').value;

    // Validate the form fields
    if (age === '' || height === '' || weight === '') {
        alert('All fields are required!');
        event.preventDefault();
    } else if (age < 0 || height < 0 || weight < 0) {
        alert('Values must be positive!');
        event.preventDefault();
    }
});
