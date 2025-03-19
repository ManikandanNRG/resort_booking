const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SubscriptionPlan = sequelize.define('subscriptionplan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.ENUM('Basic', 'Premium', 'Enterprise'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 } // Ensure price is non-negative
  },
  max_rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 } // Minimum 1 room
  },
  max_admins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 } // Minimum 1 admin
  },
  allowed_features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {} // Prevent NULL values
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true // Prevent table name from becoming plural
});

module.exports = SubscriptionPlan;