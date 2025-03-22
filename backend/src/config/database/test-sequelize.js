const sequelize = require('./sequelize');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection test successful');
  } catch (error) {
    console.error('✕ Connection test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();