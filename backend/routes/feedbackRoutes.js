const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  addFeedback,
  getFeedbackByRequestId
} = require('../controllers/feedbackController');

// All routes require authentication
router.use(authenticate);

// Add feedback to a request
router.post('/', addFeedback);

// Get all feedback for a specific request
router.get('/:request_id', getFeedbackByRequestId);

module.exports = router;
