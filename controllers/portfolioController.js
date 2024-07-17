// controllers/portfolioController.js

const Transaction = require('../models/transactionModel');
const { fetchHistoricalPrices } = require('../functions/stockPriceUtils');

const calculatePortfolioValue = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await Transaction.find({ user: userId });

    const symbols = [...new Set(transactions.map(transaction => transaction.symbol))];
    const historicalPrices = {};

    for (const symbol of symbols) {
      historicalPrices[symbol] = await fetchHistoricalPrices(symbol);
    }

    const portfolioValue = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate).toISOString().split('T')[0];
      const price = parseFloat(historicalPrices[transaction.symbol][date]['5. adjusted close']);
      const value = price * transaction.numberOfShares * (transaction.type === 'buy' ? 1 : -1);

      if (!portfolioValue[date]) {
        portfolioValue[date] = 0;
      }
      portfolioValue[date] += value;
    });

    // Accumulate values over time
    const dates = Object.keys(portfolioValue).sort();
    let accumulatedValue = 0;
    const accumulatedPortfolioValue = {};

    for (const date of dates) {
      accumulatedValue += portfolioValue[date];
      accumulatedPortfolioValue[date] = accumulatedValue;
    }

    res.status(200).json(accumulatedPortfolioValue);
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    res.status(500).json({ error: 'An error occurred while calculating portfolio value' });
  }
};

module.exports = { calculatePortfolioValue };
