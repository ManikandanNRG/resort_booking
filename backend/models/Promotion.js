const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Resort = require('./Resort');

const Promotion = sequelize.define('Promotion', {
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
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isUppercase: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  discount_type: {
    type: DataTypes.ENUM('percentage', 'fixed_amount'),
    allowNull: false
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: {
        args: [100],
        msg: "Percentage discount cannot exceed 100%"
      }
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minimum_stay: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  terms_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  applicable_room_types: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    comment: 'Empty array means applicable to all room types'
  },
  blackout_dates: {
    type: DataTypes.ARRAY(DataTypes.DATEONLY),
    defaultValue: []
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
      fields: ['code'],
      unique: true
    },
    {
      fields: ['start_date', 'end_date']
    },
    {
      fields: ['is_active']
    }
  ],
  hooks: {
    beforeCreate: async (promotion) => {
      promotion.code = promotion.code.toUpperCase();
    },
    beforeUpdate: async (promotion) => {
      if (promotion.changed('code')) {
        promotion.code = promotion.code.toUpperCase();
      }
    }
  }
});

// Static method to validate promotion
Promotion.validatePromotion = async function(code, roomTypeId, checkInDate, nights) {
  const promotion = await this.findOne({
    where: {
      code: code.toUpperCase(),
      is_active: true
    }
  });

  if (!promotion) throw new Error('Invalid promotion code');
  if (promotion.used_count >= promotion.usage_limit) throw new Error('Promotion limit reached');
  if (nights < promotion.minimum_stay) throw new Error(`Minimum stay of ${promotion.minimum_stay} nights required`);
  
  const now = new Date();
  if (now < promotion.start_date || now > promotion.end_date) throw new Error('Promotion not active');
  
  if (promotion.applicable_room_types.length > 0 && !promotion.applicable_room_types.includes(roomTypeId)) {
    throw new Error('Promotion not applicable for this room type');
  }

  return promotion;
};

module.exports = Promotion;