const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const protectedController = require('../controllers/protectedController');

// Protected routes
router.get('/profile', authenticate, protectedController.getProfile);
router.get('/admin', authenticate, protectedController.getAdminArea);

module.exports = router;