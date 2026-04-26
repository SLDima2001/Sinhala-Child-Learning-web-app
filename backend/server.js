const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Simple wildcard - Vercel also injects headers via vercel.json for double safety
app.use(cors({ origin: '*' }));

app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/apiRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'Backend running ✅', timestamp: new Date() }));

// ─── MongoDB ─────────────────────────────────────────────────────────────────
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
  const conn = await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/project-website'
  );
  cachedConnection = conn;
  console.log('MongoDB connected successfully');
  return conn;
};

connectDB().catch(err => console.error('MongoDB connection error:', err));

// ─── Start locally (not on Vercel) ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// ─── Export for Vercel serverless ────────────────────────────────────────────
module.exports = app;
