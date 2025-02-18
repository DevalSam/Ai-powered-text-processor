'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Loader2, Minimize2, Maximize2, Info } from 'lucide-react';
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

interface HandleKeyPressEvent extends React.KeyboardEvent<HTMLTextAreaElement> {
  currentTarget: HTMLTextAreaElement;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAPIsAvailable, setIsAPIsAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    isChrome: false,
    hasLanguageDetection: false,
    hasTranslate: false,
    hasSummarizer: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkBrowser = () => {
      const isChrome = !!(
        typeof window !== 'undefined' && 
        window.chrome && 
        window.navigator.vendor.includes('Google Inc.')
      );
      
      const hasLanguageDetection = !!(window.chrome?.languageDetection);
      const hasTranslate = !!(window.chrome?.translate);
      const hasSummarizer = !!(window.chrome?.summarizer);

      setApiStatus({
        isChrome,
        hasLanguageDetection,
        hasTranslate,
        hasSummarizer
      });

      setIsAPIsAvailable(hasLanguageDetection && hasTranslate && hasSummarizer);
    };

    if (mounted) {
      checkBrowser();
    }
  }, [mounted]);

  useEffect(() => {
    if (messages.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyPress = (e: HandleKeyPressEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    if (!isAPIsAvailable) {
      setError('Chrome AI APIs not available');
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setIsProcessing(true);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setError(null);

    try {
      const langResult = await detectLanguage(newMessage.text);
      const detectedLanguage = langResult.languages[0]?.language;

      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, language: detectedLanguage }
          : msg
      ));
    } catch {
      setError('Language detection failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isProcessing: true }
        : msg
    ));

    try {
      const result = await summarizeText(message.text);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, summary: result.summary, isProcessing: false }
          : msg
      ));
    } catch {
      setError('Failed to summarize text');
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isProcessing: false }
          : msg
      ));
    }
  };

  const handleTranslate = async (messageId: string, targetLang: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || message.selectedLanguage === targetLang) return;

    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isProcessing: true }
        : msg
    ));

    try {
      const result = await translateText(message.text, targetLang);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              translation: result.translation, 
              selectedLanguage: targetLang,
              isProcessing: false 
            }
          : msg
      ));
    } catch {
      setError('Failed to translate text');
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isProcessing: false }
          : msg
      ));
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
            <li>Open Chrome Settings or type <span className="font-mono bg-gray-100 px-1">chrome://flags</span> in your address bar</li>
            <li>Search for &apos;Experimental Web Platform features&apos;</li>
            <li>Enable the flag</li>
            <li>Click &apos;Relaunch&apos; at the bottom of the screen</li>
            <li>If error persists, you may need to update Chrome to the latest version</li>
          </ol>
        </div>
      );
    }

    return null;
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 w-72 ${
        isMinimized ? 'h-12' : 'h-[450px]'
      }`}>
        {/* Header */}
        <div className="bg-blue-500 text-white px-3 py-2 flex items-center justify-between">
          <h1 className="text-sm font-medium">Text Processor</h1>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-600 rounded"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {!isMinimized && (
          <>
            {!isAPIsAvailable ? (
              <div className="p-4 space-y-2">
                <div className="flex items-start gap-2 text-amber-600">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {getAPIStatusMessage()}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 h-[350px] bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
                      <p>Type a message to begin</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <MessageDisplay
                        key={message.id}
                        message={message}
                        onSummarize={handleSummarize}
                        onTranslate={handleTranslate}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="px-4 py-2 bg-red-100 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex gap-2">
                    <Textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 resize-none text-sm min-h-[60px] max-h-[120px]"
                      placeholder="Type your message... (Press Enter to send)"
                      rows={2}
                      disabled={isProcessing}
                    />
                    <button
                      onClick={() => void handleSend()}
                      disabled={!inputText.trim() || isProcessing}
                      className="px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Send message"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}