const mongoose = require('mongoose')


const Schema = mongoose.Schema

//creating the schema
const paymentSchema = new Schema({
    amount:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        required: true
    },
    provider:{
        type: String,
        required: true
    },
    accountInfo:{
        type: Number,
        required: true
    },
    swiftCode:{
        type: String,
        required: true
    }
}, {timestamps: true})


//create the model "book"
module.exports = mongoose.model('Payment', paymentSchema)