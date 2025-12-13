const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const sweetRoutes = require('./routes/sweetRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  // Handle duplicate key errors from Mongo for better client messaging
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
