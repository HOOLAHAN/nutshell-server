// routes/transaction.js

const express = require('express');
const { check } = require('express-validator');
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');
const verifyStockSymbol = require('../middleware/verifySymbol');

const router = express.Router();

// Require auth for all transaction routes
router.use(requireAuth);

// Create a new transaction
router.post('/', [
  check('symbol').notEmpty(),
  check('amount').isNumeric(),
  verifyStockSymbol
], createTransaction);

// Get all transactions for the authenticated user
router.get('/', getTransactions);

// Update a transaction
router.put('/:id', [
  check('symbol').notEmpty(),
  check('amount').isNumeric(),
  verifyStockSymbol
], updateTransaction);

// Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
