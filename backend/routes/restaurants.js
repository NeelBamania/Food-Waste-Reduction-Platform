const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    console.log('Received token:', token ? 'Token exists' : 'No token');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please login to access this resource'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please login again',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

// Register a new business
router.post('/register', auth, async (req, res) => {
  try {
    console.log('Registering business with user:', req.user);
    const {
      businessType,
      businessName,
      contactName,
      email,
      phone,
      address,
      pickupTime,
      frequency
    } = req.body;

    // Validate required fields
    if (!businessType || !businessName || !contactName || !email || !phone || !address || !pickupTime || !frequency) {
      return res.status(400).json({ 
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if business already exists
    const existingBusiness = await Restaurant.findOne({ 
      $or: [
        { email },
        { businessName }
      ]
    });

    if (existingBusiness) {
      return res.status(400).json({ 
        success: false,
        message: 'A business with this email or name already exists'
      });
    }

    const restaurant = new Restaurant({
      userId: req.user.userId,
      businessType,
      businessName,
      contactName,
      email,
      phone,
      address,
      pickupTime,
      frequency,
      status: 'pending'
    });

    await restaurant.save();
    
    res.status(201).json({
      success: true,
      message: 'Business registration submitted successfully!',
      restaurant
    });
  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while registering business',
      error: error.message 
    });
  }
});

// Get business profile
router.get('/profile', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ userId: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({ 
        success: false,
        message: 'Business profile not found' 
      });
    }
    res.json({
      success: true,
      restaurant
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching business profile',
      error: error.message 
    });
  }
});

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update restaurant
router.put('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is the owner
    if (restaurant.owner.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete restaurant
router.delete('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is the owner
    if (restaurant.owner.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await restaurant.remove();
    res.json({ message: 'Restaurant removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 