import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt, formatGlossaryForPrompt, formatModelName, estimateTokenCount } from '@/lib/model-utils';

// Main translation API handler
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const {
      text,
      sourceLang,
      targetLang,
      domain = 'general',
      model,
      usePostEditing = false,
      postEditModel,
      glossary = {},
      apiKeys = {}
    } = body;

    // Validate required fields
    if (!text || !sourceLang || !targetLang || !model) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Identify the provider based on the model
    const provider = getProviderFromModel(model);
    
    // Check if we have the API key for the selected provider
    if (!apiKeys[provider]) {
      return NextResponse.json(
        { error: `API key for ${provider} is missing` },
        { status: 400 }
      );
    }

    // Prepare the formatted glossary
    const formattedGlossary = formatGlossaryForPrompt(glossary);
    
    // Prepare the system prompt for translation
    const systemPrompt = getSystemPrompt(domain, sourceLang, targetLang, false);

    // Perform initial translation based on the provider
    const initialTranslation = await translateWithProvider(
      provider,
      model,
      apiKeys[provider],
      text,
      systemPrompt,
      formattedGlossary
    );

    // Calculate token counts
    const inputTokens = estimateTokenCount(text);
    const outputTokens = estimateTokenCount(initialTranslation);

    // Prepare response object
    const response: any = {
      translatedText: initialTranslation,
      provider,
      model,
      tokenCount: {
        input: inputTokens,
        output: outputTokens,
      },
    };

    // If post-editing is requested, perform secondary translation
    if (usePostEditing && postEditModel) {
      const postEditProvider = getProviderFromModel(postEditModel);
      
      // Check if we have the API key for the post-edit provider
      if (!apiKeys[postEditProvider]) {
        return NextResponse.json(
          { error: `API key for post-editing provider ${postEditProvider} is missing` },
          { status: 400 }
        );
      }

      // Prepare the system prompt for post-editing
      const postEditSystemPrompt = getSystemPrompt(domain, sourceLang, targetLang, true);

      // Perform post-editing translation
      const postEditedTranslation = await translateWithProvider(
        postEditProvider,
        postEditModel,
        apiKeys[postEditProvider],
        initialTranslation,
        postEditSystemPrompt,
        formattedGlossary
      );

      // Calculate post-editing token counts
      const postEditInputTokens = estimateTokenCount(initialTranslation);
      const postEditOutputTokens = estimateTokenCount(postEditedTranslation);

      // Add post-editing information to the response
      response.postEditedText = postEditedTranslation;
      response.postEditProvider = postEditProvider;
      response.postEditModel = postEditModel;
      response.tokenCount.postEditInput = postEditInputTokens;
      response.tokenCount.postEditOutput = postEditOutputTokens;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation request' },
      { status: 500 }
    );
  }
}

// Helper function to determine provider from model name
function getProviderFromModel(modelId: string): string {
  if (modelId.startsWith('claude')) return 'anthropic';
  if (modelId.startsWith('gpt')) return 'openai';
  if (modelId.startsWith('gemini')) return 'google';
  return 'unknown';
}

// Helper function to translate text with different providers
async function translateWithProvider(
  provider: string,
  modelId: string,
  apiKey: string,
  text: string,
  systemPrompt: string,
  glossary: string
): Promise<string> {
  switch (provider) {
    case 'anthropic':
      return translateWithClaude(modelId, apiKey, text, systemPrompt, glossary);
    case 'openai':
      return translateWithOpenAI(modelId, apiKey, text, systemPrompt, glossary);
    case 'google':
      return translateWithGemini(modelId, apiKey, text, systemPrompt, glossary);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Translate with Claude
async function translateWithClaude(
  modelId: string,
  apiKey: string,
  text: string,
  systemPrompt: string,
  glossary: string
): Promise<string> {
  // Import here to avoid server-side issues with Next.js
  const { Anthropic } = await import('@anthropic-ai/sdk');
  
  const client = new Anthropic({
    apiKey: apiKey,
  });
  
  const userPrompt = `${glossary ? glossary + '\n\n' : ''}${text}`;
  
  try {
    const response = await client.messages.create({
      model: modelId,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to translate with Claude');
  }
}

// Translate with OpenAI
async function translateWithOpenAI(
  modelId: string,
  apiKey: string,
  text: string,
  systemPrompt: string,
  glossary: string
): Promise<string> {
  // Import here to avoid server-side issues with Next.js
  const OpenAI = await import('openai');
  
  const client = new OpenAI.OpenAI({
    apiKey: apiKey,
  });
  
  const userPrompt = `${glossary ? glossary + '\n\n' : ''}${text}`;
  
  try {
    const response = await client.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to translate with OpenAI');
  }
}

// Translate with Gemini
async function translateWithGemini(
  modelId: string,
  apiKey: string,
  text: string,
  systemPrompt: string,
  glossary: string
): Promise<string> {
  // Import here to avoid server-side issues with Next.js
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  // Format the model name properly for Gemini API
  const formattedModelId = formatModelName(modelId, 'google');
  
  // Initialize the API client
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: formattedModelId });
  
  // Combine the system prompt, glossary, and text
  const prompt = `${systemPrompt}\n\n${glossary ? glossary + '\n\n' : ''}${text}`;
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to translate with Gemini');
  }
}