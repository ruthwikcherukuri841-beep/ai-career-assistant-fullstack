import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlockRenderer } from './CodeBlockRenderer';

export const MarkdownRenderer = ({ content }) => {
  // Strip category tag if visible
  const cleanContent = (content || '').replace(/__CATEGORY__:\s*\{[^}]+\}/, '').trim();

  return (
    <div className="prose dark:prose-invert max-w-none prose-indigo prose-sm sm:prose-base space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && (match || value.includes('\n'))) {
              return <CodeBlockRenderer language={match ? match[1] : 'text'} value={value} />;
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 font-mono text-sm font-semibold" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-2.5 whitespace-normal border-t border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-300">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 px-4 py-2 my-3 rounded-r-lg text-gray-700 dark:text-gray-300 italic">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-4 mb-2 tracking-tight">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-indigo-200 mt-3 mb-2 tracking-tight border-b border-gray-200 dark:border-gray-800 pb-1">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-indigo-300 mt-3 mb-1.5">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1.5 my-2 text-gray-800 dark:text-gray-200">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1.5 my-2 text-gray-800 dark:text-gray-200">{olCount => children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                {children}
              </a>
            );
          }
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
