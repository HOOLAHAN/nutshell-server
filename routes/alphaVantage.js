// routes/alphaVantage.js

const express = require('express');
const { getStockData, verifyStockSymbol, getPriceRange } = require('../controllers/alphaVantageController');

const router = express.Router();

router.post('/verify-symbol', verifyStockSymbol);
router.post('/price-range', getPriceRange);
router.get('/', getStockData);

module.exports = router;
