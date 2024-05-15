# Nutshell Server Project README

## Overview

This server project is designed to fetch, parse, and summarise articles. It consists of three primary Lambda functions:

1. **Article Fetcher**: Fetches the content of an article from a given URL and parses it.
2. **Main Handler**: Coordinates between fetching the article and generating its summary.
3. **Summary Generator**: Uses OpenAI's GPT-3.5-turbo model to summarise the content into a specified number of bullet points.

## File Structure

```
.
├── src
│   ├── articleFetcher.js
│   ├── mainHandler.js
│   └── summaryGenerator.js
├── index.js
├── package.json
└── .env
```

### index.js

Basic serverless function to test deployment.

## Installation

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Deployment

This project is designed to be deployed on AWS using the Serverless framework.

1. **Install the Serverless framework:**

   ```sh
   npm install -g serverless
   ```

2. **Deploy the project:**

   ```sh
   serverless deploy
   ```

## Usage

1. **Fetch and parse an article:**

   Send a POST request to the `articleFetcher` endpoint with a JSON body containing the `url` of the article.

2. **Summarise an article:**

   Send a POST request to the `mainHandler` endpoint with a JSON body containing the `url` of the article and the number of `bulletPoints` for the summary.

3. **Summarise direct content:**

   Send a POST request to the `mainHandler` endpoint with a JSON body containing the `content` and the number of `bulletPoints` for the summary.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.