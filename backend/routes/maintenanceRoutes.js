const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createMaintenanceRequest, getMaintenanceRequests } = require('../controllers/maintenanceController');

// Protected route for creating maintenance requests
router.post('/create', authenticate, createMaintenanceRequest);

// Route to get maintenance requests
router.get('/', authenticate, getMaintenanceRequests);

module.exports = router;
