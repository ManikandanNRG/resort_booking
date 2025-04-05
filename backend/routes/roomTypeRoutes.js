const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');
const { authenticate } = require('../middlewares/auth.middleware');

// Public routes
router.get('/resorts/:id/room-types', roomTypeController.getAllRoomTypes);
router.get('/room-types/:id', roomTypeController.getRoomTypeById);

// Protected routes - ensure Bearer token format
router.post('/resorts/:id/room-types', authenticate, roomTypeController.createRoomType);
router.put('/room-types/:id', authenticate, roomTypeController.updateRoomType);
router.delete('/room-types/:id', authenticate, roomTypeController.deleteRoomType);

module.exports = router;