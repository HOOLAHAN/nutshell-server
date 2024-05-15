const axios = require('axios');

const articleFetcherEndpoint = 'https://xqif696pd5.execute-api.eu-west-2.amazonaws.com/fetch-article';
const summaryGeneratorEndpoint = 'https://xqif696pd5.execute-api.eu-west-2.amazonaws.com/summarise';
const axiosConfig = {
  timeout: 5000 // Set timeout to 5 seconds
};

exports.handler = async (event) => {
  try {
    const { url, content, bulletPoints } = JSON.parse(event.body);

    // Basic data validation
    if (!bulletPoints || (typeof bulletPoints !== 'number')) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid or missing bulletPoints' }) };
    }

    if (url) {
      // Log fetching article
      console.log('Fetching article from:', url);
      const articleResponse = await axios.post(articleFetcherEndpoint, { url }, axiosConfig);
      console.log('Article fetched:', articleResponse.data);
      
      if (!articleResponse.data.content) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Failed to fetch content from article' }) };
      }

      const articleContent = articleResponse.data.content;
      console.log('Content extracted:', articleContent);

      const summaryResponse = await axios.post(summaryGeneratorEndpoint, { content: articleContent, bulletPoints }, axiosConfig);
      console.log('Summary generated:', summaryResponse.data);

      return { statusCode: 200, body: JSON.stringify(summaryResponse.data) };
    } else if (content) {
      console.log('Calling summary generator endpoint with direct content...');
      const summaryResponse = await axios.post(summaryGeneratorEndpoint, { content, bulletPoints }, axiosConfig);
      
      console.log('Summary generated:', summaryResponse.data);
      return { statusCode: 200, body: JSON.stringify(summaryResponse.data) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ message: 'Required data missing (url or content)' }) };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message || 'Unknown error',
        stack: error.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })
    };
  }
};
