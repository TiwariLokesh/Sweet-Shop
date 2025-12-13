const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

let mongo;
let userToken;
let adminToken;

async function registerAndLogin({ email, password, name, role = 'user' }) {
  await request(app).post('/api/auth/register').send({ email, password, name, role });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Sweets API', () => {
  beforeEach(async () => {
    userToken = await registerAndLogin({ email: 'user@example.com', password: 'User1234', name: 'User One' });
    adminToken = await registerAndLogin({ email: 'admin@example.com', password: 'Admin1234', name: 'Admin One', role: 'admin' });
  });

  describe('POST /api/sweets', () => {
    it('creates a sweet for authenticated user', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Ladoo', category: 'Traditional', price: 5.5, quantity: 20 });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Ladoo', category: 'Traditional', price: 5.5, quantity: 20 });
      expect(res.body).toHaveProperty('id');
    });

    it('requires auth', async () => {
      const res = await request(app).post('/api/sweets').send({ name: 'Barfi', category: 'Traditional', price: 6, quantity: 10 });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/sweets', () => {
    it('lists sweets', async () => {
      await Sweet.create({ name: 'Jalebi', category: 'Fried', price: 3, quantity: 50 });
      await Sweet.create({ name: 'Gulab Jamun', category: 'Syrup', price: 4, quantity: 40 });

      const res = await request(app).get('/api/sweets').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await Sweet.create({ name: 'Kaju Katli', category: 'Dry', price: 10, quantity: 15 });
      await Sweet.create({ name: 'Milk Cake', category: 'Milk', price: 8, quantity: 12 });
    });

    it('searches by name', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ q: 'kaju' })
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Kaju Katli');
    });

    it('filters by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Milk' })
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Milk Cake');
    });

    it('filters by price range', async () => {
      const res = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 9, maxPrice: 11 })
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Kaju Katli');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('updates a sweet', async () => {
      const sweet = await Sweet.create({ name: 'Peda', category: 'Milk', price: 7, quantity: 25 });
      const res = await request(app)
        .put(`/api/sweets/${sweet.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 8 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(8);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('rejects non-admin', async () => {
      const sweet = await Sweet.create({ name: 'Rabri', category: 'Milk', price: 9, quantity: 10 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    it('allows admin to delete', async () => {
      const sweet = await Sweet.create({ name: 'Rabri', category: 'Milk', price: 9, quantity: 10 });
      const res = await request(app)
        .delete(`/api/sweets/${sweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });
  });

  describe('Inventory', () => {
    it('purchases a sweet (decrements quantity)', async () => {
      const sweet = await Sweet.create({ name: 'Sandesh', category: 'Milk', price: 4, quantity: 5 });
      const res = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(3);
    });

    it('prevents purchase beyond stock', async () => {
      const sweet = await Sweet.create({ name: 'Sandesh', category: 'Milk', price: 4, quantity: 1 });
      const res = await request(app)
        .post(`/api/sweets/${sweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.status).toBe(400);
    });

    it('restocks requires admin', async () => {
      const sweet = await Sweet.create({ name: 'Chamcham', category: 'Milk', price: 4, quantity: 2 });
      const res = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('restocks with admin token', async () => {
      const sweet = await Sweet.create({ name: 'Chamcham', category: 'Milk', price: 4, quantity: 2 });
      const res = await request(app)
        .post(`/api/sweets/${sweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(7);
    });
  });
});
