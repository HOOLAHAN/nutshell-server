// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const nutshellRoutes = require('./routes/nutshell');
const alphaVantageRoutes = require('./routes/alphaVantage');
const transactionRoutes = require('./routes/transaction');

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Enable CORS
app.use(cors());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/nutshell', nutshellRoutes);
app.use('/api/alpha-vantage', alphaVantageRoutes);
app.use('/api/transactions', transactionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch((error) => console.log(error));

module.exports = app;
