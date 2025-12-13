const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const JWT_EXPIRES_IN = '1d';

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register({ email, password, name, role }) {
  if (!email || !password || !name) {
    const err = new Error('Email, password, and name are required');
    err.status = 400;
    throw err;
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 400;
    throw err;
  }

  const user = new User({ email, password, name, role: role || 'user' });
  await user.save();

  const token = createToken(user);
  const safeUser = { id: user.id, email: user.email, role: user.role, name: user.name };
  return { token, user: safeUser };
}

async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.status = 400;
    throw err;
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const match = await user.comparePassword(password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = createToken(user);
  const safeUser = { id: user.id, email: user.email, role: user.role, name: user.name };
  return { token, user: safeUser };
}

module.exports = { register, login };
