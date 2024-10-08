const Payment = require('../models/paymentModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Get all payments for the logged-in user
const getPayments = async (req, res) => {
    const userId = req.user._id; // Assuming the user ID is attached to the request after authentication

    try {
        const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a specific payment by ID for the logged-in user
const getPayment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; //  the user ID is attached to the request

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid payment ID' });
    }

    try {
        const payment = await Payment.findOne({ _id: id, userId }); // Ensure payment belongs to the user

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Create a new payment for the logged-in user
const createPayment = async (req, res) => {
    const { amount, currency, provider, accountInfo, swiftCode } = req.body;
    const userId = req.user._id; // Assuming the user ID is attached to the request

    // Basic validation
    if (!amount || !currency || !provider || !accountInfo || !swiftCode) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedAccountInfo = await bcrypt.hash(accountInfo, salt);
    const hashedSwiftCode = await bcrypt.hash(swiftCode, salt);

    // Add the new payment to the database
    try {
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
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getPayment,
    getPayments,
    createPayment
}
