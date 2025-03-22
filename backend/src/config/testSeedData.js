const db = require('../models');
const seedDatabase = require('./seedData');

async function testSeedData() {
  try {
    // Test seeding
    await seedDatabase();
    console.log('✓ Test data seeded');

    // Verify seeded data
    const users = await db.User.findAll();
    console.log(`✓ Users created: ${users.length}`);

    const resorts = await db.Resort.findAll();
    console.log(`✓ Resorts created: ${resorts.length}`);

    const subscriptionPlans = await db.SubscriptionPlan.findAll();
    console.log(`✓ Subscription Plans created: ${subscriptionPlans.length}`);

    const resortAdmins = await db.ResortAdmin.findAll();
    console.log(`✓ Resort Admins created: ${resortAdmins.length}`);

    // Test relationships with proper includes
    console.log('\nTesting Relationships:');
    const resort = await db.Resort.findOne({
      where: {},
      include: [
        { 
          model: db.SubscriptionPlan
        },
        { 
          model: db.ResortAdmin,
          as: 'resortadmins'
        }
      ]
    });

    if (resort) {
      console.log('✓ Resort Creation: Success');
      console.log(`✓ Resort -> SubscriptionPlan: ${resort.SubscriptionPlan !== null}`);
      console.log(`✓ Resort -> ResortAdmins: ${Array.isArray(resort.resortadmins) && resort.resortadmins.length > 0}`);
      
      // Additional relationship checks
      console.log(`✓ Resort Owner Link: ${resort.owner_id !== null}`);
      console.log(`✓ Contact Information: ${resort.contact_email !== null}`);
    } else {
      console.log('✗ Resort Creation: Failed');
    }

  } catch (error) {
    console.error('Error testing seed data:', error);
  } finally {
    await db.sequelize.close();
  }
}

testSeedData();