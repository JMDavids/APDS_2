const express = require('express');
const { loginEmployee } = require('../controllers/employeeController');
const ExpressBrute = require('express-brute');
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Brute-force protection setup
const store = new ExpressBrute.MemoryStore();

const bruteForce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 1000 * 60,
    maxWait: 1000 * 60 * 10,
    lifetime: 1000 * 60 * 10,
});

// Login route with brute-force protection
router.post('/login', bruteForce.prevent, loginEmployee);

// Get all customers without middleware
router.get('/customers', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        const customers = await User.find({}, '-password -idNumber -accountNumber');
        res.json(customers);
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Get payments for a specific customer without middleware
router.get('/customers/:userId/payments', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
  
    try {
      jwt.verify(token, process.env.SECRET_KEY);

      console.log('Fetching payments for userId:', req.params.userId);
  
      const payments = await Payment.find({ userId: req.params.userId });

      console.log('Payments found:', payments);

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Verify a payment without middleware
router.post('/verify-payment/:paymentId', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        payment.verified = true;
        await payment.save();
        res.json({ message: 'Payment verified successfully', payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all payments without middleware
router.get('/payments', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY);

        const payments = await Payment.find({}).populate('userId', 'fullName username accountNumber');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/:accountNumber', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Unauthorized access' });
    }
  
    try {
      jwt.verify(token, process.env.SECRET_KEY);
  
      const { accountNumber } = req.params;
      const user = await User.findOne({ accountNumber });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by account number:', error);
      res.status(500).json({ error: error.message });
    }
  });

// ... existing routes ...

module.exports = router;
