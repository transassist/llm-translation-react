# Getting Started with LLM Translation App

This guide will help you set up and run the LLM Translation application.

## Prerequisites

- Node.js 18 or later
- npm or yarn
- API keys for the language models you want to use:
  - Anthropic Claude
  - OpenAI
  - Google Gemini

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/transassist/llm-translation-react.git
   cd llm-translation-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_KEY=your_google_api_key
   ```

## Running the Application

Start the development server:
```
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

Build the application:
```
npm run build
```

Run the production build:
```
npm start
```

## Docker Deployment

You can also run the application using Docker:

1. Build the Docker image:
   ```
   docker build -t llm-translation-app .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key -e OPENAI_API_KEY=your_key -e GOOGLE_API_KEY=your_key llm-translation-app
   ```

## Project Structure

- `/src/app`: Next.js app router and API routes
- `/src/components`: UI components
- `/src/lib`: Utility functions, API client, and state stores
- `/docs`: Project documentation

## API Key Setup

The application stores API keys securely in the browser using Zustand with persistence. On first run, you'll need to configure your API keys in the settings panel.

## Features

- Multi-model translation (Claude, GPT, Gemini)
- Domain-specific prompts
- Post-editing capabilities
- Glossary management
- File upload/download
- Translation history