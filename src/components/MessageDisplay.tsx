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
    <div className="bg-white rounded p-2 text-xs shadow-sm space-y-1.5 border border-gray-100">
      {/* Original Message */}
      <p className="text-gray-800 break-words">{message.text}</p>
      
      {/* Language Tag */}
      {message.language && (
        <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
          {message.language}
        </span>
      )}

      {/* Actions Row */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {message.language === 'en' && 
         message.text.length > 150 && 
         !message.summary && (
          <button
            onClick={() => onSummarize(message.id)}
            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] hover:bg-blue-100"
          >
            Summarize
          </button>
        )}

        <select
          onChange={(e) => onTranslate(message.id, e.target.value)}
          value={message.selectedLanguage || ''}
          disabled={message.isProcessing}
          className="px-1.5 py-0.5 text-[10px] border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Translate...</option>
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Processing State */}
      {message.isProcessing && (
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Loader2 className="w-3 h-3 animate-spin" />
          Processing...
        </div>
      )}

      {/* Summary */}
      {message.summary && (
        <div className="mt-1.5 p-1.5 bg-blue-50 rounded-sm">
          <p className="text-[10px] font-medium text-blue-700 mb-0.5">Summary</p>
          <p className="text-gray-700 text-[11px]">{message.summary}</p>
        </div>
      )}

      {/* Translation */}
      {message.translation && (
        <div className="mt-1.5 p-1.5 bg-green-50 rounded-sm">
          <p className="text-[10px] font-medium text-green-700 mb-0.5">Translation</p>
          <p className="text-gray-700 text-[11px]">{message.translation}</p>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-right text-[9px] text-gray-400">
        {new Date(message.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
}