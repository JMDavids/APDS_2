const Employee = require('../models/employeeModel') // Correct path to your model
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// Create JWT token for the employee
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '3d' })
}

// Login Employee
const loginEmployee = async (req, res) => {
    const { empID, password } = req.body;

    if (!empID || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    try {
        // Attempt to log in the employee
        const employee = await Employee.login(empID, password);

        // Generate JWT token
        const token = createToken(employee._id);

        // Send token and empID back in the response
        res.status(200).json({ empID: employee.empID, token });
    } catch (error) {
        console.error('Login failed:', error.message);  // Log the full error message
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
  loginEmployee,
}
