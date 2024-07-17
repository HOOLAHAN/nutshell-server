// middleware/stockPriceUtils.js

const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

async function fetchStockData(symbol, date) {
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
      throw new Error(`No data available for ${symbol} on ${date}`);
    }

    return {
      high: parseFloat(data[date]['2. high']),
      low: parseFloat(data[date]['3. low']),
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

async function checkPriceRange(symbol, date, price) {
  try {
    const { high, low } = await fetchStockData(symbol, date);
    if (price < low || price > high) {
      return `Price ${price} is outside the range for ${symbol} on ${date} (Low: ${low}, High: ${high})`;
    }
    return `Price ${price} is within the range for ${symbol} on ${date} (Low: ${low}, High: ${high})`;
  } catch (error) {
    return `Error checking price range: ${error.message}`;
  }
}

async function fetchHistoricalPrices(symbol) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol: symbol,
        outputsize: 'full',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Time Series (Daily)'];
    if (!data) {
      throw new Error(`No data available for ${symbol}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching historical prices for ${symbol}:`, error);
    throw error;
  }
}

module.exports = { fetchStockData, checkPriceRange, fetchHistoricalPrices };
