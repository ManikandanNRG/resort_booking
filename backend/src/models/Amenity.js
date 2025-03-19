const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Fixed path
const Resort = require('./Resort');

const Amenity = sequelize.define('amenity', {
  // ... existing id and resort_id fields ...

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('Basic', 'Premium', 'Luxury', 'Service', 'Facility', 'Wellness', 'Entertainment'),
    allowNull: false,
    defaultValue: 'Basic'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isURL: true
    }
  },
  is_chargeable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      chargeableCheck() {
        if (this.is_chargeable && this.price <= 0) {
          throw new Error('Chargeable amenities must have a valid price');
        }
      }
    }
  },
  price_type: {
    type: DataTypes.ENUM('per_night', 'per_stay', 'per_use', 'per_person', 'per_hour', 'complimentary'),
    allowNull: false,
    defaultValue: 'complimentary'
  },
  availability: {
    type: DataTypes.JSON,
    defaultValue: {
      always_available: true,
      schedule: null,
      max_capacity: null,
      requires_booking: false,
      advance_booking_required: false,
      booking_lead_time_hours: 0
    },
    validate: {
      isValidSchedule(value) {
        if (!value.always_available && !value.schedule) {
          throw new Error('Schedule must be provided when not always available');
        }
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  // ... existing timestamps and indexes ...
  
  hooks: {
    beforeSave: async (amenity) => {
      if (!amenity.is_chargeable) {
        amenity.price = 0;
        amenity.price_type = 'complimentary';
      }
      if (amenity.price_type === 'complimentary') {
        amenity.is_chargeable = false;
        amenity.price = 0;
      }
    }
  }
});

module.exports = Amenity;