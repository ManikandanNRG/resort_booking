const db = require('../src/models');

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