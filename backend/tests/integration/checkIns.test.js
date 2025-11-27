const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const CheckIn = require('../../src/models/CheckIn');

describe('CheckIn Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await CheckIn.deleteMany({});

    const response = await request(app).post('/api/auth/register').send({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
      age: '26-35',
      location: 'Lusaka, Zambia'
    });

    token = response.body.data.token;
    userId = response.body.data.user._id;
  });

  describe('POST /api/check-ins', () => {
    it('should create a new check-in', async () => {
      const checkInData = {
        mood: 7,
        activities: ['exercise', 'selfcare'],
        notes: 'Had a good day today'
      };

      const response = await request(app)
        .post('/api/check-ins')
        .set('Authorization', `Bearer ${token}`)
        .send(checkInData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.checkIn.mood).toBe(7);
      expect(response.body.data.checkIn.activities).toContain('exercise');
    });

    it('should validate mood range', async () => {
      const response = await request(app)
        .post('/api/check-ins')
        .set('Authorization', `Bearer ${token}`)
        .send({ mood: 11 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/check-ins', () => {
    beforeEach(async () => {
      await CheckIn.create([
        { user: userId, mood: 7, date: new Date() },
        { user: userId, mood: 6, date: new Date(Date.now() - 86400000) },
        { user: userId, mood: 8, date: new Date(Date.now() - 172800000) }
      ]);
    });

    it('should get all user check-ins', async () => {
      const response = await request(app)
        .get('/api/check-ins')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.checkIns).toHaveLength(3);
    });

    it('should filter check-ins by date range', async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await request(app)
        .get('/api/check-ins')
        .query({ startDate: today, endDate: today })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.checkIns.length).toBeGreaterThan(0);
    });
  });
});
