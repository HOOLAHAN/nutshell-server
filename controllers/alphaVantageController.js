// controllers/alphaVantageController.js

require('dotenv').config();
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

const getStockData = async (req, res) => {
  const symbol = req.query.symbol;
  const outputsize = req.query.outputsize || 'compact';

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol query parameter is required' });
  }

  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: outputsize,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data['Error Message']) {
      return res.status(400).json({ error: response.data['Error Message'] });
    }

    const timeSeries = response.data['Time Series (Daily)'];
    const data = Object.keys(timeSeries).map(date => ({
      date,
      ...timeSeries[date]
    }));

    res.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from Alpha Vantage' });
  }
};

const verifyStockSymbol = async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
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

    res.status(200).json({ message: 'Valid stock symbol' });
  } catch (error) {
    console.error('Error verifying stock symbol:', error);
    res.status(500).json({ error: 'Unable to verify stock symbol' });
  }
};

const getPriceRange = async (req, res) => {
  const { symbol, date } = req.body;

  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'full',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Time Series (Daily)'];
    if (!data || !data[date]) {
      return res.status(400).json({ error: `No data available for ${symbol} on ${date}` });
    }

    const high = parseFloat(data[date]['2. high']);
    const low = parseFloat(data[date]['3. low']);

    res.json({ high, low });
  } catch (error) {
    console.error('Error fetching price range:', error);
    res.status(500).json({ error: 'Unable to fetch price range' });
  }
};

module.exports = { getStockData, verifyStockSymbol, getPriceRange };
