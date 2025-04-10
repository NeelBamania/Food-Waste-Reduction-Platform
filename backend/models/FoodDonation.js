const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorType: {
    type: String,
    required: true,
    enum: ['grocery', 'restaurant']
  },
  organizationName: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true,
    enum: ['perishable', 'non-perishable', 'prepared', 'beverages', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  expiryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Pickup time must be in the future'
    }
  },
  specialInstructions: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'available', 'reserved', 'collected', 'completed'],
    default: 'pending'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for better query performance
foodDonationSchema.index({ restaurant: 1, status: 1 });
foodDonationSchema.index({ pickupTime: 1 });
foodDonationSchema.index({ status: 1 });

const FoodDonation = mongoose.model('FoodDonation', foodDonationSchema);

module.exports = FoodDonation;
