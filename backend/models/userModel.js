const db = require('../config/db');

// Create a new user with a role
const createUser = (name, username, email, password, role, callback) => {
    const query = 'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, username, email, password, role], (err, result) => {
        callback(err, result);
    });
};

// Find user by email
const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            callback(err, null); // Pass the error to the callback
        } else if (result && result.length > 0) {
            callback(null, result[0]); // Return the first result if found
        } else {
            callback(null, null); // No results found
        }
    });
};

// Update user role
const updateUserRole = (userId, role, callback) => {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(query, [role, userId], (err, result) => {
        callback(err, result);
    });
};

module.exports = { createUser, findUserByEmail, updateUserRole };