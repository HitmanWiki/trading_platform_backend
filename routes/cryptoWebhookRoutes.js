const express = require('express');
const router = express.Router();
const { Client, Webhook } = require('coinbase-commerce-node'); // Import Coinbase SDK

// Initialize Coinbase Commerce Client
Client.init(process.env.COINBASE_COMMERCE_API_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    console.log('Webhook endpoint hit'); // Log when endpoint is hit
    res.status(200).json({ message: 'Webhook received' }); // Return a basic response
});

module.exports = router; // Ensure the router is exported
