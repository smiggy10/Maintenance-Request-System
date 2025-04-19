const db = require('../config/db');

// Create new maintenance request
exports.createRequest = (req, res) => {
    const { title, description, user_id, priority } = req.body;
    const sql = 'INSERT INTO maintenance_requests (title, description, user_id, priority) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, user_id, priority], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Request created', requestId: result.insertId });
    });
};

// Get all requests (admin view)
exports.getAllRequests = (req, res) => {
    const sql = 'SELECT * FROM maintenance_requests';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get request by ID
exports.getRequestById = (req, res) => {
    const sql = 'SELECT * FROM maintenance_requests WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length === 0) return res.status(404).json({ message: 'Request not found' });
        res.json(result[0]);
    });
};

// Get requests by user
exports.getRequestsByUser = (req, res) => {
    const sql = 'SELECT * FROM maintenance_requests WHERE user_id = ?';
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Update request status and assignment
exports.updateRequestStatus = (req, res) => {
    const { status, assigned_to } = req.body;
    const sql = 'UPDATE maintenance_requests SET status = ?, assigned_to = ? WHERE id = ?';
    db.query(sql, [status, assigned_to, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Status updated' });
    });
};

// Delete request (optional)
exports.deleteRequest = (req, res) => {
    const sql = 'DELETE FROM maintenance_requests WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Request deleted' });
    });
};
