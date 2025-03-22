const express = require('express');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('✓ Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Resort Management API is running' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
});