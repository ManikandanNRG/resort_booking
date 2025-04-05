const express = require('express');
const cors = require('cors');
const resortRoutes = require('./routes/resortRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', resortRoutes);
app.use('/api', roomTypeRoutes);
app.use('/api', protectedRoutes);
app.use('/api', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;