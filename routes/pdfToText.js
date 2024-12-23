// routes/pdfToText.js

const express = require('express');
const { pdfToText } = require('../controllers/pdfToText');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// POST pdf to return text
router.post('/pdf-to-text', pdfToText);

module.exports = router;
