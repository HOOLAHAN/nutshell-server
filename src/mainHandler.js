const axios = require('axios');

const articleFetcherEndpoint = 'https://xqif696pd5.execute-api.eu-west-2.amazonaws.com/fetch-article';
const summaryGeneratorEndpoint = 'https://xqif696pd5.execute-api.eu-west-2.amazonaws.com/summarise';

exports.handler = async (event) => {
  try {
    const { url, content, bulletPoints } = JSON.parse(event.body);

    if (url) {
      // Call the article fetcher endpoint
      console.log('Fetching article from:', url);
      const articleResponse = await axios.post(articleFetcherEndpoint, { url });
      console.log('Article fetched:', articleResponse.data);
      
      // Extract content from the response
      const articleData = articleResponse.data;
      const articleContent = articleData.content;

      console.log('Content extracted:', articleContent);

      // Call the summary generator endpoint with the extracted content
      console.log('Calling summary generator endpoint...');
      const summaryResponse = await axios.post(summaryGeneratorEndpoint, { content: articleContent, bulletPoints });
      
      console.log('Summary generated:', summaryResponse.data);

      // Return the summary from the summary generator endpoint
      return { statusCode: 200, body: JSON.stringify(summaryResponse.data) };
    } else if (content) {
      // Call the summary generator endpoint
      console.log('Calling summary generator endpoint...');
      const summaryResponse = await axios.post(summaryGeneratorEndpoint, { content, bulletPoints });
      
      console.log('Summary generated:', summaryResponse.data);

      // Return the summary from the summary generator endpoint
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
        error: error.message,
        stack: error.stack,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
      })
    };
  }
};
