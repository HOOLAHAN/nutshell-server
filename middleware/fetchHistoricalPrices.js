// middleware/fetchHistoricalPrices.js
const axios = require('axios');
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';

async function fetchHistoricalPrices(symbol, startDate, endDate) {
  try {
    const response = await axios.get(ALPHA_VANTAGE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data['Time Series (Daily)'];
    if (!data) {
      throw new Error('Error fetching historical prices');
    }

    const prices = {};
    for (const date in data) {
      if (new Date(date) >= new Date(startDate) && new Date(date) <= new Date(endDate)) {
        prices[date] = {
          high: parseFloat(data[date]['2. high']),
          low: parseFloat(data[date]['3. low']),
          close: parseFloat(data[date]['4. close'])
        };
      }
    }

    console.log(`Fetched historical prices for ${symbol} from ${startDate} to ${endDate}`, prices);
    return prices;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    throw error;
  }
}

module.exports = { fetchHistoricalPrices };
