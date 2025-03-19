const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');

// Import all models
require('./models/User');
require('./models/Resort');
require('./models/RoomType');
require('./models/Room');
const app = express();

// Sync database before starting the server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
    
    // Start the server after sync
    const PORT = process.env.PORT || 5000;  // Changed from 3000 to 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error:', err);
  });