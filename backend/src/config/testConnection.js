const db = require('../models');

async function testConnection() {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✓ Database connection successful');

    // Sync database (this will create tables)
    await db.sequelize.sync({ force: true });
    console.log('✓ Database synchronized');

    // Get all tables with more detailed query
    const [tables] = await db.sequelize.query(`
      SELECT 
        table_name,
        table_schema
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\nCreated tables:');
    if (tables.length === 0) {
      console.log('No tables found in the database');
    } else {
      tables.forEach(table => {
        console.log(`✓ ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await db.sequelize.close();
  }
}

testConnection();