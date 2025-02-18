export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fr', name: 'French' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
