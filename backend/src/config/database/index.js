// Only import what we have moved so far
const sequelize = require('./connection');
const syncDatabase = require('./sync');
const initializeDatabase = require('./initialize');

module.exports = {
  sequelize,
  syncDatabase,
  initializeDatabase
};