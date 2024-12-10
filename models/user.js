const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: { type: Boolean, default: false },
    apiKey: { type: String, default: null },
});

module.exports = mongoose.model('User', userSchema);
