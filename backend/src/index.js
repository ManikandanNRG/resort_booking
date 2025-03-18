require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Resort Management API is running' });
});

const PORT = process.env.PORT || 3001;

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully.');
    
    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✓ Database synchronized.');

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
  }
}

startServer();