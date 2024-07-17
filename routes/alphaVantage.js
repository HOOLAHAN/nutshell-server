// routes/alphaVantage.js

const express = require('express');
const { check } = require('express-validator');
const { getStockData, verifyStockSymbol, getPriceRange } = require('../controllers/alphaVantageController');

const router = express.Router();

router.post('/verify-symbol', [
  check('symbol').notEmpty()
], verifyStockSymbol);
router.post('/price-range', [
  check('symbol').notEmpty()
], getPriceRange);
router.get('/', getStockData);

module.exports = router;
