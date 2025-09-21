const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');
const AuthMiddleware = require('../middleware/Auth.middleware');

router.post('/add', AuthMiddleware, ProductController.addProduct);

// List products (protected)
router.get('/list', AuthMiddleware, ProductController.listProducts);
// edit products (protected)
router.get('/:id', AuthMiddleware, ProductController.getProduct);
router.delete('/:id', AuthMiddleware, ProductController.deleteProduct);
router.put('/:id', AuthMiddleware, ProductController.updateProduct);
router.get('/search', AuthMiddleware, ProductController.searchProducts);
module.exports = router;
