const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - allow all origins for Vercel deployment
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', require('./routes/apiRoutes'));

// MongoDB connection (cached for serverless environments)
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
