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

// Function to fetch article content
const fetchArticleContent = async (url) => {
  const response = await axios.get(url);
  const html = response.data;
  const doc = new JSDOM(html, { url });
  const reader = new Readability(doc.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Failed to parse the article.");
  }

  return {
    title: article.title,
    content: article.textContent,
    length: article.length,
  };
};

// Fetch article endpoint
const fetchArticle = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'No URL provided' });
    }

    const article = await fetchArticleContent(url);

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error.message, error.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
      stack: error.stack,
    });
  }
};

// Function to generate summary
const generateSummaryContent = async (content, bulletPoints) => {
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: `You are a helpful assistant tasked with summarizing content into ${bulletPoints} bullet points.` },
      { role: 'user', content: content },
    ],
    model: 'gpt-3.5-turbo',
  }).asResponse();

  const summary = await response.json();

  return summary;
};

// Generate summary endpoint
const generateSummary = async (req, res) => {
  try {
    const { content, bulletPoints } = req.body;

    if (!content || bulletPoints === undefined) {
      return res.status(400).json({ message: 'Required data missing (content, bulletPoints)' });
    }

    const summary = await generateSummaryContent(content, bulletPoints);

    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error.message, error.stack);
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

    let articleContent;
    if (url) {
      const article = await fetchArticleContent(url);
      articleContent = article.content;
    } else if (content) {
      articleContent = content;
    } else {
      return res.status(400).json({ message: 'Required data missing (url or content)' });
    }

    const summary = await generateSummaryContent(articleContent, bulletPoints);

    res.json({ summary });
  } catch (error) {
    console.error('Error handling request:', error.message, error.stack);
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
