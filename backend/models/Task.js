const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['pickup', 'delivery', 'verification', 'other']
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  requirements: [{
    type: String
  }],
  completionNotes: {
    type: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
taskSchema.index({ donation: 1, status: 1 });
taskSchema.index({ volunteer: 1, status: 1 });
taskSchema.index({ status: 1, scheduledTime: 1 });
taskSchema.index({ type: 1, status: 1 });
taskSchema.index({ verificationStatus: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 