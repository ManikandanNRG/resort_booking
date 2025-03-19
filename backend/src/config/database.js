const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('resort_booking', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;