const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    // Check if request body is empty
    if (!req.body || !req.body.email || !req.body.password) {
      console.log('Missing credentials in request body');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { email, password } = req.body;
    console.log('Processing login for email:', email);
    
    // Find user
    const user = await User.findOne({ email });
    console.log('User search result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
    };

    console.log('Sending successful login response for user:', email);
    
    // Make sure we're explicitly setting the content type
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Make sure error response is also properly formatted
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Debug log to see what's being sent
    console.log('Server sending user data:', {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullUser: user.toObject()
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Explicitly structure the response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile:user.mobile,  // Make sure role is included
      addresses: user.addresses || []
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    console.log(existingUser);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 