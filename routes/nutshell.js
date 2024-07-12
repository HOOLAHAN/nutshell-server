// routes/nutshell.js

const express = require('express');
const {
  fetchArticle,
  generateSummary,
  handleRequest,
} = require('../controllers/nutshellController');

const router = express.Router();

// Routes
router.post('/fetch-article', fetchArticle);
router.post('/summarise', generateSummary);
router.post('/handle-request', handleRequest);

module.exports = router;
