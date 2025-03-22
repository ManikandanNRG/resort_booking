const syncDatabase = require('./sync');  // Import directly from sync.js
const sequelize = require('./connection');

async function testSync() {
  try {
    await syncDatabase();
    console.log('Sync test completed successfully');
  } catch (error) {
    console.error('Sync test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testSync();