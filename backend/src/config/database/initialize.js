const sequelize = require('./connection');
const db = require('../../models');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Initialize models and their associations
    Object.values(db).forEach(model => {
      if (model.associate) {
        model.associate(db);
      }
    });

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // List all tables with proper query
    const [results] = await sequelize.query(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';"
    );
    
    console.log('\nCreated tables:');
    results.forEach(result => {
      console.log(`✓ ${result.tablename}`);
    });

  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

module.exports = initializeDatabase;