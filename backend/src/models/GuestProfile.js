const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const GuestProfile = sequelize.define('guestprofile', {
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
    unique: true
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      room_type: null,
      dietary: [],
      special_requests: [],
      amenities: []
    },
    validate: {
      validPreferences(value) {
        const validRoomTypes = ['Single', 'Double', 'Suite'];
        if (value.room_type && !validRoomTypes.includes(value.room_type)) {
          throw new Error('Invalid room type. Allowed: Single, Double, Suite.');
        }
      }
    }
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  membership_tier: {
    type: DataTypes.ENUM('Standard', 'Silver', 'Gold', 'Platinum'),
    defaultValue: 'Standard',
    allowNull: false
  },
  total_stays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total_spent: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  identification: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      type: null,
      number: null,
      expiry_date: null,
      country_of_issue: null
    },
    validate: {
      validIdentification(value) {
        if (!value.type || !value.number || !value.country_of_issue) {
          throw new Error('Identification details must include type, number, and country of issue.');
        }
        if (value.expiry_date && isNaN(Date.parse(value.expiry_date))) {
          throw new Error('Invalid expiry date format.');
        }
      }
    }
  },
  emergency_contact: {
    type: DataTypes.JSON,
    defaultValue: {
      name: null,
      relationship: null,
      phone: null,
      email: null
    },
    validate: {
      validEmergencyContact(value) {
        if (!value.phone && !value.email) {
          throw new Error('At least one emergency contact method (phone or email) must be provided.');
        }
      }
    }
  },
  last_stay_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['membership_tier']
    },
    {
      fields: ['total_stays']
    },
    {
      fields: ['loyalty_points']
    }
  ],
  hooks: {
    beforeUpdate: async (profile) => {
      // Auto-update membership tier based on total stays
      if (profile.changed('total_stays')) {
        if (profile.total_stays >= 50) profile.membership_tier = 'Platinum';
        else if (profile.total_stays >= 25) profile.membership_tier = 'Gold';
        else if (profile.total_stays >= 10) profile.membership_tier = 'Silver';
        
        // Auto-update last stay date when total_stays increases
        if (profile.total_stays > profile.previous('total_stays')) {
          profile.last_stay_date = new Date();
        }
      }
    }
  }
});

module.exports = GuestProfile;