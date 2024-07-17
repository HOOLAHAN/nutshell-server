const express = require('express');
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const requireAuth = require('../middleware/requireAuth');
const verifyStockSymbol = require('../middleware/verifySymbol');

const router = express.Router();

// Require auth for all transaction routes
router.use(requireAuth);

// Create a new transaction
router.post('/', verifyStockSymbol, createTransaction);

// Get all transactions for the authenticated user
router.get('/', getTransactions);

// Update a transaction
router.put('/:id', verifyStockSymbol, updateTransaction);

// Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
