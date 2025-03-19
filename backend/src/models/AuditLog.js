const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const AuditLog = sequelize.define('auditlog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  action: {
    type: DataTypes.ENUM(
      'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
      'PAYMENT', 'BOOKING', 'REFUND', 'SETTINGS_CHANGE',
      'PERMISSION_CHANGE', 'PASSWORD_RESET', 'EXPORT_DATA',
      'CANCEL_BOOKING', 'CHECK_IN', 'CHECK_OUT', 'MAINTENANCE',
      'PRICE_UPDATE', 'PROMOTION_CHANGE', 'FACILITY_UPDATE'
    ),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['User', 'Booking', 'Resort', 'Room', 'Payment', 'Review', 'Facility']]
    }
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIP: true
    }
  },
  user_agent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Success', 'Failed', 'Warning'),
    defaultValue: 'Success',
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {
      source: null,
      browser: null,
      platform: null,
      automated: false
    }
  },
  retention_period: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 365, // Days to keep the log
    validate: {
      min: 30,
      max: 3650 // Maximum 10 years
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['entity_type', 'entity_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['status']
    },
    {
      fields: ['retention_period']
    }
  ]
});

// Static method to create audit log entry
AuditLog.logActivity = async function(data, req = null) {
  const logData = {
    ...data,
    ip_address: req?.ip || data.ip_address || null,
    user_agent: req?.headers?.['user-agent'] || data.user_agent || null,
    metadata: {
      ...data.metadata,
      automated: !data.user_id,
      source: req ? 'web' : 'system'
    }
  };

  return await this.create(logData);
};

// Static method to cleanup old logs
AuditLog.cleanup = async function() {
  const now = new Date();
  const logs = await this.findAll();
  
  for (const log of logs) {
    const expiryDate = new Date(log.created_at);
    expiryDate.setDate(expiryDate.getDate() + log.retention_period);
    
    if (expiryDate <= now) {
      await log.destroy();
    }
  }
};

module.exports = AuditLog;