const express = require('express');
const router = express.Router();
const { Client, Webhook } = require('coinbase-commerce-node'); // Import Client and Webhook
const User = require('../models/user'); // Assuming you have a User model

// Initialize Coinbase Commerce Client
Client.init(process.env.COINBASE_COMMERCE_API_KEY);

// Webhook route for handling incoming requests from Coinbase
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook endpoint hit'); // Log when the endpoint is hit

    const sigHeader = req.headers['x-cc-webhook-signature']; // Retrieve the webhook signature

    try {
        // Verify the webhook event using Coinbase Commerce
        const event = Webhook.verifyEventBody(
            req.body, // Raw body from the request
            sigHeader, // Signature header from Coinbase
            process.env.COINBASE_WEBHOOK_SECRET // Your Webhook Secret
        );

        console.log('Webhook Event:', event); // Log the event for debugging

        // Handle specific event types (e.g., charge:confirmed)
        if (event.type === 'charge:confirmed') {
            console.log('Charge confirmed event received'); // Log event type
            const userId = event.data.metadata.userId; // Retrieve user ID from metadata

            // Generate an API Key for the user
            const apiKey = `API-${Math.random().toString(36).substr(2, 10)}`;
            await User.findByIdAndUpdate(userId, { subscription: true, apiKey });

            console.log(`Subscription activated for User ID: ${userId}`);
        }

        res.status(200).json({ received: true }); // Respond to Coinbase
    } catch (err) {
        console.error('Webhook Error:', err.message); // Log errors for debugging
        res.status(400).json({ error: 'Webhook verification failed' });
    }
});

module.exports = router; // Export the router
