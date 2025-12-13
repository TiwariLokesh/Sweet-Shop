const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongo;

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

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('creates a user with hashed password and default role user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'alice@example.com', password: 'Secret123', name: 'Alice' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({ email: 'alice@example.com', role: 'user', name: 'Alice' });
      expect(res.body.user).toHaveProperty('id');

      const User = mongoose.connection.model('User');
      const saved = await User.findOne({ email: 'alice@example.com' });
      expect(saved).toBeTruthy();
      expect(saved.role).toBe('user');
      expect(saved.password).not.toBe('Secret123');
      const match = await bcrypt.compare('Secret123', saved.password);
      expect(match).toBe(true);
    });

    it('rejects duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'bob@example.com', password: 'Pass1234', name: 'Bob' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'bob@example.com', password: 'Pass1234', name: 'Bob Two' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already/i);
    });

    it('requires email and password', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBeTruthy();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'carol@example.com', password: 'Car0l$Pass', name: 'Carol' });
    });

    it('logs in with valid credentials and returns token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'carol@example.com', password: 'Car0l$Pass' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({ email: 'carol@example.com', role: 'user', name: 'Carol' });
      expect(res.body.user).toHaveProperty('id');
    });

    it('rejects invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'carol@example.com', password: 'WrongPass' });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('rejects unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'Whatever123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });
});
