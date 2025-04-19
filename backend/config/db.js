// filepath: c:\Users\Ralph Jan Areta\maintenance-request-system - working authentication\backend\config\db.js
require('dotenv').config(); // Load environment variables
const mysql = require('mysql2'); // Ensure you have mysql2 installed

// Create the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit the application if the connection fails
    } else {
        console.log('Connected to the database.');
    }
});

module.exports = db;