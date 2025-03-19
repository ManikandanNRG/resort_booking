const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const ResortFacility = sequelize.define('ResortFacility', {
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
  facility_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Recreation', 'Dining', 'Wellness', 'Business', 'Entertainment'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  operating_hours: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '09:00', close: '22:00' }
    },
    validate: {
      isValidTimeFormat(value) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        Object.values(value).forEach(day => {
          if (!timeRegex.test(day.open) || !timeRegex.test(day.close)) {
            throw new Error('Invalid time format in operating hours (HH:MM expected)');
          }
        });
      }
    }
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  pricing: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      hourly: null,
      daily: null,
      special_rates: []
    },
    validate: {
      isValidPricing(value) {
        if ((value.hourly !== null && value.hourly < 0) || 
            (value.daily !== null && value.daily < 0)) {
          throw new Error('Pricing values must be non-negative');
        }
      }
    }
  },
  maintenance_schedule: {
    type: DataTypes.JSON,
    defaultValue: {
      last_maintenance: null,
      next_maintenance: null,
      frequency: 'monthly',
      notes: []
    },
    validate: {
      isValidMaintenanceDates(value) {
        if (value.last_maintenance && value.next_maintenance && 
            new Date(value.next_maintenance) <= new Date(value.last_maintenance)) {
          throw new Error('Next maintenance must be after the last maintenance date');
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
      fields: ['resort_id', 'facility_name'],
      unique: true
    },
    {
      fields: ['category']
    },
    {
      fields: ['available']
    }
  ]
});

module.exports = ResortFacility;