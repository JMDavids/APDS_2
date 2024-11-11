const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    console.log(`Login attempt with empID: ${empID} and password: ${password}`);

    const emp = await this.findOne({ empID });
    console.log('Employee found:', emp);

    if (!emp) {
        console.log('Employee not found');
        throw Error('Incorrect employee ID or password');
    }

    if (emp.password !== password) {
        console.log('Password does not match!');
        throw Error('Incorrect employee ID or password');
    }

    console.log(`Password match successful for empID: ${empID}`);

    return emp;
};


module.exports = mongoose.model('employee', empSchema);
