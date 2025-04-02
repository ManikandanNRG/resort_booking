const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/resorts', resortController.getAllResorts);
router.get('/resorts/:id', resortController.getResortById);

// Protected routes (requires authentication)
router.post('/resorts', authMiddleware, resortController.createResort);
router.put('/resorts/:id', authMiddleware, resortController.updateResort);
router.delete('/resorts/:id', authMiddleware, resortController.deleteResort);

module.exports = router;