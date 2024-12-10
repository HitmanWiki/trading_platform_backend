const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/crypto-webhooks', require('./routes/cryptoWebhookRoutes'));
app.use('/api/crypto-payments', require('./routes/cryptoPaymentRoutes'));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

