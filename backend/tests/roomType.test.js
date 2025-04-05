const request = require('supertest');
const app = require('../app');
const { Resort, RoomType, User } = require('../src/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Room Type Endpoints', () => {
  let adminToken;
  let userToken;
  let testResort;
  let testRoomType;
  let adminUser;

  beforeEach(async () => {
    // Create admin user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10);
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'Resort Admin'
    });

    // Create regular user with hashed password
    const userHashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: userHashedPassword,
      role: 'Customer'
    });

    // Generate tokens directly for testing
    adminToken = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    userToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated admin token:', adminToken);

    // Create test resort
    testResort = await Resort.create({
      name: 'Test Resort',
      description: 'A beautiful test resort',
      location: 'Test Location',
      contact_email: 'resort@test.com',
      owner_id: adminUser.id
    });

    // Create test room type
    testRoomType = await RoomType.create({
      name: 'Deluxe Room',
      description: 'Luxurious room with ocean view',
      base_price: 200.00,
      size_sqft: 400,
      capacity_adults: 2,
      capacity_children: 2,
      bed_configuration: {
        king: 1,
        sofa: 1
      },
      resort_id: testResort.id
    });
  });

  afterEach(async () => {
    await RoomType.destroy({ where: {} });
    await Resort.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /api/resorts/:id/room-types', () => {
    it('should get all room types for a resort', async () => {
      const res = await request(app)
        .get(`/api/resorts/${testResort.id}/room-types`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('Deluxe Room');
    });
  });

  describe('GET /api/room-types/:id', () => {
    it('should get room type by id', async () => {
      const res = await request(app)
        .get(`/api/room-types/${testRoomType.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Deluxe Room');
    });
  });

  describe('POST /api/resorts/:id/room-types', () => {
    it('should create new room type when resort owner', async () => {
      const res = await request(app)
        .post(`/api/resorts/${testResort.id}/room-types`)
        .set('Authorization', `Bearer ${adminToken}`) // Verify token format
        .send({
          name: 'Suite Room',
          description: 'Luxury suite with balcony',
          base_price: 300.00,
          size_sqft: 600,
          capacity_adults: 3,
          capacity_children: 2,
          bed_configuration: {
            king: 1,
            queen: 1
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Suite Room');
    });
});

  describe('PUT /api/room-types/:id', () => {
    it('should update room type when resort owner', async () => {
      const res = await request(app)
        .put(`/api/room-types/${testRoomType.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Room',
          base_price: 250.00,
          size_sqft: 450,
          capacity_adults: 2,
          capacity_children: 2,
          bed_configuration: {
            king: 2
          }
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Room');
    });
});

  describe('DELETE /api/room-types/:id', () => {
    it('should delete room type when resort owner', async () => {
      const res = await request(app)
        .delete(`/api/room-types/${testRoomType.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Room type deleted successfully');
    });
  });
});