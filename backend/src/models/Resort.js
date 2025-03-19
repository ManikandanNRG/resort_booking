const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import User model for association

const Resort = sequelize.define('resort', { // Changed to lowercase
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User, // Direct reference to User model
      key: 'id'
    },
    onDelete: 'CASCADE' // Automatically delete resorts when owner is deleted
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  timestamps: true,  // Automatically manages createdAt & updatedAt
  underscored: true  // Uses created_at & updated_at instead of createdAt & updatedAt
});

module.exports = Resort;