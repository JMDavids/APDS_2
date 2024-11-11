const express = require('express');
const { loginUser, signupUser, logoutUser } = require('../controllers/userController');
const ExpressBrute = require('express-brute');
const helmet = require('helmet');

const router = express.Router();

// Apply helmet for security headers
router.use(helmet());

const store = new ExpressBrute.MemoryStore();

// Configure brute force protection
const bruteForce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 1000 * 60, // 1min wait time after 5 failed login attempts
    maxWait: 1000 * 60 * 10, // 10min max wait time
    lifetime: 1000 * 60 * 10 // 10min lifetime for failed attempts
});

// Protect the login route with brute force prevention
router.post('/login', bruteForce.prevent, loginUser);

// Add rate limiting to the signup route to avoid abuse
const signupRateLimiter = new ExpressBrute(store, {
    freeRetries: 10,
    minWait: 1000 * 60 * 5,
    maxWait: 1000 * 60 * 60,
    lifetime: 1000 * 60 * 60
});

// Protect the signup route
router.post('/signup', signupRateLimiter.prevent, signupUser);

// Logout route (no brute force needed)
router.get('/logout', logoutUser);

module.exports = router;
