const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        maxlength: 100, //prevent buffer overflow attacks or input that is too large.
        validate: {
            validator: (v) => /^[a-zA-Z\s]+$/.test(v),
            message: props => `${props.value} is not a valid full name!`
        }
    },

    email: {
        type: String,
        required: true
    },

    idNumber: {
        type: String,
        required: true
    },

    accountNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

/*
function validateSAID(idNumber) {
    // Check if the ID is exactly 13 digits long and contains only numbers
    if (!/^\d{13}$/.test(idNumber)) {
        return false;
    }

    // Extract the birthdate from the ID and validate it
    const birthDate = idNumber.substr(0, 6);
    const year = parseInt(birthDate.substr(0, 2), 10);
    const month = parseInt(birthDate.substr(2, 2), 10);
    const day = parseInt(birthDate.substr(4, 2), 10);

    // Ensure month is valid (01-12) and day is valid (01-31)
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
    }

    // Perform Luhn algorithm to verify the checksum
    const luhn = (id) => {
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            let digit = parseInt(id[i], 10);
            if ((id.length - i) % 2 === 0) digit *= 2;
            if (digit > 9) digit -= 9;
            sum += digit;
        }
        return sum % 10 === 0;
    };

    return luhn(idNumber);
}
*/

function validateSAID(idNumber) {
    // Check if the ID is exactly 13 digits long and contains only numbers
    return /^\d{13}$/.test(idNumber);
}


// Adding the signup function
userSchema.statics.signup = async function (fullName, email, idNumber, accountNumber, password) {
    // Validate if fields are actually filled
    if (!fullName || !email || !password || !idNumber || !accountNumber) {
        throw Error('All fields must be filled');
    }

    //RegEx for Full Name
    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
        throw Error('Invalid full name');
    }
    

    // Validate email
    if (!validator.isEmail(email)) {
        throw Error('Email invalid');
    }

    // Validate password
    if (!validator.isStrongPassword(password)) {
        throw Error('Password invalid');
    }

    // Use simplified validation for ID number (13 digits check only)
    if (!validateSAID(idNumber)) {
        throw Error('ID number must be exactly 13 digits and numeric');
    }

    // Validate account number length
    if (accountNumber.length < 7 || accountNumber.length > 11) {
        throw Error('Account number must be between 7 and 11 digits');
    }

    // Ensure account number is numeric
    if (!validator.isNumeric(accountNumber)) {
        throw Error('Account number must be numeric');
    }

    // Check if the user already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw Error('Email already taken');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const hashedAccountNumber = await bcrypt.hash(accountNumber, salt);
    const hashedIdNumber = await bcrypt.hash(idNumber, salt);


    // Create the new user
    const user = await this.create({ fullName, email, idNumber: hashedIdNumber, accountNumber: hashedAccountNumber, password: hash });

    return user;
};

// Adding the login function
userSchema.statics.login = async function (email, password, accountNumber) {
    // Validate if fields are actually filled
    if (!email || !password || !accountNumber) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    // Validate email
    if (!user) {
        throw Error('Incorrect email or password');
    }

    const accountMatch = await bcrypt.compare(accountNumber, user.accountNumber);

    if (!accountMatch) {
        throw Error('Incorrect account number');
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);

    // Validate password
    if (!match) {
        throw Error('Incorrect email or password');
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
