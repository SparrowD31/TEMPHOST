const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    // Check if user exists first
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Now it's safe to log user details
    console.log('Login - Found User:', {
      id: user._id,
      email: user.email,
      role: user.role,
      fullUser: user.toObject()
    });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token with role included
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

    // Send response with full user object
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
    };

    console.log('Login - Sending Response:', userResponse);

    return res.json({
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
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