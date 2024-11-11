const express = require('express');
const { createPayment, getPayments, getPayment } = require('../controllers/paymentController');

const router = express.Router();

// Get all payments for the logged-in user
router.get('/', getPayments);

// Get a specific payment by ID
router.get('/:id', getPayment);

// Create a new payment
router.post('/', createPayment);

module.exports = router;
