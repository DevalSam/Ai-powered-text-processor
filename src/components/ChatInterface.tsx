'use client';

import { useState } from 'react';
import { Send, AlertCircle, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { MessageDisplay } from '@/components/MessageDisplay';
import { detectLanguage, translateText, summarizeText } from '@/utils/chrome-api';
import type { Message } from '@/types';


interface APIStatus {
  isChrome: boolean;
  hasLanguageDetection: boolean;
  hasTranslate: boolean;
  hasSummarizer: boolean;
}

export default function ChatInterface() 
{
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAPIsAvailable, setIsAPIsAvailable] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    isChrome: false,
    hasLanguageDetection: false,
    hasTranslate: false,
    hasSummarizer: false,
  });

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    if (!isAPIsAvailable) {
      setError('Chrome AI APIs not available');
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setIsProcessing(true);
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setError(null);

    try {
      const langResult = await detectLanguage(newMessage.text);
      const detectedLanguage = langResult.languages[0]?.language;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, language: detectedLanguage } : msg
        )
      );
    } catch (_err) {
      setError('Language detection failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isProcessing: true } : msg
      )
    );

    try {
      const result = await summarizeText(message.text);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, summary: result.summary, isProcessing: false }
            : msg
        )
      );
    } catch (_err) {
      setError('Failed to summarize text');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isProcessing: false } : msg
        )
      );
    }
  };

  const handleTranslate = async (messageId: string, targetLang: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.selectedLanguage === targetLang) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isProcessing: true } : msg
      )
    );

    try {
      const result = await translateText(message.text, targetLang);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                translation: result.translation,
                selectedLanguage: targetLang,
                isProcessing: false,
              }
            : msg
        )
      );
    } catch (_err) {
      setError('Failed to translate text');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isProcessing: false } : msg
        )
      );
    }
  };

  const getAPIStatusMessage = () => {
    if (!apiStatus.isChrome) {
      return 'Please use Google Chrome browser';
    }

    const missingApis: string[] = [];
    if (!apiStatus.hasLanguageDetection) missingApis.push('Language Detection');
    if (!apiStatus.hasTranslate) missingApis.push('Translation');
    if (!apiStatus.hasSummarizer) missingApis.push('Summarization');

    if (missingApis.length > 0) {
      return (
        <div className="space-y-2">
          <p>Missing Chrome AI APIs: {missingApis.join(', ')}</p>
          <p className="text-xs">Please follow these steps:</p>
          <ol className="text-xs list-decimal list-inside space-y-1">
            <li>
              Open Chrome Settings or type{' '}
              <span className="font-mono bg-gray-100 px-1">chrome://flags</span>{' '}
              in your address bar
            </li>
            <li>Search for &apos;Experimental Web Platform features&apos;</li>
            <li>Enable the flag</li>
            <li>Click &apos;Relaunch&apos; at the bottom of the screen</li>
            <li>
              If error persists, you may need to update Chrome to the latest
              version
            </li>
          </ol>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message display area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageDisplay
            key={message.id}
            message={message}
            onSummarize={handleSummarize}
            onTranslate={handleTranslate}
          />
        ))}
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="pr-10"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className="absolute right-2 top-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Send />}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-500 flex items-center">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        )}
        {getAPIStatusMessage()}
      </div>
    </div>
  );
}