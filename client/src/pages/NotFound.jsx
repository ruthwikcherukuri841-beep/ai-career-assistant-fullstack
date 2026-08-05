import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-2xl">
        <Sparkles className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          The requested career assistant page does not exist or has been moved.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
