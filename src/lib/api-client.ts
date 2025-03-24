// API client for handling translation requests
import { MODELS } from './constants';

// Pricing information (per 1K tokens)
const PRICING = {
  claude: {
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  },
  openai: {
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
  },
  gemini: {
    'gemini-2.0-pro': { input: 0.0075, output: 0.0075 },
    'gemini-2.0-flash': { input: 0.0035, output: 0.0035 },
    'gemini-2.0-flash-lite': { input: 0.001, output: 0.001 },
    'gemini-1.5-pro-latest': { input: 0.0035, output: 0.0035 },
    'gemini-1.5-flash-latest': { input: 0.0007, output: 0.0007 },
    'gemini-1.5-pro-001': { input: 0.0035, output: 0.0035 },
    'gemini-1.5-flash-001': { input: 0.0007, output: 0.0007 },
  }
};

// Type for translation request
export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  domain: string;
  model: string;
  usePostEditing?: boolean;
  postEditModel?: string;
  glossary?: Record<string, string>;
}

// Type for translation response
export interface TranslationResponse {
  translatedText: string;
  provider: string;
  model: string;
  postEditedText?: string;
  postEditProvider?: string;
  postEditModel?: string;
  tokenCount?: {
    input: number;
    output: number;
    postEditInput?: number;
    postEditOutput?: number;
  };
  estimatedCost?: number;
}

// Function to get provider from model ID
export const getProviderFromModel = (modelId: string): string => {
  if (modelId.startsWith('claude')) return 'anthropic';
  if (modelId.startsWith('gpt')) return 'openai';
  if (modelId.startsWith('gemini')) return 'google';
  return 'unknown';
};

// Main API client class
export default class ApiClient {
  private apiUrl: string;
  private apiKeys: Record<string, string>;
  
  constructor(apiKeys: Record<string, string>) {
    this.apiUrl = '/api';
    this.apiKeys = apiKeys;
  }
  
  // Translate text using selected model
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...request,
          apiKeys: this.apiKeys
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Translation request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
  
  // Convert translated HTML to DOCX
  async convertToDocx(html: string, filename: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiUrl}/docx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html, filename })
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert document');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('DOCX conversion error:', error);
      throw error;
    }
  }
  
  // Save translation to history
  async saveTranslation(data: any): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/save-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  }
  
  // Calculate estimated cost for a translation
  calculateCost(
    model: string, 
    inputTokens: number, 
    outputTokens: number,
    postEditModel?: string,
    postEditInputTokens?: number,
    postEditOutputTokens?: number
  ): number {
    let totalCost = 0;
    const provider = getProviderFromModel(model);
    
    // Format model ID to match pricing keys
    const formattedModel = this.formatModelForPricing(model);
    
    // Calculate main translation cost
    if (provider === 'anthropic' && PRICING.claude[formattedModel]) {
      const pricing = PRICING.claude[formattedModel];
      totalCost += (inputTokens / 1000) * pricing.input;
      totalCost += (outputTokens / 1000) * pricing.output;
    } else if (provider === 'openai' && PRICING.openai[formattedModel]) {
      const pricing = PRICING.openai[formattedModel];
      totalCost += (inputTokens / 1000) * pricing.input;
      totalCost += (outputTokens / 1000) * pricing.output;
    } else if (provider === 'google' && PRICING.gemini[formattedModel]) {
      const pricing = PRICING.gemini[formattedModel];
      totalCost += (inputTokens / 1000) * pricing.input;
      totalCost += (outputTokens / 1000) * pricing.output;
    }
    
    // Add post-editing cost if applicable
    if (postEditModel && postEditInputTokens && postEditOutputTokens) {
      const postEditProvider = getProviderFromModel(postEditModel);
      const formattedPostEditModel = this.formatModelForPricing(postEditModel);
      
      if (postEditProvider === 'anthropic' && PRICING.claude[formattedPostEditModel]) {
        const pricing = PRICING.claude[formattedPostEditModel];
        totalCost += (postEditInputTokens / 1000) * pricing.input;
        totalCost += (postEditOutputTokens / 1000) * pricing.output;
      } else if (postEditProvider === 'openai' && PRICING.openai[formattedPostEditModel]) {
        const pricing = PRICING.openai[formattedPostEditModel];
        totalCost += (postEditInputTokens / 1000) * pricing.input;
        totalCost += (postEditOutputTokens / 1000) * pricing.output;
      } else if (postEditProvider === 'google' && PRICING.gemini[formattedPostEditModel]) {
        const pricing = PRICING.gemini[formattedPostEditModel];
        totalCost += (postEditInputTokens / 1000) * pricing.input;
        totalCost += (postEditOutputTokens / 1000) * pricing.output;
      }
    }
    
    return parseFloat(totalCost.toFixed(4));
  }
  
  // Helper function to format model names for pricing lookup
  private formatModelForPricing(model: string): string {
    // Handle Gemini latest model versions
    if (model.includes('latest')) {
      return model.replace('-latest', '');
    }
    return model;
  }
}