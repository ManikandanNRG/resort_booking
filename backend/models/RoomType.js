const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const RoomType = sequelize.define('RoomType', {
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
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 1 // Ensures at least a minimal base price is set
    }
  },
  capacity: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      adults: 2,
      children: 1
    },
    validate: {
      isValidCapacity(value) {
        if (!value.adults || value.adults < 1) {
          throw new Error('Room must accommodate at least 1 adult');
        }
        if (value.children < 0) {
          throw new Error('Children capacity cannot be negative');
        }
      }
    }
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Amenities must be an array');
        }
      }
    }
  },
  size_sqft: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  bed_configuration: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      single: 0,
      double: 0,
      queen: 0,
      king: 0
    },
    validate: {
      hasAtLeastOneBed(value) {
        if (!Object.values(value).some(count => count > 0)) {
          throw new Error('At least one bed must be provided in the configuration');
        }
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Images must be an array');
        }
      }
    }
  },
  policies: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      check_in_time: "14:00",
      check_out_time: "11:00",
      cancellation_hours: 24,
      extra_bed_allowed: false,
      extra_bed_charge: 0
    }
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['resort_id']
    },
    {
      fields: ['base_price']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['display_order']
    }
  ]
});

module.exports = RoomType;