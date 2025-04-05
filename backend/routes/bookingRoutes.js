const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/auth.middleware');

// Get user's bookings
router.get('/bookings', authenticate, bookingController.getUserBookings);

// Get resort bookings (owner only)
router.get('/resorts/:id/bookings', authenticate, bookingController.getResortBookings);

// Create a new booking
router.post('/resorts/:id/bookings', authenticate, bookingController.createBooking);

// Update a booking
router.put('/bookings/:id', authenticate, bookingController.updateBooking);

// Cancel a booking
router.delete('/bookings/:id', authenticate, bookingController.cancelBooking);

module.exports = router;