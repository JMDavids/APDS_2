require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const userRoutes = require('./routes/userRouter')
const paymentRoutes = require('./routes/paymentRouter')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const https = require('https')
const app = express()
const employeeRoutes = require('./routes/employeeRoutes')
// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'], //
    credentials: true,
  })
)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Only allow resources from the same origin
      scriptSrc: ["'self'"], // Allow scripts from the same origin
      styleSrc: ["'self'"], // Allow styles from the same origin
      imgSrc: ["'self'", 'data:'], // Allow images from the same origin and data URIs
    },
    reportOnly: false,
  })
)

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/employee',employeeRoutes)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the stack trace
  res.status(500).json({ error: 'Something went wrong!' });
});
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err))

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...')
})

const options = {
  key: fs.readFileSync('certificates\\d.key'),
  cert: fs.readFileSync('certificates\\s.crt'),
}

// Create HTTPS server
const server = https.createServer(options, app)

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
