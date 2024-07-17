// controllers/transactionController.js

const Transaction = require('../models/transactionModel');
const { checkPriceRange } = require('../middleware/stockPriceUtils');

const createTransaction = async (req, res) => {
  const { symbol, type, transactionPrice, numberOfShares, transactionDate } = req.body;
  const userId = req.user._id;

  if (!symbol || !type || !transactionPrice || !numberOfShares || !transactionDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const priceCheckMessage = await checkPriceRange(symbol, transactionDate, transactionPrice);
    if (priceCheckMessage.includes('outside the range')) {
      return res.status(400).json({ error: priceCheckMessage });
    }

    const transaction = await Transaction.create({ user: userId, symbol, type, transactionPrice, numberOfShares, transactionDate });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await Transaction.find({ user: userId });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { symbol, type, transactionPrice, numberOfShares, transactionDate } = req.body;
  const userId = req.user._id;

  if (!symbol || !type || !transactionPrice || !numberOfShares || !transactionDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const priceCheckMessage = await checkPriceRange(symbol, transactionDate, transactionPrice);
    if (priceCheckMessage.includes('outside the range')) {
      return res.status(400).json({ error: priceCheckMessage });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      { symbol, type, transactionPrice, numberOfShares, transactionDate },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or user not authorized' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    res.status(500).json({ error: error.message });
  }
};

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
    console.error('Error deleting transaction:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction, getTransactions, updateTransaction, deleteTransaction };
