const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Debug middleware for this router
router.use((req, res, next) => {
    console.log(`User route accessed: ${req.method} ${req.path}`);
    next();
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`Fetching user with ID: ${req.params.id}`);
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            console.log(`User not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/:userId/orders', async (req, res) => {
    try {
        console.log(`Fetching orders for user ID: ${req.params.userId}`);
        const orders = await Order.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user address and mobile
router.put('/:userId/address', async (req, res) => {
  try {
    const { userId } = req.params;
    const { address, mobile } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address data is required' });
    }

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          address,
          mobile: mobile || '' // Update mobile if provided
        } 
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ 
      message: 'Failed to update user information',
      error: error.message 
    });
  }
});

module.exports = router; 