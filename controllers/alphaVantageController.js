// controllers/alphaVantageController.js

require('dotenv').config();
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

const fetchAlphaVantageData = async (params) => {
  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    throw new Error('Error fetching data from Alpha Vantage');
  }
};

const getStockData = async (req, res) => {
  const { symbol, outputsize = 'compact' } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol query parameter is required' });
  }

  try {
    const data = await fetchAlphaVantageData({
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize,
      apikey: ALPHA_VANTAGE_API_KEY
    });

    if (data['Error Message']) {
      return res.status(400).json({ error: data['Error Message'] });
    }

    const timeSeries = data['Time Series (Daily)'];
    const result = Object.keys(timeSeries).map(date => ({
      date,
      ...timeSeries[date]
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data from Alpha Vantage' });
  }
};

const verifyStockSymbol = async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: 'Stock symbol is required' });
  }

  try {
    const data = await fetchAlphaVantageData({
      function: 'SYMBOL_SEARCH',
      keywords: symbol,
      apikey: ALPHA_VANTAGE_API_KEY
    });

    const matches = data.bestMatches;
    if (!matches || matches.length === 0) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }

    const isValidSymbol = matches.some(match => match['1. symbol'].toUpperCase() === symbol.toUpperCase());

    if (!isValidSymbol) {
      return res.status(400).json({ error: 'Invalid stock symbol' });
    }

    res.status(200).json({ message: 'Valid stock symbol' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to verify stock symbol' });
  }
};

const getPriceRange = async (req, res) => {
  const { symbol, date } = req.body;

  if (!symbol || !date) {
    return res.status(400).json({ error: 'Symbol and date are required' });
  }

  try {
    const data = await fetchAlphaVantageData({
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'full',
      apikey: ALPHA_VANTAGE_API_KEY
    });

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries || !timeSeries[date]) {
      return res.status(400).json({ error: `No data available for ${symbol} on ${date}` });
    }

    const high = parseFloat(timeSeries[date]['2. high']);
    const low = parseFloat(timeSeries[date]['3. low']);

    res.json({ high, low });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch price range' });
  }
};

module.exports = { getStockData, verifyStockSymbol, getPriceRange };
