const db = require('../config/db');
const { findUserByEmail } = require('../models/userModel');

// Create a new maintenance request
const createRequest = async (req, res) => {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const { title, description, priority, userId } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log('Creating maintenance request:', { title, description, priority, userId, image });

    if (!title || !description || !priority || !userId) {
        console.error('Missing required fields:', { title, description, priority, userId });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
        INSERT INTO maintenance_requests 
        (title, description, status, priority, user_id, date_submitted, image) 
        VALUES (?, ?, 'Pending', ?, ?, NOW(), ?)
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(
            query,
            [title, description, priority, userId, image],
            (err, result) => {
                connection.release();

                if (err) {
                    console.error('Error creating maintenance request:', err);
                    console.error('SQL Query:', query);
                    console.error('Parameters:', [title, description, priority, userId, image]);
                    return res.status(500).json({ 
                        message: 'Error creating maintenance request',
                        error: err.message,
                        sqlMessage: err.sqlMessage
                    });
                }

                console.log('Maintenance request created successfully:', result.insertId);
                res.status(201).json({
                    message: 'Maintenance request created successfully',
                    requestId: result.insertId
                });
            }
        );
    });
};

// Get all maintenance requests
const getRequests = (req, res) => {
    const query = `
        SELECT mr.*, u.name as user_name, s.name as assigned_staff_name, s.role as assigned_staff_role
        FROM maintenance_requests mr
        LEFT JOIN users u ON mr.user_id = u.id
        LEFT JOIN maintenance_staff s ON mr.assigned_to = s.id
        ORDER BY mr.date_submitted DESC
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Error fetching maintenance requests:', err);
                return res.status(500).json({ message: 'Error fetching maintenance requests' });
            }

        res.json(results);
        });
    });
};

// Get maintenance requests for a specific user
const getUserRequests = (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT mr.*, u.name as user_name, s.name as assigned_staff_name, s.role as assigned_staff_role
        FROM maintenance_requests mr
        LEFT JOIN users u ON mr.user_id = u.id
        LEFT JOIN maintenance_staff s ON mr.assigned_to = s.id
        WHERE mr.user_id = ?
        ORDER BY mr.date_submitted DESC
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, [userId], (err, results) => {
            connection.release();

            if (err) {
                console.error('Error fetching user maintenance requests:', err);
                return res.status(500).json({ message: 'Error fetching maintenance requests' });
            }

            res.json(results);
        });
    });
};

// Update maintenance request status
const updateRequestStatus = (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    const query = 'UPDATE maintenance_requests SET status = ? WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, [status, requestId], (err, result) => {
            connection.release();

            if (err) {
                console.error('Error updating maintenance request status:', err);
                return res.status(500).json({ message: 'Error updating maintenance request' });
            }

            res.json({ message: 'Maintenance request status updated successfully' });
        });
    });
};

// Assign staff to maintenance request
const assignStaff = (req, res) => {
    const { requestId } = req.params;
    const { staffId } = req.body;

    // If staffId is empty or 0, set it to NULL
    const staffIdValue = staffId && staffId !== '0' ? staffId : null;

    const query = 'UPDATE maintenance_requests SET assigned_to = ? WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, [staffIdValue, requestId], (err, result) => {
            connection.release();

            if (err) {
                console.error('Error assigning staff to maintenance request:', err);
                return res.status(500).json({ 
                    message: 'Error assigning staff',
                    error: err.message 
                });
            }

            res.json({ message: 'Staff assigned successfully' });
        });
    });
};

// Update maintenance request status
const updateStatus = (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    const query = 'UPDATE maintenance_requests SET status = ? WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, [status, requestId], (err, result) => {
            connection.release();

            if (err) {
                console.error('Error updating maintenance request status:', err);
                return res.status(500).json({ message: 'Error updating maintenance request status' });
            }

            res.json({ message: 'Maintenance request status updated successfully' });
        });
    });
};

module.exports = {
    createRequest,
    getRequests,
    getUserRequests,
    updateRequestStatus,
    assignStaff,
    updateStatus
};