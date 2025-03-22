const sequelize = require('../src/config/database');
// To this
const { Sequelize } = require('sequelize');
const config = require('../src/config/database');
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

// Import all models
const Amenity = require('./Amenity');
const AuditLog = require('./AuditLog');
const AutomatedPricing = require('./AutomatedPricing');
const Booking = require('./Booking');
const GuestProfile = require('./GuestProfile');
const MaintenanceSchedule = require('./MaintenanceSchedule');
const MarketingTool = require('./MarketingTool');
const Notification = require('./Notification');
const Payment = require('./Payment');
const Promotion = require('./Promotion');
const Resort = require('./Resort');
const ResortAdmin = require('./ResortAdmin');
const ResortFacility = require('./ResortFacility');
const ResortImage = require('./ResortImage');
const Review = require('./Review');
const ReviewResponse = require('./ReviewResponse');
const Room = require('./Room');
const RoomAvailability = require('./RoomAvailability');
const RoomType = require('./RoomType');
const SubscriptionPlan = require('./SubscriptionPlan');
const User = require('./User');

// Define associations

// User Associations
User.hasOne(GuestProfile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
GuestProfile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Resort Associations
Resort.belongsTo(SubscriptionPlan, { foreignKey: 'subscription_plan_id' });
SubscriptionPlan.hasMany(Resort, { foreignKey: 'subscription_plan_id' });

Resort.hasMany(ResortAdmin, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
ResortAdmin.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(Room, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
Room.belongsTo(Resort, { foreignKey: 'resort_id' });

// Changed to many-to-many
Resort.belongsToMany(RoomType, { through: 'ResortRoomTypes', foreignKey: 'resort_id' });
RoomType.belongsToMany(Resort, { through: 'ResortRoomTypes', foreignKey: 'room_type_id' });

Resort.hasMany(Amenity, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
Amenity.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(ResortFacility, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
ResortFacility.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(ResortImage, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
ResortImage.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(Review, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
Review.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(Promotion, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
Promotion.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasOne(AutomatedPricing, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
AutomatedPricing.belongsTo(Resort, { foreignKey: 'resort_id' });

Resort.hasMany(MarketingTool, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
MarketingTool.belongsTo(Resort, { foreignKey: 'resort_id' });

// Room Associations
Room.belongsTo(RoomType, { foreignKey: 'room_type_id' });
RoomType.hasMany(Room, { foreignKey: 'room_type_id', onDelete: 'CASCADE' });

Room.hasMany(RoomAvailability, { foreignKey: 'room_id', onDelete: 'CASCADE' });
RoomAvailability.belongsTo(Room, { foreignKey: 'room_id' });

// Changed to many-to-many
Booking.belongsToMany(Room, { through: 'BookingRooms', foreignKey: 'booking_id' });
Room.belongsToMany(Booking, { through: 'BookingRooms', foreignKey: 'room_id' });

Room.hasMany(MaintenanceSchedule, { foreignKey: 'room_id', onDelete: 'CASCADE' });
MaintenanceSchedule.belongsTo(Room, { foreignKey: 'room_id' });

// Booking Associations
Booking.hasOne(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

Booking.hasOne(Review, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Review.belongsTo(Booking, { foreignKey: 'booking_id' });

// Review Associations
Review.hasOne(ReviewResponse, { foreignKey: 'review_id', onDelete: 'CASCADE' });
ReviewResponse.belongsTo(Review, { foreignKey: 'review_id' });

// RoomType Associations
RoomType.belongsToMany(Amenity, { through: 'RoomTypeAmenities' });
Amenity.belongsToMany(RoomType, { through: 'RoomTypeAmenities' });

// ResortAdmin Associations - Changed to hasOne
User.hasOne(ResortAdmin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ResortAdmin.belongsTo(User, { foreignKey: 'user_id' });

// Many-to-Many Relationships
Promotion.belongsToMany(RoomType, { through: 'PromotionRoomTypes' });
RoomType.belongsToMany(Promotion, { through: 'PromotionRoomTypes' });

// Update many-to-many relationships
Resort.belongsToMany(RoomType, { 
  through: 'ResortRoomTypes', 
  foreignKey: 'resort_id',
  timestamps: true 
});

Booking.belongsToMany(Room, { 
  through: 'BookingRooms', 
  foreignKey: 'booking_id',
  timestamps: true 
});

RoomType.belongsToMany(Amenity, { 
  through: 'RoomTypeAmenities',
  timestamps: true 
});

Promotion.belongsToMany(RoomType, { 
  through: 'PromotionRoomTypes',
  timestamps: true 
});

// Export models and relationships
module.exports = {
  sequelize,
  Amenity,
  AuditLog,
  AutomatedPricing,
  Booking,
  GuestProfile,
  MaintenanceSchedule,
  MarketingTool,
  Notification,
  Payment,
  Promotion,
  Resort,
  ResortAdmin,
  ResortFacility,
  ResortImage,
  Review,
  ReviewResponse,
  Room,
  RoomAvailability,
  RoomType,
  SubscriptionPlan,
  User
};
