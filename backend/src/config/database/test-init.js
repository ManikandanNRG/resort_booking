const { sequelize, initializeDatabase } = require('./index');
const db = require('../../models');

async function testInit() {
  try {
    // Initialize models first
    Object.values(db).forEach(model => {
      if (model.associate) {
        model.associate(db);
      }
    });

    await initializeDatabase();
    console.log('Database initialization test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testInit();