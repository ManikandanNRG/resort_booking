const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    // Add debug logs
    console.log('Comparing passwords:');
    console.log('Input password:', password);
    console.log('Stored hash:', hashedPassword);
    const result = await bcrypt.compare(password, hashedPassword);
    console.log('Compare result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    throw new Error('Error comparing passwords');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};