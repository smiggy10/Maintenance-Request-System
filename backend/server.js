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

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import API routes
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', maintenanceRoutes);
app.use('/api/users', require('./routes/userRoutes'));
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

// 🔽 Newly modified route to handle successful login and admin login
app.post('/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password } = req.body;

  // Log data for debugging
  console.log('Login attempt:', email, password);

  // Temporary hardcoded admin login
  if (email === 'admin@mrs.com' && password === 'mrs123') {
    return res.redirect('/ADMIN/admin-dashboard.html');
  }

  // Temporary fallback for any user (you can connect DB logic here later)
  if (email && password) {
    return res.redirect('/USER/HOMEPAGE.html');
  }

  // If no match or incomplete input
  res.status(401).send('Invalid email or password');
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

// Serve admin HTML files
app.get('/ADMIN/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, '..', 'frontend', 'MRS', 'ADMIN', page));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
