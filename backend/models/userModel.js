const db = require('../config/db');

// Create a new user with a role
const createUser = (name, username, email, password, role, callback) => {
    console.log('Creating user with data:', { name, username, email, role });
    const query = 'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return callback(err, null);
        }

        connection.query(query, [name, username, email, password, role], (err, result) => {
            connection.release(); // Always release the connection back to the pool

            if (err) {
                console.error('Error in createUser:', err);
                callback(err, null);
            } else {
                console.log('User created successfully with ID:', result.insertId);
                callback(null, result);
            }
        });
    });
};

// Find user by email
const findUserByEmail = (email, callback) => {
    console.log('Finding user by email:', email);
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return callback(err, null);
        }

        connection.query(query, [email], (err, result) => {
            connection.release(); // Always release the connection back to the pool

            if (err) {
                console.error('Error in findUserByEmail:', err);
                callback(err, null);
            } else if (result && result.length > 0) {
                console.log('User found:', { id: result[0].id, email: result[0].email });
                callback(null, result[0]);
            } else {
                console.log('No user found with email:', email);
                callback(null, null);
            }
        });
    });
};

// Update user role
const updateUserRole = (userId, role, callback) => {
    console.log('Updating user role:', { userId, role });
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return callback(err, null);
        }

        connection.query(query, [role, userId], (err, result) => {
            connection.release(); // Always release the connection back to the pool

            if (err) {
                console.error('Error in updateUserRole:', err);
                callback(err, null);
            } else {
                console.log('User role updated successfully');
                callback(null, result);
            }
        });
    });
};

module.exports = { createUser, findUserByEmail, updateUserRole };