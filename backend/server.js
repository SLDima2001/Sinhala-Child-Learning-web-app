const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── MongoDB connection middleware ───────────────────────────────────────────
// In Vercel serverless, each invocation may be a cold start.
// We guard with readyState to reuse an existing connection when warm.
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // already connected or connecting
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10s timeout
    socketTimeoutMS: 45000
  });
  console.log('MongoDB connected');
};

// Apply connection middleware to all API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/apiRoutes'));

// Health check — also tests DB connectivity
app.get('/', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'Backend running ✅', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
  } catch (err) {
    res.json({ status: 'Backend running ✅', db: 'Disconnected', error: err.message });
  }
});

// ─── Start locally ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ─── Export for Vercel serverless ────────────────────────────────────────────
module.exports = app;
