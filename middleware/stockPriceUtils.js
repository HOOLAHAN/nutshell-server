// middleware/stockPriceUtils.js

const axios = require('axios');
const NodeCache = require('node-cache');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';
const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour

async function fetchStockData(symbol, date) {
  const cacheKey = `${symbol}-${date}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

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

    const stockData = {
      high: parseFloat(data[date]['2. high']),
      low: parseFloat(data[date]['3. low']),
    };
    
    cache.set(cacheKey, stockData);
    console.log(`Fetched stock data for ${symbol} on ${date}:`, stockData);
    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
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

module.exports = { checkPriceRange };
