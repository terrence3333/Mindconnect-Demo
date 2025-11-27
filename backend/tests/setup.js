const mongoose = require('mongoose');

beforeAll(async () => {
  // Setup test database connection
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mindconnect_test');
  }
});

afterAll(async () => {
  // Cleanup and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
