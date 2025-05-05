const db = require('../config/db');

// Get all maintenance staff
const getAllStaff = (req, res) => {
    const query = 'SELECT * FROM maintenance_staff ORDER BY name';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, (err, results) => {
            connection.release();

            if (err) {
                console.error('Error fetching maintenance staff:', err);
                return res.status(500).json({ message: 'Error fetching maintenance staff' });
            }

            res.json(results);
        });
    });
};

// Create new maintenance staff
const createStaff = (req, res) => {
    const { name, role, contact_number, email } = req.body;

    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role are required' });
    }

    const query = `
        INSERT INTO maintenance_staff 
        (name, role, contact_number, email) 
        VALUES (?, ?, ?, ?)
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(
            query,
            [name, role, contact_number, email],
            (err, result) => {
                connection.release();

                if (err) {
                    console.error('Error creating maintenance staff:', err);
                    return res.status(500).json({ message: 'Error creating maintenance staff' });
                }

                res.status(201).json({
                    message: 'Maintenance staff created successfully',
                    staffId: result.insertId
                });
            }
        );
    });
};

// Update maintenance staff
const updateStaff = (req, res) => {
    const { staffId } = req.params;
    const { name, role, contact_number, email, status } = req.body;

    const query = `
        UPDATE maintenance_staff 
        SET name = ?, role = ?, contact_number = ?, email = ?, status = ?
        WHERE id = ?
    `;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(
            query,
            [name, role, contact_number, email, status, staffId],
            (err, result) => {
                connection.release();

                if (err) {
                    console.error('Error updating maintenance staff:', err);
                    return res.status(500).json({ message: 'Error updating maintenance staff' });
                }

                res.json({ message: 'Maintenance staff updated successfully' });
            }
        );
    });
};

// Delete maintenance staff
const deleteStaff = (req, res) => {
    const { staffId } = req.params;

    const query = 'DELETE FROM maintenance_staff WHERE id = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }

        connection.query(query, [staffId], (err, result) => {
            connection.release();

            if (err) {
                console.error('Error deleting maintenance staff:', err);
                return res.status(500).json({ message: 'Error deleting maintenance staff' });
            }

            res.json({ message: 'Maintenance staff deleted successfully' });
        });
    });
};

module.exports = {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff
}; 