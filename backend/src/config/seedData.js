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

    console.log('All test data seeded successfully');
    return true;

  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

module.exports = seedDatabase;