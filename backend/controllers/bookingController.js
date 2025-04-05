const { User, Resort, Room, Booking } = require('../src/models');
const { Op } = require('sequelize');

const bookingController = {
  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: Resort, as: 'resort' },
          { model: Room, as: 'room' }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json(bookings);
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get resort bookings (owner only)
  getResortBookings: async (req, res) => {
    try {
      const { id } = req.params; // resort id
      const resort = await Resort.findByPk(id);
      
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      // Check if user is the resort owner
      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view bookings for this resort' });
      }

      const bookings = await Booking.findAll({
        where: { resort_id: id },
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          { model: Room, as: 'room' }
        ],
        order: [['check_in', 'DESC']]
      });

      res.json(bookings);
    } catch (error) {
      console.error('Error in getResortBookings:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const { id } = req.params; // resort id
      const {
        room_id,
        check_in,
        check_out
      } = req.body;

      // Validate resort exists
      const resort = await Resort.findByPk(id);
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      // Validate room exists and belongs to the resort (if room_id provided)
      if (room_id) {
        const room = await Room.findOne({
          where: {
            id: room_id,
            resort_id: id
          }
        });

        if (!room) {
          return res.status(404).json({ message: 'Room not found for this resort' });
        }

        // Check if room is available for the dates
        const existingBookings = await Booking.findAll({
          where: {
            room_id,
            status: {
              [Op.ne]: 'Cancelled'
            },
            [Op.or]: [
              {
                check_in: {
                  [Op.between]: [check_in, check_out]
                }
              },
              {
                check_out: {
                  [Op.between]: [check_in, check_out]
                }
              },
              {
                [Op.and]: [
                  { check_in: { [Op.lte]: check_in } },
                  { check_out: { [Op.gte]: check_out } }
                ]
              }
            ]
          }
        });

        if (existingBookings.length > 0) {
          return res.status(400).json({ message: 'Room is not available for the selected dates' });
        }
      }

      // Create booking
      const booking = await Booking.create({
        user_id: req.user.id,
        resort_id: id,
        room_id,
        check_in,
        check_out,
        status: 'Pending'
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error('Error in createBooking:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Update a booking
  updateBooking: async (req, res) => {
    try {
      const { id } = req.params; // booking id
      const booking = await Booking.findByPk(id, {
        include: [{ model: Resort, as: 'resort' }]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user is authorized (booking owner or resort owner)
      const isBookingOwner = booking.user_id === req.user.id;
      const isResortOwner = booking.resort.owner_id === req.user.id;

      if (!isBookingOwner && !isResortOwner) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }

      // Only allow certain fields to be updated
      const allowedUpdates = ['status'];
      
      // If resort owner, they can update status
      // If booking owner, they can only cancel
      if (isResortOwner) {
        await booking.update(req.body, { fields: allowedUpdates });
      } else {
        // Booking owner can only cancel
        if (req.body.status && req.body.status !== 'Cancelled') {
          return res.status(403).json({ message: 'You can only cancel your booking, not change its status' });
        }
        await booking.update({
          status: 'Cancelled'
        });
      }

      res.json(booking);
    } catch (error) {
      console.error('Error in updateBooking:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Cancel a booking
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params; // booking id
      const booking = await Booking.findByPk(id, {
        include: [{ model: Resort, as: 'resort' }]
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user is authorized (booking owner or resort owner)
      const isBookingOwner = booking.user_id === req.user.id;
      const isResortOwner = booking.resort.owner_id === req.user.id;

      if (!isBookingOwner && !isResortOwner) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      // Update booking status to cancelled
      await booking.update({ status: 'Cancelled' });

      res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController;