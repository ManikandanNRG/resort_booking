const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');

// Import all models in correct order
const User = require('./models/User');
const Resort = require('./models/Resort');
const RoomType = require('./models/RoomType');
const Room = require('./models/Room');

// Define associations
Resort.belongsTo(User, { foreignKey: 'owner_id' });
RoomType.belongsTo(Resort, { foreignKey: 'resort_id' });
Room.belongsTo(Resort, { foreignKey: 'resort_id' });
Room.belongsTo(RoomType, { foreignKey: 'room_type_id' });

const app = express();

// Sync database before starting the server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error:', err);
  });