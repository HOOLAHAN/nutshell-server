const axios = require('axios');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    if (!body || !body.url) {
      return { statusCode: 400, body: JSON.stringify({ message: 'No URL provided' }) };
    }

    const response = await axios.get(body.url);
    const html = response.data;
    const doc = new JSDOM(html, { url: body.url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error("Failed to parse the article.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: article.title,
        content: article.textContent,
        length: article.length
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
