const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.config.js');

// Admin Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'Admin not found' });

    const admin = rows[0];
    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid Password' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
