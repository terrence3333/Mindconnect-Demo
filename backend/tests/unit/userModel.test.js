const User = require('../../src/models/User');

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'PlainPassword123',
        age: '26-35',
        location: { city: 'Lusaka', country: 'Zambia' }
      });

      await user.save();
      expect(user.password).not.toBe('PlainPassword123');
      expect(user.password.length).toBeGreaterThan(20);
    });
  });

  describe('Password Comparison', () => {
    it('should return true for correct password', async () => {
      const user = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123',
        age: '26-35',
        location: { city: 'Lusaka', country: 'Zambia' }
      });

      await user.save();
      const isMatch = await user.comparePassword('TestPassword123');
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123',
        age: '26-35',
        location: { city: 'Lusaka', country: 'Zambia' }
      });

      await user.save();
      const isMatch = await user.comparePassword('WrongPassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('Token Generation', () => {
    it('should generate valid JWT token', () => {
      const user = new User({
        _id: '507f1f77bcf86cd799439011',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'user'
      });

      const token = user.generateAuthToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('Validation', () => {
    it('should require fullName', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'TestPassword123',
        age: '26-35'
      });

      let error;
      try {
        await user.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.fullName).toBeDefined();
    });

    it('should require valid email', async () => {
      const user = new User({
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'TestPassword123',
        age: '26-35'
      });

      let error;
      try {
        await user.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
    });
  });
});
