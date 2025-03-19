const sequelize = require('./database');
const User = require('../models/User');
const Resort = require('../models/Resort');
const RoomType = require('../models/RoomType');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ResortFacility = require('../models/ResortFacility');
const Amenity = require('../models/Amenity');

async function testDataRelationships() {
  try {
    // 1. Create test user
    const user = await User.create({
      id: '99999999-9999-4a5b-9c8d-1a2b3c4d5e6f',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
      first_name: 'Test',
      last_name: 'User'
    });
    console.log('✓ User created');

    // 2. Create test resort
    const resort = await Resort.create({
      id: '88888888-8888-4a5b-9c8d-1a2b3c4d5e6f',
      name: 'Test Resort',
      location: 'Test Location',
      description: 'Test Description'
    });
    console.log('✓ Resort created');

    // 3. Create test room type
    const roomType = await RoomType.create({
      id: '77777777-7777-4a5b-9c8d-1a2b3c4d5e6f',
      resort_id: resort.id,
      name: 'Test Room Type',
      description: 'Test Description'
    });
    console.log('✓ Room Type created');

    // 4. Create test room
    const room = await Room.create({
      id: '66666666-6666-4a5b-9c8d-1a2b3c4d5e6f',
      resort_id: resort.id,
      room_type_id: roomType.id,
      name: 'Test Room',
      room_number: 'TEST-101'
    });
    console.log('✓ Room created');

    // 5. Create test amenity
    const amenity = await Amenity.create({
      id: '55555555-5555-4a5b-9c8d-1a2b3c4d5e6f',
      resort_id: resort.id,
      name: 'Test Amenity',
      category: 'Basic'
    });
    console.log('✓ Amenity created');

    // 6. Create test booking
    const booking = await Booking.create({
      id: '44444444-4444-4a5b-9c8d-1a2b3c4d5e6f',
      user_id: user.id,
      resort_id: resort.id,
      room_id: room.id,
      check_in: new Date(),
      check_out: new Date(Date.now() + 86400000)
    });
    console.log('✓ Booking created');

    // 7. Create test payment
    const payment = await Payment.create({
      id: '33333333-3333-4a5b-9c8d-1a2b3c4d5e6f',
      booking_id: booking.id,
      amount: 100.00,
      status: 'Pending'
    });
    console.log('✓ Payment created');

    // Test relationships
    const testBooking = await Booking.findOne({
      where: { id: booking.id },
      include: [
        { model: User, as: 'user' },
        { model: Resort, as: 'resort' },
        { model: Room, as: 'room' }
      ]
    });

    console.log('\nTesting Relationships:');
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
    console.error('Test failed:', error);
  }
}

async function initialize() {
  try {
    // First sync the database
    await syncDatabase();
    
    // Then test relationships
    console.log('\nTesting Data Relationships:');
    await testDataRelationships();
    
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    await sequelize.close();
  }
}

initialize();