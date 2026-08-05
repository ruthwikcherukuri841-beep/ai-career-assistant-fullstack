import React from 'react';
import { Sparkles, FileText, Briefcase, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../Shared/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar, resumeAttached, jdAttached, onOpenResume, onOpenJD }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile sidebar toggle & Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white tracking-tight">
            Career<span className="text-indigo-600 dark:text-indigo-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Middle: Active Context Badges */}
      <div className="hidden md:flex items-center space-x-3">
        <button
          onClick={onOpenResume}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            resumeAttached
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{resumeAttached ? 'Resume Active' : '+ Attach Resume'}</span>
        </button>

        <button
          onClick={onOpenJD}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            jdAttached
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{jdAttached ? 'JD Active' : '+ Attach Job Description'}</span>
        </button>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-800 pl-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {(user.email || 'U').substring(0, 2).toUpperCase()}
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-gray-700 dark:text-gray-300">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
