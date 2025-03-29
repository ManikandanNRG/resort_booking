const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const rbacMiddleware = require('../middlewares/auth/rbacMiddleware');

// Protected route example
router.get('/profile', 
  authMiddleware,
  (req, res) => {
    res.json({
      message: 'Profile accessed successfully',
      user: req.user
    });
});

// Role-based route example
router.get('/admin', 
  authMiddleware,
  rbacMiddleware(['Resort Admin']),
  (req, res) => {
    res.json({
      message: 'Admin area accessed successfully',
      user: req.user
    });
});

module.exports = router;