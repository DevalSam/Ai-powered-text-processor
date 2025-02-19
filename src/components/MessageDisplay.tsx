import React from 'react';
import { Message } from '@/types/index';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { Loader2 } from 'lucide-react';

interface MessageDisplayProps {
  message: Message;
  onSummarize: (messageId: string) => void;
  onTranslate: (messageId: string, targetLang: string) => void;
}

export function MessageDisplay({ message, onSummarize, onTranslate }: MessageDisplayProps) {
  return (
    <div className="bg-white rounded-lg p-3 text-sm shadow-sm space-y-2 border border-gray-200">
      {/* Original Message */}
      <p className="text-gray-800 break-words">{message.text}</p>

      {/* Language Tag */}
      {message.language && (
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          {message.language}
        </span>
      )}

      {/* Actions Row */}
      <div className="flex flex-wrap gap-2 mt-2">
        {message.language === 'en' && message.text.length > 150 && !message.summary && (
          <button
            onClick={() => onSummarize(message.id)}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors"
          >
            Summarize
          </button>
        )}

        <select
          onChange={(e) => onTranslate(message.id, e.target.value)}
          value={message.selectedLanguage || ''}
          disabled={message.isProcessing}
          className="px-2 py-1 text-xs border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="">Translate...</option>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Processing State */}
      {message.isProcessing && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </div>
      )}

      {/* Summary */}
      {message.summary && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs font-medium text-blue-700 mb-1">Summary</p>
          <p className="text-gray-700 text-sm">{message.summary}</p>
        </div>
      )}

      {/* Translation */}
      {message.translation && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg">
          <p className="text-xs font-medium text-green-700 mb-1">Translation</p>
          <p className="text-gray-700 text-sm">{message.translation}</p>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-right text-xs text-gray-500">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}