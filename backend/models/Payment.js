const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Booking = require('./Booking');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Booking,
      key: 'id'
    },
    onDelete: 'CASCADE',
    index: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { 
      min: 0,
      isDecimal: true 
    }
  },
  payment_method: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'UPI', 'PayPal', 'Bank Transfer'),
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('Success', 'Failed', 'Pending', 'Refunded'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: true
    }
  },
  refund_status: {
    type: DataTypes.ENUM('Not Applicable', 'Pending', 'Processed', 'Failed', 'Partial'),
    defaultValue: 'Not Applicable',
    allowNull: false
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
    validate: {
      isIn: [['USD', 'EUR', 'GBP', 'INR']]
    }
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['booking_id']
    },
    {
      fields: ['transaction_id']
    },
    {
      fields: ['payment_date']
    }
  ]
});

module.exports = Payment;