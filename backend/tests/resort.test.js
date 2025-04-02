const request = require('supertest');
const app = require('../app');
const { Resort, User } = require('../src/models');

describe('Resort Endpoints', () => {
  let adminToken;
  let userToken;
  let testResort;
  let adminUser;

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'Resort Admin'
    });

    // Create regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'Customer'
    });

    // Get tokens
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123'
      });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123'
      });
    userToken = userRes.body.token;

    // Create a test resort
    testResort = await Resort.create({
      name: 'Test Resort',
      description: 'A beautiful test resort',
      location: 'Test Location',
      contact_email: 'resort@test.com',
      owner_id: adminUser.id
    });
  });

  afterEach(async () => {
    // Clean up
    await Resort.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /api/resorts', () => {
    it('should get all resorts', async () => {
      const res = await request(app)
        .get('/api/resorts');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/resorts/:id', () => {
    it('should get resort by id', async () => {
      const res = await request(app)
        .get(`/api/resorts/${testResort.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test Resort');
    });

    it('should return 404 for non-existent resort', async () => {
      const res = await request(app)
        .get('/api/resorts/999999');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/resorts', () => {
    it('should create new resort when admin', async () => {
      const res = await request(app)
        .post('/api/resorts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Resort',
          description: 'A new test resort',
          location: 'New Location',
          contact_email: 'newresort@test.com'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('New Resort');
    });

  });

  describe('PUT /api/resorts/:id', () => {
    it('should update resort when owner', async () => {
      const res = await request(app)
        .put(`/api/resorts/${testResort.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Resort',
          description: 'Updated description'
        });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Resort');
    });
  
    it('should not allow non-owner to update resort', async () => {
      const res = await request(app)
        .put(`/api/resorts/${testResort.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Updated Resort'
        });
  
      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/resorts/:id', () => {
    it('should delete resort when owner', async () => {
      const res = await request(app)
        .delete(`/api/resorts/${testResort.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Resort deleted successfully');
    });
  
    it('should not allow non-owner to delete resort', async () => {
      const res = await request(app)
        .delete(`/api/resorts/${testResort.id}`)
        .set('Authorization', `Bearer ${userToken}`);
  
      expect(res.statusCode).toBe(403);
    });
  });
});