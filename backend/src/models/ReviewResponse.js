const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Review = require('./Review');
const User = require('./User');

const ReviewResponse = sequelize.define('reviewresponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  review_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Review,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  responder_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    validate: {
      validPublication() {
        if (this.status === 'Draft' && this.is_published) {
          throw new Error("Draft responses cannot be published.");
        }
      }
    }
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  edited_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    defaultValue: 'Published'
  },
  helpful_count: {
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
  indexes: [
    {
      fields: ['review_id']
    },
    {
      fields: ['responder_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    }
  ],
  hooks: {
    beforeUpdate: async (response, options) => {
      if (response.changed('response')) {
        response.edited_at = new Date();
        if (options.userId) {
          response.edited_by = options.userId;
        }
      }
      if (response.changed('status') && response.status === 'Draft') {
        response.is_published = false;
      }
    }
  }
});

// Static method to get all responses for a review
ReviewResponse.getResponsesForReview = async function(reviewId) {
  return await this.findAll({
    where: { 
      review_id: reviewId,
      is_published: true
    },
    order: [['created_at', 'DESC']]
  });
};

module.exports = ReviewResponse;