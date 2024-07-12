// controllers/nutshellController.js

require('dotenv').config();
const axios = require('axios');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const { OpenAI } = require('openai');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Fetch article
const fetchArticle = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'No URL provided' });
    }

    const response = await axios.get(url);
    const html = response.data;
    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error("Failed to parse the article.");
    }

    res.json({
      title: article.title,
      content: article.textContent,
      length: article.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};

// Generate summary
const generateSummary = async (req, res) => {
  try {
    const { content, bulletPoints } = req.body;

    if (!content || bulletPoints === undefined) {
      return res.status(400).json({ message: 'Required data missing (content, bulletPoints)' });
    }

    const response = await openai.chat.completions
      .create({
        messages: [
          { role: 'system', content: `You are a helpful assistant tasked with summarizing content into ${bulletPoints} bullet points.` },
          { role: 'user', content: content },
        ],
        model: 'gpt-3.5-turbo',
      })
      .asResponse();

    const summary = await response.json();

    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};

// Main handler
const handleRequest = async (req, res) => {
  try {
    const { url, content, bulletPoints } = req.body;

    if (!bulletPoints || (typeof bulletPoints !== 'number')) {
      return res.status(400).json({ message: 'Invalid or missing bulletPoints' });
    }

    if (url) {
      const articleResponse = await axios.post('/nutshell/fetch-article', { url });
      if (!articleResponse.data.content) {
        return res.status(500).json({ message: 'Failed to fetch content from article' });
      }

      const articleContent = articleResponse.data.content;
      const summaryResponse = await axios.post('/nutshell/summarise', { content: articleContent, bulletPoints });

      res.json(summaryResponse.data);
    } else if (content) {
      const summaryResponse = await axios.post('/nutshell/summarise', { content, bulletPoints });
      res.json(summaryResponse.data);
    } else {
      res.status(400).json({ message: 'Required data missing (url or content)' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  fetchArticle,
  generateSummary,
  handleRequest,
};
