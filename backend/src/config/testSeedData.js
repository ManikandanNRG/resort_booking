const db = require('../models');
const seedDatabase = require('./seedData');

async function testSeedData() {
  try {
    await seedDatabase();
    console.log('✓ Test data seeded');

    // Verify existing model data creation
    console.log('\nData Creation Status:');
    const users = await db.User.findAll();
    console.log(`✓ Users: ${users.length}`);
    const resorts = await db.Resort.findAll();
    console.log(`✓ Resorts: ${resorts.length}`);
    const subscriptionPlans = await db.SubscriptionPlan.findAll();
    console.log(`✓ Subscription Plans: ${subscriptionPlans.length}`);
    const resortAdmins = await db.ResortAdmin.findAll();
    console.log(`✓ Resort Admins: ${resortAdmins.length}`);
    
    // Add Room Management counts
    const roomTypes = await db.RoomType.findAll();
    console.log(`✓ Room Types: ${roomTypes.length}`);
    const rooms = await db.Room.findAll();
    console.log(`✓ Rooms: ${rooms.length}`);
    const amenities = await db.Amenity.findAll();
    console.log(`✓ Amenities: ${amenities.length}`);
    const roomAvailability = await db.RoomAvailability.findAll();
    console.log(`✓ Room Availability: ${roomAvailability.length}`);

    // Test relationships
    console.log('\nTesting Relationships:');
    
    // Resort relationships
    const resort = await db.Resort.findOne({
      include: [
        { model: db.SubscriptionPlan },
        { model: db.ResortAdmin, as: 'resortadmins' },
        { model: db.RoomType, as: 'roomTypes' },  // Changed to match Resort model's alias
        { model: db.Room, as: 'rooms' }
      ]
    });

    if (resort) {
      console.log('\nResort Relationships:');
      console.log(`✓ Resort -> SubscriptionPlan: ${resort.SubscriptionPlan !== null}`);
      console.log(`✓ Resort -> ResortAdmins: ${Array.isArray(resort.resortadmins) && resort.resortadmins.length > 0}`);
      console.log(`✓ Resort -> RoomTypes: ${Array.isArray(resort.roomTypes) && resort.roomTypes.length > 0}`);  // Changed to match alias
      console.log(`✓ Resort -> Rooms: ${Array.isArray(resort.rooms) && resort.rooms.length > 0}`);
      console.log(`✓ Contact Information: ${resort.contact_email !== null}`);
    }

    // Room Type relationships
    const roomType = await db.RoomType.findOne({
      include: [
        { model: db.Resort },
        { model: db.Room, as: 'rooms' }  // Changed from 'Rooms' to 'rooms'
      ]
    });

    if (roomType) {
      console.log('\nRoom Type Relationships:');
      console.log(`✓ RoomType -> Resort: ${roomType.Resort !== null}`);
      console.log(`✓ RoomType -> Rooms: ${Array.isArray(roomType.rooms) && roomType.rooms.length > 0}`);  // Changed to match alias
    }

    // Room relationships
    const room = await db.Room.findOne({
      include: [
        { model: db.Resort },
        { model: db.RoomType }
      ]
    });

    if (room) {
      console.log('\nRoom Relationships:');
      console.log(`✓ Room -> Resort: ${room.Resort !== null}`);
      console.log(`✓ Room -> RoomType: ${room.RoomType !== null}`);
    }

    console.log(`✓ Contact Information: ${resort.contact_email !== null}`);
  } catch (error) {
    console.error('Error testing seed data:', error);
  } finally {
    await db.sequelize.close();
  }
}

testSeedData();