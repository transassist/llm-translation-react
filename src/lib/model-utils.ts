// Utility functions for working with AI models
import { MODELS } from './constants';

// Get all available models across providers
export const getAllModels = () => {
  return [
    ...MODELS.CLAUDE,
    ...MODELS.OPENAI,
    ...MODELS.GEMINI
  ];
};

// Get models from a specific provider
export const getModelsByProvider = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'anthropic':
    case 'claude':
      return MODELS.CLAUDE;
    case 'openai':
    case 'gpt':
      return MODELS.OPENAI;
    case 'google':
    case 'gemini':
      return MODELS.GEMINI;
    default:
      return [];
  }
};

// Get a model by its ID
export const getModelById = (modelId: string) => {
  return getAllModels().find(model => model.id === modelId);
};

// Format model name for API calls
export const formatModelName = (modelId: string, provider: string): string => {
  if (provider === 'anthropic') {
    // Claude models are used as-is
    return modelId;
  } else if (provider === 'openai') {
    // OpenAI models are used as-is
    return modelId;
  } else if (provider === 'google') {
    // Handle Gemini model naming conventions
    if (modelId.includes('latest')) {
      // For latest models, we use the format without the -latest suffix
      return modelId.replace('-latest', '');
    } else if (modelId.includes('-2.0-')) {
      // For Gemini 2.0 models, ensure we're using the correct format
      const baseName = modelId.replace('gemini-', '');
      return baseName;
    } else {
      // For regular Gemini models with version numbers, use as-is
      return modelId;
    }
  }
  
  // Default fallback, just use the model ID as provided
  return modelId;
};

// Estimate tokens in a text string
export const estimateTokenCount = (text: string): number => {
  // Rough estimation based on the rule of thumb that 1 token ≈ 4 characters in English
  // This is a simple approximation and not accurate for all languages
  return Math.ceil(text.length / 4);
};

// Get appropriate system prompt for a translation task
export const getSystemPrompt = (
  domain: string,
  sourceLang: string,
  targetLang: string,
  isPostEditing: boolean = false
): string => {
  if (isPostEditing) {
    return `You are a professional translator specializing in ${domain} content. 
    You are tasked with reviewing and improving a machine translation from ${sourceLang} to ${targetLang}.
    Focus on improving fluency, accuracy, and stylistic appropriateness for ${domain} content.
    Correct any translation errors, improve natural language flow, and ensure terminology consistency.
    Do not add new information or significantly alter the meaning.
    Only output the improved translation with no explanations or comments.`;
  }
  
  return `You are a professional translator specializing in ${domain} content.
  Translate the following text from ${sourceLang} to ${targetLang}.
  Maintain the original formatting including paragraphs, bullet points, and line breaks.
  Ensure terminology is appropriate for ${domain} content.
  Only output the translation with no explanations or notes.`;
};

// Format glossary terms for inclusion in a prompt
export const formatGlossaryForPrompt = (glossary: Record<string, string>): string => {
  if (!glossary || Object.keys(glossary).length === 0) {
    return '';
  }
  
  let formattedGlossary = 'Use these specific translations for key terms:\n';
  
  Object.entries(glossary).forEach(([term, translation]) => {
    formattedGlossary += `- "${term}" → "${translation}"\n`;
  });
  
  return formattedGlossary;
};

// Check if a model supports post-editing features
export const supportsPostEditing = (modelId: string): boolean => {
  // All models in the system support post-editing, but could be extended
  // if certain models had limitations in the future
  return true;
};