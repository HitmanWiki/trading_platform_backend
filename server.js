const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors'); // Import CORS middleware

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');


connectDB();


const app = express();


app.use(cors({
    origin: ['https://trading-platform-frontend-nu.vercel.app'], // Allow your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Include credentials (optional)
}));


// Apply body-parser for other routes
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Register the crypto-webhooks route
app.use(
    '/api/crypto-webhooks',
    express.raw({ type: 'application/json' }), // Use express.raw for webhook requests
    require('./routes/cryptoWebhookRoutes') // Ensure this path is correct
);

app.use('/api/crypto-payments', require('./routes/cryptoPaymentRoutes'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
