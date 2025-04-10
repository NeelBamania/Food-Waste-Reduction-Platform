const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  foodType: {
    type: String,
    required: true,
    enum: ['prepared', 'raw', 'packaged', 'other']
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'items', 'servings']
  },
  description: {
    type: String,
    required: true
  },
  pickupAddress: {
    type: String,
    required: true
  },
  pickupTime: {
    type: Date,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'picked_up', 'delivered', 'cancelled', 'expired'],
    default: 'pending'
  },
  adminApproval: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String
  },
  images: [{
    type: String
  }],
  trackingHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  rating: {
    score: {
      type: Number,
      min: 0,
      max: 5
    },
    feedback: String,
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
donationSchema.index({ donor: 1, status: 1 });
donationSchema.index({ charity: 1, status: 1 });
donationSchema.index({ volunteer: 1, status: 1 });
donationSchema.index({ status: 1, pickupTime: 1 });
donationSchema.index({ adminApproval: 1, status: 1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 