const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const hashPassword = require('../utils/hashPassword');

// Signup controller
const signup = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  // Validate the fields
  if (!name || !username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if the email already exists
  findUserByEmail(email, (err, existingUser) => {
    if (err) {
      console.error('Error checking user email:', err);
      return res.status(500).json({ message: 'Error checking email' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    hashPassword(password)
      .then((hashedPassword) => {
        // Create the user
        createUser(name, username, email, hashedPassword, (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }
          res.status(201).json({ message: 'User created successfully' });
        });
      })
      .catch((err) => {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Error hashing password' });
      });
  });
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate the input fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  // Find the user by email
  findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Create JWT token
      const token = generateToken(user.id);
      res.json({ message: 'Login successful', token });
    });
  });
};

module.exports = { signup, login };
