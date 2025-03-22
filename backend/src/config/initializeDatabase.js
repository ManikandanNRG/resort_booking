const sequelize = require('./database');
const db = require('../models');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // List all tables
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\nCreated tables:');
    results.forEach(result => {
      console.log(`✓ ${result.table_name}`);
    });

  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

initializeDatabase();