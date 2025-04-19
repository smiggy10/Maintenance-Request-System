const pool = require('../config/db');

// Add feedback to a maintenance request
const addFeedback = async (req, res) => {
  const { request_id, comment } = req.body;
  const user_id = req.user.id;

  if (!comment || !request_id) {
    return res.status(400).json({ message: 'Comment and request ID are required' });
  }

  try {
    await pool.query(
      'INSERT INTO feedback (request_id, user_id, comment) VALUES (?, ?, ?)',
      [request_id, user_id, comment]
    );
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting feedback', error: err });
  }
};

// Get feedback for a specific maintenance request
const getFeedbackByRequestId = async (req, res) => {
  const { request_id } = req.params;

  try {
    const [feedback] = await pool.query(
      `SELECT f.id, f.comment, f.created_at, u.username 
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.request_id = ? ORDER BY f.created_at DESC`,
      [request_id]
    );
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving feedback', error: err });
  }
};

module.exports = {
  addFeedback,
  getFeedbackByRequestId
};
