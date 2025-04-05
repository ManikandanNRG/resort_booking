const express = require('express');
const router = express.Router();
const resortController = require('../controllers/resortController');
const { authenticate } = require('../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/resorts', resortController.getAllResorts);
router.get('/resorts/:id', resortController.getResortById);

// Protected routes (requires authentication)
router.post('/resorts', authenticate, resortController.createResort);
router.put('/resorts/:id', authenticate, resortController.updateResort);
router.delete('/resorts/:id', authenticate, resortController.deleteResort);

module.exports = router;