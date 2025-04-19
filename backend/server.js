require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Add this middleware to filter out requests to .git and node_modules
app.use((req, res, next) => {
  const requestedPath = path.join(__dirname, req.path);
  if (requestedPath.includes('.git') || requestedPath.includes('node_modules')) {
    return res.status(403).send('Access Forbidden');
  }
  next();
});

// Serve static files from the 'frontend' folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Import API routes
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', maintenanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Serve the login page on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'LOGIN.html'));
});

// Serve the login page
app.get('/LOGIN.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'LOGIN.html'));
});

// Serve the signup page
app.get('/SIGNUP.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'SIGNUP.html'));
});

// 🔽 Newly modified route to handle successful login
app.post('/login', (req, res) => {
  // Assuming you validate login credentials here
  const userLoggedIn = true;  // Replace this with actual login validation

  if (userLoggedIn) {
    // After successful login, redirect to the dashboard with navbar and homepage content
    res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'navbar.html'));
    res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'HOMEPAGE.html'));
  } else {
    res.redirect('/login');  // Redirect to login if authentication fails
  }
});

// Serve the navbar.html
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'HOMEPAGE.html'));
});

// Serve the announcementmt.html page
app.get('/announcementmt.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'MAINTENANCE TEAM', 'announcementmt.html'));
});

// 🔽 Newly added routes for user pages 🔽
app.get('/USER/HOMEPAGE.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'HOMEPAGE.html'));
});

app.get('/USER/PROFILE.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'PROFILE.html'));
});

app.get('/USER/ANNOUNCEMENT.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'ANNOUNCEMENT.html'));
});

app.get('/USER/GENERATE.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'USER', 'GENERATE.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
