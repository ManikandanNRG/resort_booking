const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/resorts/:id/room-types', roomTypeController.getAllRoomTypes);
router.get('/room-types/:id', roomTypeController.getRoomTypeById);

// Protected routes
router.post('/resorts/:id/room-types', authMiddleware, roomTypeController.createRoomType);
router.put('/room-types/:id', authMiddleware, roomTypeController.updateRoomType);
router.delete('/room-types/:id', authMiddleware, roomTypeController.deleteRoomType);

module.exports = router;