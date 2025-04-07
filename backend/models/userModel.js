const db = require('../config/db');  // Assuming db connection is set up in this file

// Create a new user
const createUser = (name, username, email, password, callback) => {
  const query = 'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [name, username, email, password], (err, result) => {
    callback(err, result);
  });
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    callback(err, result[0]);  // Return the first result if found
  });
};

module.exports = { createUser, findUserByEmail };
