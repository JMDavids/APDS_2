const Employee = require('../models/employeeModel'); // Correct path to your model
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const validator = require('validator');  // Import validator package
dotenv.config();

// Create JWT token for the employee
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '3d' });
};

// Login Employee
const loginEmployee = async (req, res) => {
    const { empID, password } = req.body;

    if (!empID || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    // Validate empID format (must start with 'emp' followed by exactly 5 digits)
    if (!validator.matches(empID, /^emp\d{5}$/)) {
        return res.status(400).json({
            error: 'Invalid Employee ID format. It should be in the format "empXXXXX" where XXXXX is exactly 5 digits.'
        });
    }

    // Access credentials from environment variables
    const empIDFromEnv = process.env.EMP_ID;
    const empPassFromEnv = process.env.EMP_PASS;

    try {
        // First compare the provided credentials with environment variables
        if (empID === empIDFromEnv && password === empPassFromEnv) {
            // If they match, generate a token
            const token = createToken(empID);  // You can use empID to generate the token
            return res.status(200).json({ empID, token });
        }

        // If credentials don't match the environment variables, check MongoDB
        const employee = await Employee.login(empID, password); // Assuming you have a login function in your model
        
        // If employee found and credentials are valid, generate a token
        const token = createToken(employee._id);

        // Send token and empID back in the response
        res.status(200).json({ empID: employee.empID, token });
        
    } catch (error) {
        console.error('Login failed:', error.message);  // Log the error for debugging
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginEmployee
};
