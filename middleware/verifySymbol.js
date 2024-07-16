// middleware/verifySymbol.js

const axios = require('axios');

const verifyStockSymbol = async (req, res, next) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: symbol,
        apikey: API_KEY
      }
    });

    console.log('Alpha Vantage response:', response.data);

    const matches = response.data.bestMatches;
    if (!matches || matches.length === 0) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }

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
