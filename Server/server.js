require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// CORS configuration - This must be before any routes
app.use(cors({
  origin: [process.env.VITE_BASE_URL, 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  // Add CORS headers to every response
  res.header('Access-Control-Allow-Origin', process.env.VITE_BASE_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
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

