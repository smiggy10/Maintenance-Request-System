const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController'); // Import controller functions

// POST route for user login
router.post('/login', login);

// POST route for user registration
router.post('/register', signup);

module.exports = router;
