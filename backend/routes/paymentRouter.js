const express = require('express');
const { createPayment, getPayments, getPayment } = require('../controllers/paymentController');
const authMiddleware = require('../authMiddleware'); // Import the auth middleware

const router = express.Router();

// Use the auth middleware to protect the payment routes
router.use(authMiddleware);

// Get all payments for the logged-in user
router.get('/', getPayments);

// Get a specific payment by ID
router.get('/:id', getPayment);

// Create a new payment
router.post('/', createPayment);

module.exports = router;
