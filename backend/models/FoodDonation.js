const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    donorName: String,
    foodType: String,
    quantity: Number,
    expirationDate: Date,
    pickupLocation: String
}, { timestamps: true });

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
