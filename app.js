// Require necessary modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

// Initialise the app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Use middleware to parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cityUniversitySubhaanMajid1',
    database: 'calories'
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Define a route to handle form submissions
app.post('/calculate', (req, res) => {
    // Get data from the request body
    console.log(req.body);  // Log the form data to the console
    const { name, gender, age, weight, height, activity, goal } = req.body;

    // Calculation logic here
    let bmr;
    let calorieIntake;

    // calculate BMR (Basal Metabolic Rate)
    if (gender === 'male') {
        bmr = 66.47 + (6.24 * weight) + (12.7 * height) - (6.755 * age);
    } else {  // assuming gender === 'female'
        bmr = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
    }

    // Adjust BMR based on activity level
    if (activity === 'sedentary') {
        calorieIntake = bmr * 1.2;
    } else if (activity === 'light') {
        calorieIntake = bmr * 1.375;
    } else if (activity === 'moderate') {
        calorieIntake = bmr * 1.55;
    } else {
        calorieIntake = bmr * 1.725;
    }

    // Adjust calorie intake based on goal
    if (goal === 'lose') {
        // Decrease by 500 to lose around 1 lb per week
        calorieIntake -= 500;
    } else if (goal === 'gain') {
        // Increase by 500 to gain around 1 lb per week
        calorieIntake += 500;
    }

    // format result
    const result = {
        name: name,
        calorieIntake: Math.round(calorieIntake)
    };

    // Calculate the number of calories (replace this with your actual calculation)
    //const calories = weight * height * age * activityLevel;

    // SQL query to insert data into the 'Calories' table
    const sql = 'INSERT INTO Calories (name, gender, age, weight, height, activity, goal, calories) VALUES ?';
    const values = [
        [name, gender, age, weight, height, activity, goal, Math.round(calorieIntake)]
    ];
    db.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});

// Define a route handler for GET requests to all the URLs.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'page1.html'));
});
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'page2.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
