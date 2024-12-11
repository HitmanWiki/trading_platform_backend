const express = require('express');
const { signup, login, forgotPassword } = require('../controllers/userController');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const router = express.Router();

// Signup and Login routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword); // Add this route

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send email with reset token
        const resetUrl = `http://localhost:5000/api/users/reset-password/${resetToken}`;
        const message = `
      You requested a password reset. Please use the link below to reset your password:
      ${resetUrl}
    `;

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Add your email in .env
                pass: process.env.EMAIL_PASS, // Add your email password in .env
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            text: message,
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
