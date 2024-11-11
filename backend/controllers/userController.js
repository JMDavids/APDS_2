const User = require('../models/userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '3d' });
}

// Login user
const loginUser = async (req, res) => {
    const { email, password, accountNumber } = req.body;
    try {
        const user = await User.login(email, password, accountNumber);

        // Create and store token in a cookie
        const token = createToken(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            sameSite: 'Lax'
        });

        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Logout user
const logoutUser = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0) 
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Sign up user
const signupUser = async (req, res) => {
    const { fullName, email, accountNumber, idNumber, password } = req.body;
    try {
        const user = await User.signup(fullName, email, idNumber, accountNumber, password);

        // Add token to track session
        const token = createToken(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        res.status(200).json({ email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    loginUser,
    signupUser,
    logoutUser
};
