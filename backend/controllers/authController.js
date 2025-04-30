const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const hashPassword = require('../utils/hashPassword');

// Signup controller
const signup = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  console.log('Registration attempt:', { name, username, email });

  // Validate the fields
  if (!name || !username || !email || !password || !confirmPassword) {
    console.log('Missing fields in registration');
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if the email already exists
  findUserByEmail(email, (err, existingUser) => {
    if (err) {
      console.error('Error checking user email:', err);
      return res.status(500).json({ message: 'Error checking email' });
    }

    if (existingUser) {
      console.log('Email already in use:', email);
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    hashPassword(password)
      .then((hashedPassword) => {
        console.log('Password hashed successfully');
        // Create the user with default role 'user'
        createUser(name, username, email, hashedPassword, 'user', (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }
          console.log('User created successfully:', { 
            id: result.insertId,
            name, 
            email, 
            role: 'user' 
          });
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
      
      // Send user data along with token
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  });
};

module.exports = { signup, login };
