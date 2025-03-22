const sequelize = require('../config/database');

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

// Create db object
const db = {
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

// Define associations
// User Associations
User.hasOne(GuestProfile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
GuestProfile.belongsTo(User, { foreignKey: 'user_id' });

db.User.hasMany(db.AuditLog, { foreignKey: 'user_id', onDelete: 'SET NULL' });
db.AuditLog.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Booking.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Review.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Notification.belongsTo(db.User, { foreignKey: 'user_id' });

// Resort Associations
db.Resort.belongsTo(db.SubscriptionPlan, { foreignKey: 'subscription_plan_id' });
db.SubscriptionPlan.hasMany(db.Resort, { foreignKey: 'subscription_plan_id' });

db.Resort.hasMany(db.ResortAdmin, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.ResortAdmin.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.Room, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.Room.belongsTo(db.Resort, { foreignKey: 'resort_id' });

// Changed to many-to-many
db.Resort.belongsToMany(db.RoomType, { through: 'ResortRoomTypes', foreignKey: 'resort_id' });
db.RoomType.belongsToMany(db.Resort, { through: 'ResortRoomTypes', foreignKey: 'room_type_id' });

db.Resort.hasMany(db.Amenity, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.Amenity.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.ResortFacility, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.ResortFacility.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.ResortImage, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.ResortImage.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.Review, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.Promotion, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.Promotion.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasOne(db.AutomatedPricing, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.AutomatedPricing.belongsTo(db.Resort, { foreignKey: 'resort_id' });

db.Resort.hasMany(db.MarketingTool, { foreignKey: 'resort_id', onDelete: 'CASCADE' });
db.MarketingTool.belongsTo(db.Resort, { foreignKey: 'resort_id' });

// Room Associations
db.Room.belongsTo(db.RoomType, { foreignKey: 'room_type_id' });
db.RoomType.hasMany(db.Room, { foreignKey: 'room_type_id', onDelete: 'CASCADE' });

db.Room.hasMany(db.RoomAvailability, { foreignKey: 'room_id', onDelete: 'CASCADE' });
db.RoomAvailability.belongsTo(db.Room, { foreignKey: 'room_id' });

// Changed to many-to-many
db.Booking.belongsToMany(db.Room, { through: 'BookingRooms', foreignKey: 'booking_id' });
db.Room.belongsToMany(db.Booking, { through: 'BookingRooms', foreignKey: 'room_id' });

db.Room.hasMany(db.MaintenanceSchedule, { foreignKey: 'room_id', onDelete: 'CASCADE' });
db.MaintenanceSchedule.belongsTo(db.Room, { foreignKey: 'room_id' });

// Booking Associations
db.Booking.hasOne(db.Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
db.Payment.belongsTo(db.Booking, { foreignKey: 'booking_id' });

db.Booking.hasOne(db.Review, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
db.Review.belongsTo(db.Booking, { foreignKey: 'booking_id' });

// Review Associations
db.Review.hasOne(db.ReviewResponse, { foreignKey: 'review_id', onDelete: 'CASCADE' });
db.ReviewResponse.belongsTo(db.Review, { foreignKey: 'review_id' });

// RoomType Associations
db.RoomType.belongsToMany(db.Amenity, { 
  through: 'RoomTypeAmenities',
  as: 'Amenities'  // Add explicit alias
});
db.Amenity.belongsToMany(db.RoomType, { 
  through: 'RoomTypeAmenities',
  as: 'RoomTypes'  // Add explicit alias
});

// ResortAdmin Associations - Changed to hasOne
db.User.hasOne(db.ResortAdmin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.ResortAdmin.belongsTo(db.User, { foreignKey: 'user_id' });

// Many-to-Many Relationships
db.Promotion.belongsToMany(db.RoomType, { through: 'PromotionRoomTypes' });
db.RoomType.belongsToMany(db.Promotion, { through: 'PromotionRoomTypes' });

module.exports = db;
