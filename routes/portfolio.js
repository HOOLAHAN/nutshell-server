// routes/portfolio.js

const express = require('express');
const { getPortfolioHistory } = require('../controllers/portfolioController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// Get portfolio history
router.get('/history', getPortfolioHistory);

module.exports = router;
