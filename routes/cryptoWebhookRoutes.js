const express = require('express');
const router = express.Router();
const { Webhook } = require('coinbase-commerce-node');
const User = require('../models/user');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook endpoint hit');
    const sigHeader = req.headers['x-cc-webhook-signature'];

    try {
        const event = Webhook.verifyEventBody(
            req.body,
            sigHeader,
            process.env.COINBASE_WEBHOOK_SECRET
        );

        if (event.type === 'charge:confirmed') {
            console.log('Charge confirmed event received');
            const userId = event.data.metadata.userId;

            // Generate API Key
            const apiKey = `API-${Math.random().toString(36).substr(2, 10)}`;
            await User.findByIdAndUpdate(userId, { subscription: true, apiKey });

            console.log(`Subscription activated for User ID: ${userId}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).json({ error: 'Webhook handler failed' });
    }
});
