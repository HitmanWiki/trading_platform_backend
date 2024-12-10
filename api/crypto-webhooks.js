const { Client, Webhook } = require('coinbase-commerce-node');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        const sigHeader = req.headers['x-cc-webhook-signature'];
        try {
            const event = Webhook.verifyEventBody(
                req.body,
                sigHeader,
                process.env.COINBASE_WEBHOOK_SECRET
            );

            console.log('Webhook event:', event);
            res.status(200).json({ received: true });
        } catch (err) {
            console.error('Webhook verification failed:', err.message);
            res.status(400).json({ error: 'Webhook verification failed' });
        }
    } else {
        res.status(404).json({ error: 'Invalid request method' });
    }
};
