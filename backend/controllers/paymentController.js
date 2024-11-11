const Payment = require('../models/paymentModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const verifyTokenAndGetUser = async (req) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new Error('Unauthorized access: No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('Unauthorized access: User not found');
        }

        return user;
    } catch (error) {
        throw new Error('Unauthorized access: Invalid token');
    }
};

// Get all payments for the logged-in user
const getPayments = async (req, res) => {
    try {
        const user = await verifyTokenAndGetUser(req);
        const userId = user._id;

        const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Get a specific payment by ID for the logged-in user
const getPayment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }

    try {
        const user = await verifyTokenAndGetUser(req);
        const userId = user._id;

        const payment = await Payment.findOne({ _id: id, userId });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

// Create a new payment for the logged-in user
const createPayment = async (req, res) => {
    const { amount, currency, provider, accountInfo, swiftCode } = req.body;

    // Basic validation
    if (!amount || !currency || !provider || !accountInfo || !swiftCode) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await verifyTokenAndGetUser(req);
        const userId = user._id;

        const salt = await bcrypt.genSalt(10);
        const hashedAccountInfo = await bcrypt.hash(accountInfo, salt);
        const hashedSwiftCode = await bcrypt.hash(swiftCode, salt);

        // Add the new payment to the database
        const payment = await Payment.create({
            amount,
            currency,
            provider,
            accountInfo: hashedAccountInfo,
            swiftCode: hashedSwiftCode,
            userId, // Associate payment with the user
        });

        res.status(200).json(payment);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};


module.exports = {
    getPayment,
    getPayments,
    createPayment
}
