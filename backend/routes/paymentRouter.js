const express = require('express');
const { createPayment, getPayments, getPayment } = require('../controllers/paymentController');
// Remove the import of authMiddleware
// const authMiddleware = require('../authMiddleware');

const router = express.Router();

// Remove the middleware application
// router.use(authMiddleware);

// Get all payments for the logged-in user
router.get('/', getPayments);

// Get a specific payment by ID
router.get('/:id', getPayment);

// Create a new payment
router.post('/', createPayment);

module.exports = router;
