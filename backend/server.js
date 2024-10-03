// backend/server.js
require('dotenv').config()

const express = require('express')
const userRoutes = require ('./routes/userRouter')
const paymentRoutes = require ('./routes/paymentRouter')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());

app.use('/api/users', userRoutes)
app.use('/api/payments', paymentRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
