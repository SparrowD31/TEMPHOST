require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://temphost-frontend.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    console.log('Request origin:', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'));
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Set to false for cross-domain requests
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/address');
const productRoutes = require('./routes/product');
const adminRouter = require('./routes/adminRoutes');
const returnRoutes = require('./routes/returnRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/returns', returnRoutes);

// Test route
app.get('/api/test-server', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  next();
});

// Add this after your routes
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Log available routes
  console.log('Available routes:');
  app._router.stack
    .filter(r => r.route)
    .forEach(r => {
      console.log(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
    });
});

