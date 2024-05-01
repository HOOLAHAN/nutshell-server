const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    if (!body || !body.url) {
      return { statusCode: 400, body: JSON.stringify({ message: 'No URL provided' }) };
    }

    const response = await axios.get(body.url);
    const html = response.data;
    const $ = cheerio.load(html);
    const articleContent = $('article').text();

    return {
      statusCode: 200,
      body: JSON.stringify({ content: articleContent.trim() })
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch article', error: error.message })
    };
  }
};
