const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    createRequest, 
    getRequests, 
    getUserRequests, 
    updateRequestStatus, 
    assignStaff,
    updateStatus 
} = require('../controllers/maintenanceController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('image'), createRequest);
router.get('/', getRequests);
router.get('/user/:userId', getUserRequests);
router.post('/:requestId/status', updateStatus);
router.post('/:requestId/assign', assignStaff);

module.exports = router;