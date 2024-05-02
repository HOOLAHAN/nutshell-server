// src/functions/summaryGenerator.js

const { OpenAI } = require('openai');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const { content, bulletPoints } = JSON.parse(event.body);

    if (!content || bulletPoints === undefined) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Required data missing (content, bulletPoints)' }) };
    }

    const response = await openai.chat.completions
      .create({
        messages: [
          { role: 'system', content: `You are a helpful assistant tasked with summarizing content into ${bulletPoints} bullet points.` },
          { role: 'user', content: content }
        ],
        model: 'gpt-3.5-turbo'
      })
      .asResponse();

    // Log the response for debugging
    console.log(response);

    // Extract the summary from the response data
    const summary = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ summary: summary })
    };
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
