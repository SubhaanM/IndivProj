// Necessary modules
const express = require('express');
const cors = require('cors'); //cross-origin resource sharing
const bcrypt = require('bcrypt'); //this is for password hashing
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

// Initialise the app
const app = express();

// Enabling CORS for all routes
app.use(cors());

// Use middleware to parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Serve JS and CSS files from their specific directories
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting up session for user
app.use(session({
    secret: 'secret-key', // choose a secret string which is used to sign the session ID cookie
    resave: false, // do not force session to be saved back to the session store
    saveUninitialized: false, // do not save uninitialised sessions to the store
}));

// Middleware for every request to store referrer URL or original URL
app.use((req, res, next) => {
    // Store the referrer URL or original URL in the session
    req.session.redirectTo = req.headers.referer || req.originalUrl;
    // Continue to the next middleware in the stack
    next();
  });

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cityUniversitySubhaanMajid1',
    database: 'calories'
});

// Connect to the database and handle errors
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route for calculating BMR and caloric intake
app.post('/calculate', (req, res) => {
    // Get data from the request body
    const { name, gender, age, weight, height, activity, goal } = req.body;
    // Calculation logic here
    let bmr;
    let calorieIntake;

    // Calculations from line 75-89 reference based on https://www.omnicalculator.com/health/bmr-harris-benedict-equation
    // Calculate BMR (Basal Metabolic Rate)
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

    // SQL query to insert data into the 'Calories' table
    const sql = 'INSERT INTO Calories (name, gender, age, weight, height, activity, goal, calories) VALUES ?';
    const values = [
        [name, gender, age, weight, height, activity, goal, Math.round(calorieIntake)]
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Database Query Error for /calculate route:', err);
            return res.status(500).json({ message: 'An error occurred while saving your data' });
        }
        console.log("Number of records inserted: " + result.affectedRows);
    });

    // Send a response back to the client
    res.json({ message: `The calculated calorie intake for ${name} is ${calorieIntake}` });
});

app.post('/trackerData', (req, res) => {
    // Extract the userId from the request session
    const { userId } = req.session;

    // If the user isn't logged in, respond with an error
    if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to do that' });
    }

    // Get data from the request body
    const { date, caloriesEaten, caloriesBurned, weight } = req.body;

    // SQL query to insert data into the 'Nutrition' table
    const sql = 'INSERT INTO Nutrition (user_Id, date, caloriesEaten, caloriesBurned, weight) VALUES ?';
    const values = [
        [userId, date, caloriesEaten, caloriesBurned, weight]
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Database Query Error for /trackerData route:', err);
            return res.status(500).json({ message: 'An error occurred while saving your data' });
        }
        console.log("Number of records inserted: " + result.affectedRows);
        // Send a response back to the client
        res.json({ message: `Data for ${date} is saved` });
    });
});

app.get('/trackerData', (req, res) => {
    // Extract the userId from the request session
    const { userId } = req.session;

    // If the user isn't logged in, respond with an error
    if (!userId) {
        return res.status(401).json({ message: 'You must be logged in to do that' });
    }

    // SQL query to get data from the 'Nutrition' table
    const sql = 'SELECT * FROM Nutrition WHERE user_id = ? ORDER BY date DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;

        // Send the results back to the client
        res.json(results);
    });
});

// User registration route
app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    if (username.length < 5) {
        return res.status(400).json({ message: 'Username should be at least 5 characters' });
    }
    // Validate email format
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/; //used chat.openai.com here to find the regular expression for email addresses.
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }

    // Check if username is already in use
    const sqlSelect = 'SELECT * FROM Users WHERE username = ?';
    db.query(sqlSelect, [username], async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        // Hash the password with bcrypt (credits to https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user data into the 'Users' table
        const sqlInsert = 'INSERT INTO Users (username, email, password) VALUES ?';
        const values = [
            [username, email, hashedPassword]
        ];
        db.query(sqlInsert, [values], (err, result) => {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);

            // Respond to the client
            res.json({ message: 'Registration successful' });
        });
    });
});

// User login route
app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if the user exists
    const sqlSelect = 'SELECT * FROM Users WHERE username = ?';
    db.query(sqlSelect, [username], async (err, result) => {
        if (err) { 
            console.error(err);
            throw err;
        }
        console.log(result);
        if (result.length === 0) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Retrieve the hashed password from the database query result
        const hashedPasswordFromDatabase = result[0].password;

        // Verify the password with bcrypt
        const validPassword = await bcrypt.compare(password, hashedPasswordFromDatabase);
        console.log(validPassword);
        if (validPassword) {
            // Passwords match, log the user in
            req.session.userId = result[0].id;  // Set user_id on the session
            res.json({ message: 'Login successful' });
        } else {
            // Passwords don't match
            res.status(401).json({ message: 'Incorrect password' });
        }
    });
});



// Define a route handler for GET requests to all the URLs.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'calculator.html'));
});
app.get('/tracker', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tracker.html'));
});
app.get('/gyms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'gyms.html'));
});
app.get('/api/user', function(req, res) {
    if (req.session.userId) {
        res.json({ userId: req.session.userId });
    } else {
        res.status(401).json({ message: 'User is not logged in' });
    }
});
app.get('/login', (req, res) => {
    // Check if the user is already logged in
    if (req.session.userId) {
        // If the user is logged in, show a message saying they're already logged in
        res.send('You are already logged in. Press the back button to return to the web page.');
    } else {
        // If the user is not logged in, render the login page
        res.sendFile(path.join(__dirname, 'views', 'login.html'));
    }
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

//Logout route
app.get('/logout', function(req, res) {
    // Store the redirect url
    const redirectTo = req.session.redirectTo || '/';
    
    // Destroy the user session
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            // Redirect to the previous page
            res.redirect(redirectTo + '?message=Logout successful');
        }
    });
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
