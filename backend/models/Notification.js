const { DataTypes, Op } = require('sequelize');
const sequelize = require('../src/config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Booking', 'Payment', 'System', 'Promotion', 'Review', 'Maintenance'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Low',
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  action_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {
      additional_info: null,
      booking_id: null,
      related_user: null,
      source: null,
      action_required: false
    }
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString()
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['user_id', 'read']
    },
    {
      fields: ['type']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['created_at']
    }
  ],
  hooks: {
    beforeUpdate: async (notification) => {
      if (notification.changed('read') && notification.read) {
        notification.read_at = new Date();
      }
    },
    beforeFind: async (options) => {
      options.where = {
        ...options.where,
        [Op.or]: [
          { expiry_date: null },
          { expiry_date: { [Op.gt]: new Date() } }
        ]
      };
    }
  }
});

// Static method to mark all notifications as read for a user
Notification.markAllAsRead = async function(userId) {
  await this.update(
    { 
      read: true, 
      read_at: new Date() 
    },
    { 
      where: { 
        user_id: userId, 
        read: false 
      } 
    }
  );
};

module.exports = Notification;