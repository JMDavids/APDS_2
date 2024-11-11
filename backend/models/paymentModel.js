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
        type: String,
        required: true
    },
    swiftCode:{
        type: String,
        required: true
    },

    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})


//create the model "payment"
module.exports = mongoose.model('Payment', paymentSchema)