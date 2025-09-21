const express = require('express');
const router = express.Router();
const AppController = require('../controllers/App.controller');

router.get('/', AppController.index);
router.get('/about', AppController.about);
router.get('/contact', AppController.contact);

module.exports = router;
