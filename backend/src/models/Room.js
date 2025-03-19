const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const resort = require('./Resort');
const roomtype = require('./RoomType');

const Room = sequelize.define('room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  resort_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: resort,  // Changed to lowercase
      key: 'id'
    }
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
  freezeTableName: true,  // Add this line to prevent pluralization
  indexes: [
    {
      unique: true,
      fields: ['resort_id', 'room_number']
    }
  ]
});

// Update associations with lowercase references
Room.belongsTo(resort, {
  foreignKey: 'resort_id',
  as: 'resort',
  onDelete: 'CASCADE'
});

Room.belongsTo(roomtype, {
  foreignKey: 'room_type_id',
  as: 'roomtype',
  onDelete: 'CASCADE'
});

resort.hasMany(Room, {
  foreignKey: 'resort_id',
  as: 'rooms'
});

roomtype.hasMany(Room, {
  foreignKey: 'room_type_id',
  as: 'rooms'
});

module.exports = Room;