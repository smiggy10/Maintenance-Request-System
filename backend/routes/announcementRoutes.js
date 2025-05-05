const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { promisify } = require('util');

// Convert query to promise
const query = promisify(db.query).bind(db);

// Get all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await query(`
      SELECT a.*, u.name as created_by_name 
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `);
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

// Create a new announcement
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, priority } = req.body;
  
  try {
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await query('DELETE FROM announcements WHERE id = ?', [id]);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
});

module.exports = router;
