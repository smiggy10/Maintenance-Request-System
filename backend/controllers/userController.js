const pool = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role FROM users');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const [users] = await pool.query('SELECT id, username, email FROM users WHERE role = ?', [role]);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users by role', error: err });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err });
  }
};

// Delete user (optional)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};

module.exports = {
  getAllUsers,
  getUsersByRole,
  updateUserRole,
  deleteUser
};