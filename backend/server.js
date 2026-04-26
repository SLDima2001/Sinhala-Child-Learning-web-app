const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow all vercel.app subdomains + localhost for local dev
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      /vercel\.app$/,           // any *.vercel.app subdomain
      /^http:\/\/localhost/,    // any localhost port
    ];
    // allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);
    const isAllowed = allowed.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/apiRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'Backend is running ✅' }));

// ─── MongoDB ─────────────────────────────────────────────────────────────────
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;
  const conn = await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/project-website'
  );
  cachedConnection = conn;
  console.log('MongoDB connected successfully');
  return conn;
};

connectDB().catch(err => console.error('MongoDB connection error:', err));

// ─── Start locally ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

// ─── Export for Vercel serverless ────────────────────────────────────────────
module.exports = app;
