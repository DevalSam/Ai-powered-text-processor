import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LanguageSelector({ value, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 ${className}`}
    >
      <option value="">Select language</option>
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
