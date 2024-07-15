// controllers/transactionController.js

const Transaction = require('../models/transactionModel');

// Create a new transaction
const createTransaction = async (req, res) => {
  const { symbol, purchasePrice, numberOfShares, purchaseDate } = req.body;
  const userId = req.user._id;

  try {
    const transaction = await Transaction.create({ user: userId, symbol, purchasePrice, numberOfShares, purchaseDate });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all transactions for the authenticated user
const getTransactions = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await Transaction.find({ user: userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { symbol, purchasePrice, numberOfShares, purchaseDate } = req.body;
  const userId = req.user._id;

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      { symbol, purchasePrice, numberOfShares, purchaseDate },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or user not authorized' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or user not authorized' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction };
