const express = require('express');
const router = express.Router();
const { Client, resources } = require('coinbase-commerce-node');
const User = require('../models/user');

Client.init(process.env.COINBASE_COMMERCE_API_KEY);

const { Charge } = resources;

// Create a Crypto Payment Session
router.post('/create-charge', async (req, res) => {
    const { userId } = req.body;

    try {
        const charge = await Charge.create({
            name: "Trading Platform Subscription",
            description: "Subscribe to start trading with your custom API key.",
            local_price: {
                amount: "50.00", // Subscription fee in USD
                currency: "USD",
            },
            pricing_type: "fixed_price",
            metadata: { userId },
            redirect_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({ url: charge.hosted_url });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create charge' });
    }
});

module.exports = router;
