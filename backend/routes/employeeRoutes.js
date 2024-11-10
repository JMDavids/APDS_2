const express = require('express');
const { loginEmployee, logoutEmployee } = require('../controllers/employeeController');
const ExpressBrute = require('express-brute');
const helmet = require('helmet');

const router = express.Router();

// Apply helmet for security headers to prevent common attacks (XSS, etc.)
router.use(helmet());

// Use memory store to store failed login attempts (simple in-memory storage for demo purposes)
const store = new ExpressBrute.MemoryStore();

// Configure brute-force protection for employee login attempts (5 retries within 10 minutes)
const bruteForce = new ExpressBrute(store, {
    freeRetries: 5, // Number of allowed login attempts before blocking
    minWait: 1000 * 60, // 1-minute wait time after reaching max retries
    maxWait: 1000 * 60 * 10, // Maximum of 10 minutes block time after repeated failures
    lifetime: 1000 * 60 * 10, // 10 minutes lifetime for login attempt records
});

// Protect the login route with brute-force protection to prevent attacks
router.post('/login',  loginEmployee);





// Logout route doesn't need brute-force protection; it simply logs the employee out


module.exports = router;
