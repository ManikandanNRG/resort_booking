const sequelize = require('./connection');
const db = require('../../models');

async function syncDatabase() {
  try {
    console.log('Starting database synchronization...');
    
    // Initialize models and their associations
    Object.values(db).forEach(model => {
      if (model.associate) {
        model.associate(db);
      }
    });

    // Sync with alter option to preserve existing data while updating schema
    await sequelize.sync({ alter: true });
    console.log('✓ Database schema updated successfully');

    // List updated tables
    const [results] = await sequelize.query(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';"
    );
    
    console.log('\nSynchronized tables:');
    results.forEach(result => {
      console.log(`✓ ${result.tablename}`);
    });

    return true;
  } catch (error) {
    console.error('Database synchronization failed:', error);
    return false;
  }
}

module.exports = syncDatabase;