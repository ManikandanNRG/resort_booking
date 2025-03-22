const sequelize = require('./connection');

async function testConnection() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

module.exports = testConnection;