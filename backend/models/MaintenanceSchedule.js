const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Room = require('./Room');
const User = require('./User');

const MaintenanceSchedule = sequelize.define('MaintenanceSchedule', {
  // ... existing id, room_id, scheduled_by fields ...

  maintenance_type: {
    type: DataTypes.ENUM('Routine', 'Repair', 'Inspection', 'Deep Clean', 'Renovation', 'Emergency'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium',
    allowNull: false
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
      isDate: true
    },
    set(value) {
      if (new Date(value) <= new Date(this.getDataValue('start_date'))) {
        throw new Error('End date must be after start date');
      }
      this.setDataValue('end_date', value);
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Delayed'),
    defaultValue: 'Scheduled'
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  actual_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  assigned_to: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    validate: {
      isValidUserIds(value) {
        if (!Array.isArray(value)) {
          throw new Error('Assigned to must be an array of user IDs');
        }
      }
    }
  },
  completion_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recurring: {
    type: DataTypes.JSON,
    defaultValue: {
      is_recurring: false,
      frequency: null,
      end_after: null
    },
    validate: {
      validRecurring() {
        const validFrequencies = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
        if (this.recurring.is_recurring && !validFrequencies.includes(this.recurring.frequency)) {
          throw new Error('Invalid recurring frequency');
        }
        if (this.recurring.is_recurring && !this.recurring.end_after) {
          throw new Error('Recurring maintenance must have an end date');
        }
      }
    }
  }
}, {
  // ... rest of the configuration remains the same
});

module.exports = MaintenanceSchedule;