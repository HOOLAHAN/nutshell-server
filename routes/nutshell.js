// routes/nutshell.js

const express = require('express');
const { check } = require('express-validator');
const {
  fetchArticle,
  generateSummary,
  handleRequest,
} = require('../controllers/nutshellController');

const router = express.Router();

// Routes
router.post('/fetch-article', [
  check('url').isURL()
], fetchArticle);
router.post('/summarise', [
  check('text').notEmpty()
], generateSummary);
router.post('/handle-request', handleRequest);

module.exports = router;
