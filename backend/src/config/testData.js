const sequelize = require('./database');
const User = require('../models/User');
const Resort = require('../models/Resort');
const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ResortFacility = require('../models/ResortFacility');
const Amenity = require('../models/Amenity');
const { v4: uuidv4 } = require('uuid');  // Add this at the top with other imports

async function testDataRelationships() {
  try {
    // Clean up any existing test data first
    await Payment.destroy({ where: {} });
    await Booking.destroy({ where: {} });
    await Room.destroy({ where: {} });
    await RoomType.destroy({ where: {} });
    await Amenity.destroy({ where: {} });
    await Resort.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test user with random UUID
    const user = await User.create({
      id: uuidv4(),  // Generate random UUID
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Resort Admin',  // Changed to match the correct enum value
      first_name: 'Test',
      last_name: 'User',
      phone: '+1234567890',
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ User created');

    // Create test resort with random UUID
    const resort = await Resort.create({
      id: uuidv4(),  // Generate random UUID
      name: 'Test Resort',
      location: 'Test Location',
      description: 'Test Description',
      contact_email: 'resort@test.com',
      contact_phone: '+1234567890',
      owner_id: user.id,  // Add the owner_id field
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Resort created');

    // Create test room type
    const roomType = await RoomType.create({
      id: uuidv4(),
      resort_id: resort.id,
      name: 'Deluxe Room',
      description: 'Luxury room with ocean view',
      base_price: 299.99,
      capacity: {
        adults: 2,
        children: 1
      },
      amenities: [],  // Empty array for now
      size_sqft: 400,
      bed_configuration: {  // Match the exact structure required
        single: 0,
        double: 0,
        queen: 0,
        king: 1  // At least one bed must be provided
      },
      is_active: true,
      images: [],
      policies: {
        check_in_time: "14:00",
        check_out_time: "11:00",
        cancellation_hours: 24,
        extra_bed_allowed: false,
        extra_bed_charge: 0
      },
      display_order: 1
    });
    console.log('✓ Room Type created');

    // Create test room
    const room = await Room.create({
      id: uuidv4(),
      resort_id: resort.id,
      room_type_id: roomType.id,
      name: 'Ocean View 101',
      room_number: '101',
      size: 'Deluxe',
      price_per_night: 299.99,
      capacity: 2,
      max_adults: 2,  // Added
      max_children: 2,  // Added
      bed_config: [  // Added as JSON array, not stringified
        {
          type: 'King',
          count: 1
        }
      ],
      status: 'Available',
      amenities: [
        {
          name: 'WiFi',
          description: 'High-speed internet'
        },
        {
          name: 'Ocean View',
          description: 'Panoramic ocean view'
        }
      ],
      floor: 1
    });
    console.log('✓ Room created');

    // Create test amenity
    const amenity = await Amenity.create({
      id: uuidv4(),
      resort_id: resort.id,
      name: 'WiFi',
      description: 'High-speed internet',
      category: 'Basic',
      is_chargeable: false,
      price_type: 'complimentary',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Amenity created');

    // Create test booking
    const booking = await Booking.create({
      id: uuidv4(),
      user_id: user.id,
      resort_id: resort.id,
      room_id: room.id,
      check_in: new Date(),
      check_out: new Date(Date.now() + 86400000),
      status: 'Confirmed',  // Changed from 'CONFIRMED' to 'Confirmed'
      total_amount: 299.99,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Booking created');

    // Create test payment
    const payment = await Payment.create({
      id: uuidv4(),
      booking_id: booking.id,
      transaction_id: 'TXN-' + Date.now(),
      amount: 299.99,
      payment_method: 'Credit Card',
      status: 'Pending',  // Changed from 'PENDING' to 'Pending'
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✓ Payment created');

    // Test relationships
    console.log('\nTesting Relationships:');
    const testBooking = await Booking.findOne({
      where: { id: booking.id },
      include: [
        { model: User, as: 'user' },
        { model: Resort, as: 'resort' },
        { model: Room, as: 'room' }
      ]
    });

    console.log('✓ Booking -> User:', testBooking.user.email === user.email);
    console.log('✓ Booking -> Resort:', testBooking.resort.name === resort.name);
    console.log('✓ Booking -> Room:', testBooking.room.name === room.name);

    // Cleanup test data
    await Payment.destroy({ where: { id: payment.id } });
    await Booking.destroy({ where: { id: booking.id } });
    await Room.destroy({ where: { id: room.id } });
    await RoomType.destroy({ where: { id: roomType.id } });
    await Amenity.destroy({ where: { id: amenity.id } });
    await Resort.destroy({ where: { id: resort.id } });
    await User.destroy({ where: { id: user.id } });
    
    console.log('\n✓ Test data cleaned up');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error('Validation error:', err.message);
      });
    }
  } finally {
    await sequelize.close();
  }
}

testDataRelationships();