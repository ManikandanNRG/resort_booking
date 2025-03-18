const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const ResortImage = sequelize.define('ResortImage', {
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
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isValidImageUrl(value) {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const hasValidExtension = validExtensions.some(ext => 
          value.toLowerCase().endsWith(ext)
        );
        if (!hasValidExtension) {
          throw new Error('Image URL must end with a valid image extension (.jpg, .jpeg, .png, .webp, .gif)');
        }
        
        const urlRegex = /^https?:\/\/.+/i;
        if (!urlRegex.test(value)) {
          throw new Error('Invalid URL format');
        }
      }
    }
  },
  caption: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [0, 255]
    }
  },
  category: {
    type: DataTypes.ENUM('Room', 'Facility', 'Exterior', 'Interior', 'Dining', 'Other'),
    allowNull: false,
    defaultValue: 'Other'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {
      size: null,
      dimensions: {
        width: null,
        height: null
      },
      format: null,
      taken_at: null,
      last_modified: null
    },
    validate: {
      isValidMetadata(value) {
        if (value.dimensions && (
          (value.dimensions.width && value.dimensions.width < 0) || 
          (value.dimensions.height && value.dimensions.height < 0)
        )) {
          throw new Error('Image dimensions must be positive numbers');
        }
      }
    }
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Resort image',
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['resort_id', 'category']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['resort_id', 'display_order'],
      unique: true
    }
  ]
});

module.exports = ResortImage;