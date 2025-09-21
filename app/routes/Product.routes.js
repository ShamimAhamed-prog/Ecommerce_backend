const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/Product.controller');
const AuthMiddleware = require('../middleware/Auth.middleware');

router.post('/add', AuthMiddleware, ProductController.addProduct);

// List products (protected)
router.get('/list', AuthMiddleware, ProductController.listProducts);

module.exports = router;
