import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Trash2, LayoutDashboard, Settings, User, Sparkles, History as HistoryIcon, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { chatAPI } from '../../services/api';

export const Sidebar = ({ isOpen, onClose, activeSessionId, onNewChat, onSelectSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await chatAPI.getHistory();
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [activeSessionId]);

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await chatAPI.deleteSession(sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          onNewChat();
        }
      } catch (err) {
        console.error('Failed to delete session:', err);
      }
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="px-3 py-3 space-y-1 border-b border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase">
          <Link
            to="/dashboard"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm capitalize transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/chat"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm capitalize transition-colors ${
              location.pathname.startsWith('/chat')
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Career Assistant</span>
          </Link>
          <Link
            to="/history"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm capitalize transition-colors ${
              location.pathname === '/history'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            <span>Chat Logs & History</span>
          </Link>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Previous Conversations
          </div>

          {loading && (
            <div className="text-center py-6 text-xs text-gray-400 animate-pulse">
              Loading chat history...
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="text-center py-6 text-xs text-gray-400">
              No previous chats found.
            </div>
          )}

          {sessions.map((s) => {
            const isActive = activeSessionId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  onSelectSession(s.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="truncate">{s.title || 'Untitled Session'}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, s.id)}
                  className={`p-1 rounded hover:bg-red-500/20 text-red-400 transition-opacity ${
                    isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <Link
            to="/profile"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/profile'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </Link>
          <Link
            to="/settings"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
