const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Resort = require('./Resort');
const User = require('./User');

const ResortAdmin = sequelize.define('resortadmin', {
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
  assigned_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  role: {
    type: DataTypes.ENUM('Owner', 'Manager', 'Staff'),
    allowNull: false,
    defaultValue: 'Staff'
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      bookings: ['read'],
      facilities: ['read'],
      pricing: ['read'],
      reports: ['read'],
      marketing: ['read']
    },
    validate: {
      validPermissions(value) {
        const validActions = ['create', 'read', 'update', 'delete'];
        Object.values(value).forEach(actions => {
          if (!Array.isArray(actions) || !actions.every(a => validActions.includes(a))) {
            throw new Error('Invalid permission actions. Allowed: create, read, update, delete.');
          }
        });
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended', 'Pending'),
    defaultValue: 'Pending',
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000] // Maximum 1000 characters for notes
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['resort_id', 'user_id'],
      unique: true
    },
    {
      fields: ['role']
    },
    {
      fields: ['status']
    },
    {
      fields: ['assigned_by']
    }
  ],
  hooks: {
    beforeUpdate: async (admin) => {
      // Auto update last_login when status changes from Pending to Active
      if (admin.changed('status') && admin.status === 'Active' && admin.previous('status') === 'Pending') {
        admin.last_login = new Date();
      }
    }
  }
});

// Instance method to update last login
ResortAdmin.prototype.updateLastLogin = async function() {
  this.last_login = new Date();
  await this.save();
};

// Static method to update last login by user ID
ResortAdmin.updateLastLogin = async function(userId) {
  await this.update(
    { last_login: new Date() },
    { where: { user_id: userId } }
  );
};

module.exports = ResortAdmin;