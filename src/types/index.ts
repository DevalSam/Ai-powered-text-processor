export interface Message {
  id: string;
  text: string;
  timestamp: string;
  language?: string;
  summary?: string;
  translation?: string;
  selectedLanguage?: string;
  isProcessing?: boolean;
}

export interface ChromeAIAPIs {
  languageDetection?: {
    detectLanguage: (text: string) => Promise<{ languages: { language: string }[] }>;
  };
  translate?: {
    translateText: (options: { text: string; target: string }) => Promise<{ translation: string }>;
  };
  summarizer?: {
    summarize: (text: string) => Promise<{ summary: string }>;
  };
}