import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-start space-x-3 my-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
        <Bot className="w-4 h-4 animate-pulse" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Gemini is thinking</span>
        <div className="flex space-x-1 items-center ml-1">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
