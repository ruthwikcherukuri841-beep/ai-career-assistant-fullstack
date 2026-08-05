import React from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Sun, Moon, Shield, Cpu, Bell } from 'lucide-react';

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <AppLayout>
      {() => (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings & Preferences</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Customize workspace theme and view system diagnostics.
              </p>
            </div>
          </div>

          {/* Theme Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">Appearance & Theme</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Interface Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between dark mode and crisp light mode.</p>
              </div>

              <div className="flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostics Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">System Diagnostics</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">AI Model Engine</span>
                <span className="font-semibold font-mono text-indigo-600 dark:text-indigo-400">Google Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Streaming Protocol</span>
                <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">Server-Sent Events (SSE)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Database Engine</span>
                <span className="font-semibold font-mono text-gray-900 dark:text-white">Supabase PostgreSQL + RLS</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Security Middleware</span>
                <span className="font-semibold font-mono text-gray-900 dark:text-white">Helmet + Express Rate Limit + JWT</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
