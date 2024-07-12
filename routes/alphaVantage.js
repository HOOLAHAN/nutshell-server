const express = require('express');
const { getStockData } = require('../controllers/alphaVantageController');

const router = express.Router();

router.get('/', getStockData);

module.exports = router;
