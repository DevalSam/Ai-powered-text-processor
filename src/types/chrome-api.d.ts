declare global {
  interface Window {
    chrome?: {
      languageDetection?: {
        detectLanguage(text: string): Promise<{
          languages: Array<{ language: string }>;
        }>;
      };
      translate?: {
        translateText(options: { text: string; target: string }): Promise<{
          translation: string;
        }>;
      };
      summarizer?: {
        summarize(text: string): Promise<{
          summary: string;
        }>;
      };
    };
  }
}

export {};