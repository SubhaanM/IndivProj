Exercise Performance and Nutrition Optimisation Application

Subhaan Majid's Individual Project Code Submission.

This submission only includes the report and text file. in the format pdf and txt.


#Folder Structure:

project-root/
├── app.js # Main application logic
├── package.json # Contains project metadata and dependencies
├── public/ # Contains css, images, and JavaScript files
│ ├── css/
│ │ ├── styles.css # Main CSS styles
│ ├── images/ # Contains all images used throughout the project
│ │ ├── banner.png
│ │ ├── favicon.png
│ └── js/ # JavaScript files
│ ├── script.js # Main script file
│ ├── login.js # Script for the login page
│ ├── logout.js # Script for the logout page
│ └── register.js # Script for the registration page
└── views/ # Contains all HTML files
├── index.html # Main page
├── calculator.html # Calorie Calculator page
├── tracker.html # Nutrition Tracker page
├── gyms.html # Nearby Gyms page
├── login.html # Login page
└── register.html # Registration page


### Prerequisites

What things you need to install the software and how to install them:
- Node.js and npm (Node Package Manager): [Download and install](https://nodejs.org/en/)
- MySQL Workbench: [Download and install](https://www.mysql.com/products/workbench/)
- A code editor like VS Code: [Download and install](https://code.visualstudio.com/)


##Installation:

Please follow these steps to install the project.

1. Download and unzip the project file attached.

2. Open the terminal/command prompt, navigate to the project folder and install the dependencies with the following command:
	npm install

3. In the terminal, enter the following individually:
	npm install express
	npm install cors
	npm install bcrypt
	npm install express-session
	npm install mysql
	npm install path
	npm install body-parser


### Setting Up Database

To set up the database using MySQL Workbench, follow these steps:

1. Open MySQL Workbench.

2. Click on the "+" sign next to MySQL Connections on the home screen to create a new connection.

3. Enter the connection details:
Connection Name: Any name you prefer
Hostname: localhost
Port: 3306 (or the port where your MySQL server is running)
Username: Your MySQL username
Password: Your MySQL password

(then enter these in app.js)

4. Once connected, create a new schema/database for the application.
Open the exported SQL script that you received with the project files.
Execute this script to recreate the database tables and relationships.
To import the database on another machine:

Copy the exported .sql file to the other machine.
In MySQL Workbench on the other machine, right-click in the "Schemas" panel and select "Create Schema" to create a schema with the same name as in the .sql file.
Right-click on the newly created schema and select "Table Data Import Wizard".
Select the .sql file you copied, and follow the steps to import the data.


### Running the Project

1. Open the terminal/command prompt, navigate to the project folder.

2. Run the application using the following command:
	node app.js

The project should now be running on localhost:3000. 
Open a web browser and navigate to `http://localhost:3000` to view the application.


# How to Use the Application

1. **Home Page (index.html)**: Start your journey here. This page provides a brief overview of the application's features.

2. **Calorie Calculator (calculator.html)**: Enter your details to calculate an estimate of your daily caloric needs.

3. **Nutrition Tracker (tracker.html)**: Use this page to log your daily food intake, weight, and physical activity. Track your progress over time through a table and a graph. (you will need to register an account beforehand)

4. **Nearby Gyms (gyms.html)**: Use the "Find Nearby Gyms" button to locate gyms in your vicinity. The application uses your current location to provide relevant suggestions.

5. **Login (login.html)**: If you're a registered user, use this page to log into your account. Enter your username and password in the given fields and click "Login".

6. **Register (register.html)**: If you are new to the site, use this page to create an account. Fill out the required fields with your details and click "Register".

Please ensure your server is running while you interact with these pages, as they rely on server-side functionality and database connections for complete operation.



## Built With
1. **HTML**: Used for creating the structure of the website.
2. **CSS**: Used for styling and layout of the website.
3. **JavaScript**: Powers the functionality of the website.
4. **Node.js**: Provides the server-side environment.
5. **Express.js**: A web application framework used for routing and handling HTTP requests.
6. **MySQL**: A database management system used for data storage and manipulation.
7. **Chart.js**: A library used for generating the nutrition progress graph.


Subhaan Majid - subhaan.majid@city.ac.uk - 190016383