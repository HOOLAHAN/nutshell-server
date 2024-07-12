// controllers/alphaVantageController.js

require('dotenv').config();
const axios = require('axios');

const getStockData = async (req, res) => {
    const symbol = req.query.symbol;
    const outputsize = req.query.outputsize || 'compact';
    const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol query parameter is required' });
    }

    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                outputsize: outputsize,
                apikey: API_KEY
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
        res.status(500).json({ error: 'An error occurred while fetching data from Alpha Vantage' });
    }
};

module.exports = { getStockData };
