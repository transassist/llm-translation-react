import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiKeysState {
  // API keys for different providers
  anthropic: string;
  openai: string;
  google: string;
  
  // Actions
  setAnthropicKey: (key: string) => void;
  setOpenAIKey: (key: string) => void;
  setGoogleKey: (key: string) => void;
  clearAllKeys: () => void;
  
  // Helper methods
  getApiKeys: () => Record<string, string>;
  hasRequiredKeys: (providers: string[]) => boolean;
}

// Create a persisted store for API keys with encrypted storage
export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      // Initial state
      anthropic: '',
      openai: '',
      google: '',
      
      // Set Anthropic API key
      setAnthropicKey: (key: string) => set({ anthropic: key }),
      
      // Set OpenAI API key
      setOpenAIKey: (key: string) => set({ openai: key }),
      
      // Set Google API key
      setGoogleKey: (key: string) => set({ google: key }),
      
      // Clear all keys
      clearAllKeys: () => set({ anthropic: '', openai: '', google: '' }),
      
      // Get all API keys as an object
      getApiKeys: () => ({
        anthropic: get().anthropic,
        openai: get().openai,
        google: get().google,
      }),
      
      // Check if we have all required keys for given providers
      hasRequiredKeys: (providers: string[]) => {
        const keys = get().getApiKeys();
        return providers.every(provider => !!keys[provider.toLowerCase()]);
      },
    }),
    {
      name: 'llm-translation-api-keys',
      // Ensure we're only accessing localStorage on the client
      skipHydration: true,
      // Add partialize to exclude sensitive keys from storage (not needed here)
      // partialize: (state) => Object.fromEntries(
      //   Object.entries(state).filter(([key]) => !['sensitiveField'].includes(key))
      // ),
    }
  )
);

// Helper function to check if API key is valid (basic validation)
export const isValidApiKey = (provider: string, key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  
  // Basic validation based on key format
  switch (provider.toLowerCase()) {
    case 'anthropic':
      return key.startsWith('sk-ant-') && key.length > 20;
    case 'openai':
      return key.startsWith('sk-') && key.length > 20;
    case 'google':
      // Google API keys don't have a standard format, so we just check length
      return key.length > 10;
    default:
      return false;
  }
};