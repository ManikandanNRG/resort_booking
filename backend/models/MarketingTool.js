const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const MarketingTool = sequelize.define('MarketingTool', {
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
  campaign_type: {
    type: DataTypes.ENUM('Discount', 'Ad Promotion', 'Special Offer', 'Package Deal', 'Early Bird'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isFuture(value) {
        if (value < new Date()) {
          throw new Error('Start date must be in the future');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value <= this.start_date) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
      checkDiscount(value) {
        if (this.campaign_type !== 'Discount' && value !== null) {
          throw new Error('Discount percentage should only be set for Discount campaigns.');
        }
      }
    }
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Active', 'Paused', 'Completed', 'Cancelled'),
    defaultValue: 'Draft',
    allowNull: false
  },
  target_audience: {
    type: DataTypes.JSON,
    defaultValue: {
      age_range: null,
      location: [],
      interests: [],
      gender: null,
      min_booking_value: null
    },
    validate: {
      isValidAudience(value) {
        if (value.age_range && !['18-25', '26-35', '36-50', '50+'].includes(value.age_range)) {
          throw new Error('Invalid age range');
        }
      }
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  paranoid: true,
  indexes: [
    {
      fields: ['resort_id', 'campaign_type']
    },
    {
      fields: ['resort_id', 'status']
    },
    {
      fields: ['start_date', 'end_date']
    }
  ]
});

module.exports = MarketingTool;