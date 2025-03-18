const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const User = require('./User');
const Resort = require('./Resort');
const Room = require('./Room');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  resort_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Resort,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: true,  // Making room optional for flexible bookings
    references: {
      model: Room,
      key: 'id'
    },
    onDelete: 'SET NULL'  // If room is deleted, booking remains
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: false
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterCheckIn(value) {
        if (this.check_in && value <= this.check_in) {
          throw new Error('Check-out date must be after check-in date.');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Pending'
  }
}, {
  timestamps: true,
  underscored: true
});

module.exports = Booking;