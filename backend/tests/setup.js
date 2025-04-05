const db = require('../src/models');
const dotenv = require('dotenv');
const path = require('path');

// Load test environment variables
dotenv.config({
  path: path.join(__dirname, '../config/test.env')
});

beforeEach(async () => {
  try {
    await db.sequelize.sync({ force: true });
  } catch (error) {
    console.error('Test setup error:', error);
    throw error;
  }
});

afterAll(async () => {
  await db.sequelize.close();
});