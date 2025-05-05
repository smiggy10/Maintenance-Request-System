const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// Convert query to promise
const query = promisify(db.query).bind(db);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all announcements with their comments
router.get('/', async (req, res) => {
  try {
    const announcements = await query(`
      SELECT a.*, u.name as created_by_name 
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `);

    // Get comments for each announcement
    for (let announcement of announcements) {
      const comments = await query(`
        SELECT c.*, u.name as user_name
        FROM announcement_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.announcement_id = ?
        ORDER BY c.created_at ASC
      `, [announcement.id]);
      announcement.comments = comments;
    }

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

// Create a new announcement
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, priority, created_by } = req.body;
  
  try {
    const result = await query(
      'INSERT INTO announcements (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
      [title, content, priority, created_by]
    );
    
    const [newAnnouncement] = await query(
      'SELECT a.*, u.name as created_by_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newAnnouncement[0]);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
});

// Update an announcement
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, priority } = req.body;
  const userId = req.user.userId;
  
  try {
    // First check if the user owns the announcement or is an admin
    const [announcement] = await query(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Get user role
    const [user] = await query(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or the creator of the announcement
    if (user.role !== 'admin' && announcement.created_by !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this announcement' });
    }

    await query(
      'UPDATE announcements SET title = ?, content = ?, priority = ? WHERE id = ?',
      [title, content, priority, id]
    );
    
    const [updatedAnnouncement] = await query(
      'SELECT a.*, u.name as created_by_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [id]
    );
    
    res.json(updatedAnnouncement[0]);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
});

// Delete an announcement
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  try {
    // First check if the user owns the announcement or is an admin
    const [announcement] = await query(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Get user role
    const [user] = await query(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin or the creator of the announcement
    if (user.role !== 'admin' && announcement.created_by !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }

    // First delete all comments associated with the announcement
    await query('DELETE FROM announcement_comments WHERE announcement_id = ?', [id]);
    // Then delete the announcement
    await query('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

// Add a comment to an announcement
router.post('/:id/comments', authenticateToken, async (req, res) => {
  console.log('POST /:id/comments called with id:', req.params.id);
  const { id } = req.params;
  const { comment } = req.body;
  const user_id = req.user.userId; // Get user_id from the authenticated user
  
  try {
    const result = await query(
      'INSERT INTO announcement_comments (announcement_id, user_id, comment) VALUES (?, ?, ?)',
      [id, user_id, comment]
    );
    
    const [newComment] = await query(
      'SELECT c.*, u.name as user_name FROM announcement_comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Delete a comment
router.delete('/:announcementId/comments/:commentId', authenticateToken, async (req, res) => {
  const { announcementId, commentId } = req.params;
  const user_id = req.user.userId;
  
  try {
    // First check if the user owns the comment
    const [comment] = await query(
      'SELECT * FROM announcement_comments WHERE id = ? AND user_id = ?',
      [commentId, user_id]
    );

    if (!comment) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await query(
      'DELETE FROM announcement_comments WHERE id = ? AND announcement_id = ?',
      [commentId, announcementId]
    );
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

module.exports = router;
