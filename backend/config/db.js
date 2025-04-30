// filepath: c:\Users\Ralph Jan Areta\maintenance-request-system - working authentication\backend\config\db.js
require('dotenv').config(); // Load environment variables
const mysql = require('mysql2'); // Ensure you have mysql2 installed

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get a promise wrapper for the pool
const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database successfully');
        console.log('Database configuration:');
        console.log('Host:', process.env.DB_HOST);
        console.log('User:', process.env.DB_USER);
        console.log('Database:', process.env.DB_NAME);
        console.log('Port:', process.env.DB_PORT);

        // Test the connection with a simple query
        connection.query('SELECT 1', (err, results) => {
            if (err) {
                console.error('Database test query failed:', err);
            } else {
                console.log('Database test query successful');
            }
            connection.release();
        });
    }
});

// Add error handler for pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed. Reconnecting...');
    } else {
        throw err;
    }
});

module.exports = pool;