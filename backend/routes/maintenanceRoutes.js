const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const maintenanceController = require('../controllers/maintenanceController');

// Create request
router.post('/', maintenanceController.createRequest);

// Get all (admin view)
router.get('/', maintenanceController.getAllRequests);

// Get by ID
router.get('/:id', maintenanceController.getRequestById);

// Get requests by user
router.get('/user/:userId', maintenanceController.getRequestsByUser);

// Update status
router.put('/:id', maintenanceController.updateRequestStatus);

// Delete request
router.delete('/:id', maintenanceController.deleteRequest);

module.exports = router;
