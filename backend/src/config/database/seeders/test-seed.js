const testSeedData = require('./testSeedData');

async function runTest() {
  try {
    await testSeedData();
    console.log('\nSeed test completed successfully');
  } catch (error) {
    console.error('Seed test failed:', error);
    process.exit(1);  // Exit with error code
  }
}

runTest();