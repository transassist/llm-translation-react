# LLM TR Project Overview

This is a Next.js application designed for AI-powered translations that leverages multiple language models (Claude, OpenAI, and Gemini). The system is designed to provide professional-quality translations with domain expertise and includes features like post-editing capabilities, domain-specific prompts, glossary management, file upload functionality, and translation history tracking.

## Key Components and How They Work Together

1. **Frontend UI (React/Next.js)**
   - The main interface is built around a tab-based design with three sections: Translation, Glossary, and History
   - The translation form allows users to input text or upload documents (DOCX, PDF, or plain text)
   - Users can select translation domains, models, and configure advanced options
   - The UI is enhanced with animations using Framer Motion

2. **Backend Services (API Routes)**
   - /api/translate - Handles translation requests to various AI providers
   - /api/docx - Converts translated HTML to DOCX files for download
   - /api/save-translation - Saves completed translations to history

3. **State Management**
   - API keys are stored securely for different providers
   - Translation prompts are organized by domain
   - Glossary terms are managed for terminology consistency

4. **Translation Process**
   - Initial translation is performed by the primary AI model
   - Optional post-editing step uses a second model to refine the translation
   - For French Canadian translations, special handling ensures regional terminology

5. **File Processing**
   - Documents are parsed to extract text (using mammoth.js for DOCX files)
   - After translation, content can be exported back to DOCX format

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui components
- **State Management**: Zustand for client-side state stores
- **Animation**: Framer Motion for UI transitions
- **Document Processing**: Mammoth.js for DOCX handling
- **API Integration**: Anthropic Claude, OpenAI, and Google Gemini
- **Deployment**: Docker support for containerization

## Directory Structure Explained

1. **Root Directory**
   - Contains the main Docker configuration and a simplified API client
   - Two main subdirectories: /app (minimal implementation) and /ai-translation-app (full application)

2. **AI Translation App**
   - /src/app: Next.js app router configuration, page layouts and API routes
   - /src/components: UI components including the translation form, glossary manager, etc.
   - /src/lib: Utility functions, API client, and state stores
   - /src/types: TypeScript type definitions

3. **API Routes**
   - Translation API accepts text and configuration options, calls LLM providers
   - DOCX API converts HTML to DOCX documents for export
   - Save Translation API stores completed translations in history