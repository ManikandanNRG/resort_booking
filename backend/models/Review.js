const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const User = require('./User');
const Resort = require('./Resort');

const Review = sequelize.define('Review', {
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
    onDelete: 'CASCADE',
    index: true
  },
  resort_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Resort,
      key: 'id'
    },
    onDelete: 'CASCADE',
    index: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [5, 255]
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [10, 1000] // Minimum 10 characters, maximum 1000
    }
  },
  checkin_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isPast(value) {
        if (value > new Date()) {
          throw new Error('Check-in date must be in the past');
        }
      }
    }
  },
  checkout_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterCheckin(value) {
        if (value <= this.checkin_date) {
          throw new Error('Check-out date must be after check-in date');
        }
      }
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  helpful_votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  paranoid: true, // Enables soft deletes
  indexes: [
    {
      fields: ['user_id', 'resort_id'],
      unique: true
    },
    {
      fields: ['rating']
    },
    {
      fields: ['checkin_date', 'checkout_date']
    }
  ]
});

module.exports = Review;