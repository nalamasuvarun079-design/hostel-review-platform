require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB, getIsConnected } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());

app.use(express.json({
  limit: '10mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// ==========================================
// HEALTH CHECK API
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: getIsConnected()
      ? 'MongoDB'
      : 'In-Memory Mock Store (Fallback)'
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use('/api/auth', authRoutes);

app.use('/api/hostels', hostelRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ==========================================
// DATABASE CONNECTION
// ==========================================

connectDB().catch((err) => {
  console.error('Database connection error:', err);
});

// ==========================================
// VERCEL SERVERLESS EXPORT
// ==========================================

module.exports = app;

// ==========================================
// LOCAL DEVELOPMENT SERVER
// ==========================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log('=================================================');
    console.log(` Hosteller Server running on port ${PORT}`);
    console.log(
      ` Database Mode: ${
        getIsConnected()
          ? 'MongoDB Connected'
          : 'In-Memory Store Fallback Active'
      }`
    );
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log('=================================================');
  });
}