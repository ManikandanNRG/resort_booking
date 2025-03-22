const testConnection = require('./testConnection');
const sequelize = require('./connection');

async function runTest() {
  try {
    await testConnection();
    console.log('Connection test completed successfully');
  } catch (error) {
    console.error('Connection test failed:', error);
  } finally {
    await sequelize.close();
  }
}

runTest();