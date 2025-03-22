const db = require('../models');

async function seedDatabase() {
  try {
    // Clear existing data
    await db.sequelize.sync({ force: true });
    console.log('✓ Database cleared');

    console.log('Starting to seed database...');

    // 1. Create Subscription Plans
    const subscriptionPlan = await db.SubscriptionPlan.create({
      name: 'Basic',  // Changed to match enum value
      price: 99.99,
      features: ['All features', 'Priority support', 'Unlimited rooms'],
      duration: 30,
      max_rooms: 50,
      max_admins: 5,
      allowed_features: ['booking', 'analytics']  // Added allowed_features array
    });
    console.log('✓ Subscription Plan created');

    // Rest of your seed data remains the same
    const user = await db.User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',  // Changed email
      password: 'password123',
      role: 'Customer'
    });
    console.log('✓ Customer User created');

    const resortOwner = await db.User.create({
      name: 'Resort Owner',
      email: 'resort.owner@example.com',  // Changed email
      password: 'password123',
      role: 'Resort Owner'
    });
    console.log('✓ Resort Owner created');

    // 3. Create Resort with required fields
    const resort = await db.Resort.create({
      name: 'Luxury Beach Resort',
      description: 'A beautiful beach resort',
      location: 'Beach City',
      subscription_plan_id: subscriptionPlan.id,
      owner_id: resortOwner.id,
      contact_email: resortOwner.email
    });
    console.log('✓ Resort created');

    // 4. Create Resort Admin (no need for explicit association)
    const resortAdmin = await db.ResortAdmin.create({
      user_id: resortOwner.id,
      resort_id: resort.id,
      access_level: 'Full'
    });
    console.log('✓ Resort Admin created');

    // 5. Create Room Types
    const roomType = await db.RoomType.create({
      resort_id: resort.id,
      name: 'Deluxe Suite',
      description: 'Luxury room with ocean view',
      base_price: 299.99,
      capacity: {
        adults: 2,
        children: 2
      },
      size_sqft: 500,
      bed_configuration: {
        king: 1,
        sofa: 1
      },
      amenities: ['AC', 'WiFi', 'Mini Bar'],
      status: 'Active'
    });
    console.log('✓ Room Type created');

    // 6. Create Room
    const room = await db.Room.create({
      resort_id: resort.id,
      room_type_id: roomType.id,
      name: 'Deluxe Ocean View 101',
      room_number: '101',
      floor: '1',
      size: 'Standard',
      price_per_night: roomType.base_price,
      capacity: 4,
      status: 'Available',
      amenities: [],
      maintenance_status: 'Good'
    });
    console.log('✓ Room created');

    // 7. Create Amenity
    const amenity = await db.Amenity.create({
      name: 'Ocean View Balcony',
      description: 'Private balcony with ocean view',
      category: 'Luxury',  // Must match ENUM values
      icon: 'https://example.com/icons/balcony.png',
      is_chargeable: true,
      price: 50.00,
      price_type: 'per_night',
      availability: {
        always_available: true,
        schedule: null,
        max_capacity: null,
        requires_booking: false,
        advance_booking_required: false,
        booking_lead_time_hours: 0
      },
      is_active: true,
      display_order: 1
    });
    console.log('✓ Amenity created');

    // Create another amenity (complimentary)
    const amenity2 = await db.Amenity.create({
      name: 'WiFi',
      description: 'High-speed wireless internet',
      category: 'Basic',
      icon: 'https://example.com/icons/wifi.png',
      is_chargeable: false,  // Will automatically set price to 0 and price_type to complimentary
      is_active: true,
      display_order: 2
    });
    console.log('✓ Basic Amenity created');

    // 8. Create Room Availability
    const roomAvailability = await db.RoomAvailability.create({
      room_id: room.id,
      date: new Date(),
      status: 'Available',
      price_modifier: 1.0
    });
    console.log('✓ Room Availability created');

    console.log('All test data seeded successfully');
    return true;

  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

module.exports = seedDatabase;