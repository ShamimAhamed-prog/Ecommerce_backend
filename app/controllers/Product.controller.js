const pool = require('../config/db.config');

// Add Product
exports.addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock || 0]
    );
    res.json({ message: 'Product added successfully', productId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, price, stock, created_at FROM products ORDER BY created_at DESC'
    );
    res.json(rows); // returns array of products
  } catch (err) {
    console.error("Error in listProducts:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
