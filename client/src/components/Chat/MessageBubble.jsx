import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Bot, User, Copy, Check, Sparkles, Tag } from 'lucide-react';

export const MessageBubble = ({ message, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start space-x-3 my-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
            : 'bg-gradient-to-tr from-gray-900 via-indigo-900 to-purple-900 border border-indigo-500/30'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-indigo-400" />}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] group relative`}>
        {/* Category tag for AI messages */}
        {!isUser && message.category && (
          <div className="flex items-center space-x-1 mb-1.5 ml-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Tag className="w-3 h-3" />
            <span className="bg-indigo-100 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/50">
              {message.category}
            </span>
          </div>
        )}

        <div
          className={`rounded-2xl px-5 py-4 shadow-sm border transition-all ${
            isUser
              ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
              : 'bg-white dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700/80 rounded-tl-none'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed font-sans text-sm sm:text-base">{message.message}</p>
          ) : (
            <div className={isStreaming ? 'streaming-cursor' : ''}>
              <MarkdownRenderer content={message.message} />
            </div>
          )}

          {/* Bottom Actions Bar */}
          {!isUser && !isStreaming && (
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center space-x-1 text-[11px] text-gray-400">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Powered by Gemini 2.5</span>
              </span>
              <button
                onClick={handleCopyMessage}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Copy entire response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
