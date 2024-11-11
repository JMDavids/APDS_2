const Employee = require('../models/employeeModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const validator = require('validator');
dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '3d' });
};

// Login Employee
const loginEmployee = async (req, res) => {
    const { empID, password } = req.body;

    if (!empID || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

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
            const token = createToken(empID);
            return res.status(200).json({ empID, token });
        }

        // If credentials don't match the environment variables, check MongoDB
        const employee = await Employee.login(empID, password);
        
        // If employee found and credentials are valid, generate a token
        const token = createToken(employee._id);

        // Send token and empID back in the response
        res.status(200).json({ empID: employee.empID, token });
        
    } catch (error) {
        console.error('Login failed:', error.message);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    loginEmployee
};
