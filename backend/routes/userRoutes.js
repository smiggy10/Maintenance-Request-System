const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  getAllUsers,
  getUsersByRole,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

// All routes below require authentication
router.use(authenticate);

// Admin: Get all users
router.get('/', getAllUsers);

// Admin: Get users by role
router.get('/role/:role', getUsersByRole);

// Admin: Update user role
router.put('/:id/role', updateUserRole);

// Admin: Delete user (optional)
router.delete('/:id', deleteUser);

module.exports = router;
