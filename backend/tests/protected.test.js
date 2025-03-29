const request = require('supertest');
const app = require('../app');
const db = require('../src/models');

describe('Protected Routes', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    await db.User.destroy({ where: {} }); // Clear users

    // Create a regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        role: 'Customer'
      });
    userToken = userRes.body.token;

    // Create an admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'Resort Admin'
      });
    adminToken = adminRes.body.token;
  });

  describe('GET /api/profile', () => {
    it('should access profile with valid token', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Profile accessed successfully');
    });

    it('should not access profile without token', async () => {
      const res = await request(app)
        .get('/api/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/admin', () => {
    it('should allow admin access', async () => {
      const res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Admin area accessed successfully');
    });

    it('should deny regular user access', async () => {
      const res = await request(app)
        .get('/api/admin')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Access denied');
    });
  });
});