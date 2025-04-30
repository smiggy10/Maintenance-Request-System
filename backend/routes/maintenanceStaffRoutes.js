const express = require('express');
const router = express.Router();
const { 
    getAllStaff, 
    createStaff, 
    updateStaff, 
    deleteStaff 
} = require('../controllers/maintenanceStaffController');

// Routes
router.get('/', getAllStaff);
router.post('/', createStaff);
router.put('/:staffId', updateStaff);
router.delete('/:staffId', deleteStaff);

module.exports = router; 