const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Use bcryptjs for hashing and comparing passwords
const validator = require('validator');
require('dotenv').config();

const Schema = mongoose.Schema;

const empSchema = new Schema({
    empID: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Function to handle login
empSchema.statics.login = async function (empID, password) {
    console.log(`Login attempt with empID: ${empID} and password: ${password}`);  // Log the login attempt

    const emp = await this.findOne({ empID });
    console.log('Employee found:', emp);  // Log the found employee object (make sure empID is correct)

    if (!emp) {
        console.log('Employee not found');
        throw Error('Incorrect employee ID or password');
    }

    // Directly compare the plain-text password with the stored one
    if (emp.password !== password) {
        console.log('Password does not match!');
        throw Error('Incorrect employee ID or password');
    }

    console.log(`Password match successful for empID: ${empID}`);  // Log password match success

    return emp;
};


module.exports = mongoose.model('employee', empSchema);
