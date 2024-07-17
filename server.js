// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/user');
const nutshellRoutes = require('./routes/nutshell');
const alphaVantageRoutes = require('./routes/alphaVantage');
const transactionRoutes = require('./routes/transaction');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/nutshell', nutshellRoutes);
app.use('/api/alpha-vantage', alphaVantageRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.error('DB connection error:', error));

module.exports = app;
