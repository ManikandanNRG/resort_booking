const db = require('../src/models');
const { generateToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');
const bcrypt = require('bcryptjs');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = await db.User.create({
        name,
        email,
        password,
        role: role || 'Customer'
      });

      const token = generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt:', { email, password }); // Debug log
      
      const user = await db.User.findOne({ where: { email } });
      console.log('Found user:', user); // Debug log

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValidPassword); // Debug log

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      console.log('Generated token:', token); // Debug log

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;