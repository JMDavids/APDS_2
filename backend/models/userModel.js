const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },

    idNumber: {
        type: String,
        required: true
    },

    username: {
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
}, {timestamps: true})

//adding our own signup function
userSchema.statics.signup = async function (email, password)
{
    //validate if fields are actuall full
    if(!fullname || !email || !password || !idnumber || !accountnumber)
    {
        throw Error('All fields must be filled')
    }
    //validate email
    if(!validator.isEmail(email))
    {
        throw Error('Email invalid')
    }
    //validate password
    if(!validator.isStrongPassword(password))
    {
        throw Error('Password invalid')
    }

    //verify
    const existingUser = await this.findOne({email})
    if (existingUser)
    {
        throw Error('Email alrady taken')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})

    return user

}

//adding our own signup function
userSchema.statics.login = async function (email, password)
{
    //validate if fields are actually full
    if(!email || !password)
    {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})

    //validate email
    if(!user)
    {
        throw Error('Incorrect email or password')
    }

    const match = await bcrypt.compare(password, user.password)

    //validate password
    if(!match)
    {
        throw Error('Incorrext email or password')
    }

    
    return user

}

module.exports = mongoose.model('User', userSchema)