const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');
const Room = require('./Room');

const AutomatedPricing = sequelize.define('AutomatedPricing', {
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
    index: true
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    },
    onDelete: 'CASCADE',
    index: true
  },
  suggested_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  current_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  factors: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      seasonality: 0,
      demand: 0,
      competition: 0,
      events: [],
      historical_data: {
        average_occupancy: 0,
        peak_rates: [],
        low_rates: []
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Applied', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false
  },
  applied_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isFutureDate(value) {
        if (value < new Date()) {
          throw new Error('Valid from date must be in the future');
        }
      }
    }
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterValidFrom(value) {
        if (value <= this.valid_from) {
          throw new Error('Valid until date must be after valid from date');
        }
      }
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['resort_id', 'room_id']
    },
    {
      fields: ['valid_from', 'valid_until', 'status']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeUpdate: async (pricing) => {
      if (pricing.status === 'Applied' && pricing.changed('status')) {
        pricing.current_price = pricing.suggested_price;
        pricing.applied_at = new Date();
      }
    }
  }
});

module.exports = AutomatedPricing;