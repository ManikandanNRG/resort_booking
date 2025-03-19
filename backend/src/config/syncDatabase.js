const sequelize = require('./database');
const fs = require('fs');
const path = require('path');

async function syncDatabase() {
  try {
    // Dynamically import all models from the models directory
    const modelsDir = path.join(__dirname, '..', 'models');
    const modelFiles = fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.js') && file !== 'index.js');

    // Import each model
    for (const file of modelFiles) {
      require(path.join(modelsDir, file));
    }

    // Sync based on environment
    const isDev = process.env.NODE_ENV === 'development';
    const options = isDev 
      ? { alter: true }  // Development: alter tables
      : { alter: false }; // Production: no auto-changes

    await sequelize.sync(options);
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

// Only run sync if explicitly called
if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase;