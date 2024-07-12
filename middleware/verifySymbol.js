// middleware/verifySymbol.js

const axios = require('axios');

const verifyStockSymbol = async (req, res, next) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: symbol,
        apikey: API_KEY
      }
    });

    const matches = response.data.bestMatches;
    const isValidSymbol = matches.some(match => match['1. symbol'].toUpperCase() === symbol.toUpperCase());

    if (!isValidSymbol) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }

    next();
  } catch (error) {
    console.error('Error verifying stock symbol:', error);
    res.status(500).json({ error: 'Unable to verify stock symbol' });
  }
};

module.exports = verifyStockSymbol;
