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
    <div className="bg-white rounded-xl shadow-sm space-y-2 p-3 border border-sky-100">
      {/* Original Message */}
      <p className="text-gray-800 text-sm leading-relaxed break-words">{message.text}</p>

      {/* Language Tag */}
      {message.language && (
        <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full text-xs font-medium">
          {message.language}
        </span>
      )}

      {/* Actions Row */}
      <div className="flex flex-wrap gap-2 mt-2">
        {message.language === 'en' && message.text.length > 150 && !message.summary && (
          <button
            onClick={() => onSummarize(message.id)}
            className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium hover:bg-sky-200 transition-colors"
          >
            Summarize
          </button>
        )}

        <select
          onChange={(e) => onTranslate(message.id, e.target.value)}
          value={message.selectedLanguage || ''}
          disabled={message.isProcessing}
          className="px-3 py-1 text-xs border border-sky-200 rounded-full bg-white text-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="flex items-center gap-1.5 text-xs text-sky-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing...
        </div>
      )}

      {/* Summary */}
      {message.summary && (
        <div className="mt-2 p-2.5 bg-sky-50 rounded-lg border border-sky-100">
          <p className="text-xs font-medium text-sky-700 mb-1">Summary</p>
          <p className="text-gray-700 text-sm">{message.summary}</p>
        </div>
      )}

      {/* Translation */}
      {message.translation && (
        <div className="mt-2 p-2.5 bg-green-50 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-green-700 mb-1">Translation</p>
          <p className="text-gray-700 text-sm">{message.translation}</p>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-right text-[10px] text-sky-400">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}