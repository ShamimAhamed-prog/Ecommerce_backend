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

// List Products
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

// Get Single Product by ID
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, price, stock, created_at FROM products WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Error in getProduct:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  
  try {
    // First check if product exists
    const [existingProduct] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update the product
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, updated_at = NOW() WHERE id = ?',
      [name, description, price, stock || 0, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get updated product
    const [updatedProduct] = await pool.query(
      'SELECT id, name, description, price, stock, created_at, updated_at FROM products WHERE id = ?',
      [id]
    );
    
    res.json({ 
      message: 'Product updated successfully', 
      product: updatedProduct[0] 
    });
    
  } catch (err) {
    console.error("Error in updateProduct:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }
  
  try {
    // First check if product exists
    const [existingProduct] = await pool.query('SELECT id, name FROM products WHERE id = ?', [id]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ 
      message: 'Product deleted successfully',
      deletedProduct: {
        id: id,
        name: existingProduct[0].name
      }
    });
    
  } catch (err) {
    console.error("Error in deleteProduct:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Bulk Delete Products
exports.bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Product IDs array is required' });
  }
  
  try {
    // Create placeholders for IN clause
    const placeholders = ids.map(() => '?').join(',');
    
    // First get the products that exist
    const [existingProducts] = await pool.query(
      `SELECT id, name FROM products WHERE id IN (${placeholders})`,
      ids
    );
    
    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'No products found with provided IDs' });
    }
    
    // Delete the products
    const [result] = await pool.query(
      `DELETE FROM products WHERE id IN (${placeholders})`,
      ids
    );
    
    res.json({ 
      message: `${result.affectedRows} product(s) deleted successfully`,
      deletedCount: result.affectedRows,
      deletedProducts: existingProducts
    });
    
  } catch (err) {
    console.error("Error in bulkDeleteProducts:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search Products
exports.searchProducts = async (req, res) => {
  const { q, limit = 10, offset = 0 } = req.query;
  
  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  try {
    const searchTerm = `%${q}%`;
    
    // Get total count for pagination
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE name LIKE ? OR description LIKE ?',
      [searchTerm, searchTerm]
    );
    
    // Get search results
    const [rows] = await pool.query(
      'SELECT id, name, description, price, stock, created_at FROM products WHERE name LIKE ? OR description LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [searchTerm, searchTerm, parseInt(limit), parseInt(offset)]
    );
    
    res.json({
      products: rows,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      query: q
    });
    
  } catch (err) {
    console.error("Error in searchProducts:", err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};