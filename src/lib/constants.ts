// Model definitions with their details
export const MODELS = {
  // Claude models
  CLAUDE: [
    { 
      id: "claude-3-5-sonnet", 
      name: "Claude 3.5 Sonnet", 
      provider: "anthropic",
      tier: "premium", 
      contextWindow: 200000 
    },
    { 
      id: "claude-3-opus", 
      name: "Claude 3 Opus", 
      provider: "anthropic",
      tier: "professional", 
      contextWindow: 180000 
    },
    { 
      id: "claude-3-sonnet", 
      name: "Claude 3 Sonnet", 
      provider: "anthropic",
      tier: "standard", 
      contextWindow: 180000 
    },
    { 
      id: "claude-3-haiku", 
      name: "Claude 3 Haiku", 
      provider: "anthropic",
      tier: "basic", 
      contextWindow: 180000 
    },
  ],

  // OpenAI models
  OPENAI: [
    { 
      id: "gpt-4-turbo", 
      name: "GPT-4 Turbo", 
      provider: "openai",
      tier: "premium", 
      contextWindow: 128000 
    },
    { 
      id: "gpt-4", 
      name: "GPT-4", 
      provider: "openai",
      tier: "professional", 
      contextWindow: 8192 
    },
    { 
      id: "gpt-3.5-turbo", 
      name: "GPT-3.5 Turbo", 
      provider: "openai",
      tier: "standard", 
      contextWindow: 16385 
    },
  ],

  // Gemini models
  GEMINI: [
    { 
      id: "gemini-2.0-pro", 
      name: "Gemini 2.0 Pro", 
      provider: "google",
      tier: "premium+", 
      contextWindow: 10240
    },
    { 
      id: "gemini-2.0-flash", 
      name: "Gemini 2.0 Flash", 
      provider: "google",
      tier: "premium", 
      contextWindow: 10240
    },
    { 
      id: "gemini-2.0-flash-lite", 
      name: "Gemini 2.0 Flash Lite", 
      provider: "google",
      tier: "fast", 
      contextWindow: 10240
    },
    { 
      id: "gemini-1.5-pro-latest", 
      name: "Gemini 1.5 Pro (Latest)", 
      provider: "google",
      tier: "advanced", 
      contextWindow: 8192
    },
    { 
      id: "gemini-1.5-flash-latest", 
      name: "Gemini 1.5 Flash (Latest)", 
      provider: "google",
      tier: "standard", 
      contextWindow: 8192
    },
    { 
      id: "gemini-1.5-pro-001", 
      name: "Gemini 1.5 Pro", 
      provider: "google",
      tier: "advanced", 
      contextWindow: 8192
    },
    { 
      id: "gemini-1.5-flash-001", 
      name: "Gemini 1.5 Flash", 
      provider: "google",
      tier: "standard", 
      contextWindow: 8192
    },
  ],
};

// Translation domains for specialized prompts
export const TRANSLATION_DOMAINS = [
  { id: "general", name: "General" },
  { id: "legal", name: "Legal" },
  { id: "medical", name: "Medical" },
  { id: "technical", name: "Technical" },
  { id: "marketing", name: "Marketing" },
  { id: "academic", name: "Academic" },
  { id: "financial", name: "Financial" },
];

// Language pairs supported by the application
export const LANGUAGE_PAIRS = [
  { id: "en-fr", name: "English → French" },
  { id: "en-fr-ca", name: "English → French Canadian" },
  { id: "en-es", name: "English → Spanish" },
  { id: "en-de", name: "English → German" },
  { id: "en-it", name: "English → Italian" },
  { id: "en-pt", name: "English → Portuguese" },
  { id: "en-ja", name: "English → Japanese" },
  { id: "en-zh", name: "English → Chinese" },
  { id: "fr-en", name: "French → English" },
  { id: "es-en", name: "Spanish → English" },
  { id: "de-en", name: "German → English" },
  { id: "it-en", name: "Italian → English" },
  { id: "pt-en", name: "Portuguese → English" },
  { id: "ja-en", name: "Japanese → English" },
  { id: "zh-en", name: "Chinese → English" },
];

// File types supported for upload
export const SUPPORTED_FILE_TYPES = {
  "text/plain": { type: "TXT", processor: "processTXT" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { 
    type: "DOCX", 
    processor: "processDOCX" 
  },
  "application/pdf": { type: "PDF", processor: "processPDF" },
};

// Default system configuration
export const DEFAULT_CONFIG = {
  defaultModel: "claude-3-sonnet",
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  defaultLanguagePair: "en-fr",
  defaultDomain: "general",
  usePostEditingDefault: true,
};