const express = require('express');
const router = express.Router();
const FoodDonation = require('../models/FoodDonation');

// Create a donation
router.post('/add', async (req, res) => {
    try {
        const newDonation = new FoodDonation(req.body);
        await newDonation.save();
        res.status(201).json(newDonation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all donations
router.get('/all', async (req, res) => {
    try {
        const donations = await FoodDonation.find();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
