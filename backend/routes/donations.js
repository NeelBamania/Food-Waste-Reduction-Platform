const express = require('express');
const router = express.Router();
const FoodDonation = require('../models/FoodDonation');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please login to access this resource'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please login again'
      });
    }
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

// Create a new food donation
router.post('/', auth, async (req, res) => {
  try {
    const {
      donorType,
      organizationName,
      foodType,
      quantity,
      expiryDate,
      description,
      pickupAddress,
      pickupTime,
      specialInstructions
    } = req.body;

    // Validate required fields
    if (!donorType || !organizationName || !foodType || !quantity || !expiryDate || !description || !pickupAddress || !pickupTime) {
      return res.status(400).json({ 
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Validate pickup time
    const pickupDate = new Date(pickupTime);
    if (pickupDate <= new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Pickup time must be in the future'
      });
    }

    const donation = new FoodDonation({
      restaurant: req.user.userId,
      donorType,
      organizationName,
      foodType,
      quantity,
      expiryDate: new Date(expiryDate),
      description,
      pickupAddress,
      pickupTime: pickupDate,
      specialInstructions,
      status: 'pending'
    });

    await donation.save();
    
    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully!',
      donation
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    console.error('Donation creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating donation',
      error: error.message 
    });
  }
});

// Get all available food donations
router.get('/available', async (req, res) => {
  try {
    const donations = await FoodDonation.find({ status: 'available' })
      .populate('restaurant', 'name address')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Available donations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching donations',
      error: error.message 
    });
  }
});

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = await FoodDonation.aggregate([
      {
        $match: {
          restaurant: mongoose.Types.ObjectId(req.user.userId)
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const recentDonations = await FoodDonation.find({ restaurant: req.user.userId })
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      stats,
      recentDonations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching dashboard data',
      error: error.message 
    });
  }
});

// Get food donations by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const donations = await FoodDonation.find({ restaurant: req.params.restaurantId })
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Restaurant donations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching restaurant donations',
      error: error.message 
    });
  }
});

// Reserve a food donation
router.put('/reserve/:id', auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found' 
      });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ 
        success: false,
        message: 'This donation is no longer available' 
      });
    }

    donation.status = 'reserved';
    donation.receiver = req.user.userId;
    await donation.save();

    res.json({
      success: true,
      message: 'Donation reserved successfully! Please collect it within the specified time.',
      donation
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while reserving donation',
      error: error.message 
    });
  }
});

// Mark donation as collected
router.put('/collect/:id', auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false,
        message: 'Donation not found' 
      });
    }

    if (donation.status !== 'reserved' || donation.receiver.toString() !== req.user.userId) {
      return res.status(400).json({ 
        success: false,
        message: 'You are not authorized to collect this donation' 
      });
    }

    donation.status = 'collected';
    await donation.save();

    res.json({
      success: true,
      message: 'Donation collected successfully! Thank you for helping reduce food waste.',
      donation
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while collecting donation',
      error: error.message 
    });
  }
});

// Get user's reserved donations
router.get('/my-reservations', auth, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ receiver: req.user.userId })
      .populate('restaurant', 'name address')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Your reservations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching your reservations',
      error: error.message 
    });
  }
});

// Get all donations for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ restaurant: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Donations retrieved successfully',
      donations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching donations',
      error: error.message 
    });
  }
});

module.exports = router;
