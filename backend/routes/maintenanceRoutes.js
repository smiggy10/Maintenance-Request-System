const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // or configure storage
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

// Assign staff to a request
router.post('/assign', maintenanceController.assignStaff);

// User can upload image
router.post('/', upload.single('image'), maintenanceController.createRequest);

module.exports = router;