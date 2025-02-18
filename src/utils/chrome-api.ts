export const checkChromeAPI = (): boolean => {
  if (typeof window === 'undefined') return false;

  const chrome = window.chrome;
  if (!chrome) {
    console.warn('Chrome object not found');
    return false;
  }

  const hasLanguageDetection = !!chrome.languageDetection;
  const hasTranslate = !!chrome.translate;
  const hasSummarizer = !!chrome.summarizer;

  console.log('Chrome AI APIs Status:', {
    languageDetection: hasLanguageDetection,
    translate: hasTranslate,
    summarizer: hasSummarizer
  });

  return hasLanguageDetection && hasTranslate && hasSummarizer;
};

export const detectLanguage = async (text: string) => {
  if (!window.chrome?.languageDetection) {
    throw new Error('Language detection API not available');
  }
  return window.chrome.languageDetection.detectLanguage(text);
};

export const translateText = async (text: string, targetLang: string) => {
  if (!window.chrome?.translate) {
    throw new Error('Translation API not available');
  }
  return window.chrome.translate.translateText({ text, target: targetLang });
};

export const summarizeText = async (text: string) => {
  if (!window.chrome?.summarizer) {
    throw new Error('Summarizer API not available');
  }
  return window.chrome.summarizer.summarize(text);
};