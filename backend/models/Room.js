const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  resort_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Resort,
      key: 'id'
    },
    onDelete: 'CASCADE',
    index: true // Added index for better performance
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: 'resortRoomNumber' // Ensures unique room number per resort
  },
  size: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Standard'
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { 
      min: 1,
      max: 20
    }
  },
  status: {
    type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance'),
    defaultValue: 'Available',
    allowNull: false
  },
  amenities: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      fields: ['resort_id', 'room_number'] // Composite unique index
    }
  ]
});

module.exports = Room;