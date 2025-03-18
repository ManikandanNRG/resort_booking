const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Room = require('./Room');
const User = require('./User');

const RoomAvailability = sequelize.define('RoomAvailability', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isFutureDate(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(value) < today) {
          throw new Error('Date must be today or in the future.');
        }
      }
    }
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  price_override: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('Available', 'Booked', 'Maintenance', 'Blocked'),
    defaultValue: 'Available',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  blocked_reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  timestamps: true,
  underscored: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['room_id', 'date'],
      unique: true
    },
    {
      fields: ['date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['last_updated_by']
    }
  ],
  hooks: {
    beforeCreate: async (availability) => {
      if (availability.status === 'Available') {
        availability.is_available = true;
        availability.blocked_reason = null;
      } else {
        availability.is_available = false;
      }
    },
    beforeUpdate: async (availability) => {
      if (availability.changed('status')) {
        availability.is_available = availability.status === 'Available';
        if (availability.is_available) {
          availability.blocked_reason = null;
        }
      }
    }
  }
});

// Static method to check availability for a date range
RoomAvailability.checkAvailability = async function(roomId, startDate, endDate) {
  const availabilities = await this.findAll({
    where: {
      room_id: roomId,
      date: {
        [sequelize.Op.between]: [startDate, endDate]
      }
    }
  });
  return availabilities.every(a => a.is_available);
};

module.exports = RoomAvailability;