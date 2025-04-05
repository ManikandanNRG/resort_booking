const request = require('supertest');
const app = require('../app');
const { User, Resort, Room, Booking } = require('../src/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let userToken, adminToken;
let testResort, testRoom, testBooking;

beforeAll(async () => {
  // Create test users
  const testUser = await User.create({
    name: 'Test User',
    email: 'bookingtest@test.com',
    password: 'password123',
    role: 'Customer'
  });

  const testAdmin = await User.create({
    name: 'Test Admin',
    email: 'bookingadmin@test.com',
    password: 'password123',
    role: 'Resort Admin'
  });

  // Generate tokens
  userToken = jwt.sign(
    { id: testUser.id, email: testUser.email, role: testUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  adminToken = jwt.sign(
    { id: testAdmin.id, email: testAdmin.email, role: testAdmin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Create test resort with required contact_email field
  testResort = await Resort.create({
    name: 'Test Resort for Booking',
    location: 'Test Location',
    description: 'Test Description',
    owner_id: testAdmin.id,
    contact_email: 'resort@test.com',  // Added this required field
    contact_phone: '123-456-7890',     // Added in case it's required
    address: '123 Test Street',        // Added in case it's required
    city: 'Test City',                 // Added in case it's required
    state: 'Test State',               // Added in case it's required
    zip_code: '12345',                 // Added in case it's required
    country: 'Test Country',           // Added in case it's required
    is_active: true                    // Added in case it's required
  });

  // Create test room
  testRoom = await Room.create({
    resort_id: testResort.id,
    name: 'Test Room',
    type: 'Standard',
    price_per_night: 100
  });

  // Create test booking
  testBooking = await Booking.create({
    user_id: testUser.id,
    resort_id: testResort.id,
    room_id: testRoom.id,
    check_in: new Date('2023-07-01'),
    check_out: new Date('2023-07-05'),
    status: 'Confirmed'
  });
});

afterAll(async () => {
  // Clean up
  await Booking.destroy({ where: {} });
  await Room.destroy({ where: {} });
  await Resort.destroy({ where: {} });
  await User.destroy({ where: {} });
});

describe('Booking API', () => {
  describe('GET /api/bookings', () => {
    it('should get user bookings with valid token', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not get bookings without token', async () => {
      const res = await request(app)
        .get('/api/bookings');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/resorts/:id/bookings', () => {
    it('should get resort bookings for resort owner', async () => {
      const res = await request(app)
        .get(`/api/resorts/${testResort.id}/bookings`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should not allow non-owners to get resort bookings', async () => {
      const res = await request(app)
        .get(`/api/resorts/${testResort.id}/bookings`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/resorts/:id/bookings', () => {
    it('should create a new booking', async () => {
      const newBooking = {
        room_id: testRoom.id,
        check_in: '2023-08-01T12:00:00Z',
        check_out: '2023-08-05T12:00:00Z'
      };

      const res = await request(app)
        .post(`/api/resorts/${testResort.id}/bookings`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(newBooking);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /api/bookings/:id', () => {
    it('should update booking status as resort owner', async () => {
      const res = await request(app)
        .put(`/api/bookings/${testBooking.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Confirmed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('Confirmed');
    });

    it('should allow user to cancel their booking', async () => {
      const res = await request(app)
        .put(`/api/bookings/${testBooking.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'Cancelled' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('Cancelled');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should cancel a booking', async () => {
      const res = await request(app)
        .delete(`/api/bookings/${testBooking.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Booking cancelled successfully');
    });
  });
});