module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],  // Fixed from moduleDirectoryRoots
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js']  // Changed from setupFiles
};