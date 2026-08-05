import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { chatAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Search, Trash2, ArrowRight, MessageSquare, Calendar, Tag, Eye, X, Loader2, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '../components/Chat/MarkdownRenderer';

export const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await chatAPI.getHistory();
      setSessions(res.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleInspectSession = async (session) => {
    setSelectedSession(session);
    setLoadingMessages(true);
    try {
      const res = await chatAPI.getSessionMessages(session.id);
      setSessionMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load session messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to permanently delete this conversation history?')) {
      setDeletingId(sessionId);
      try {
        await chatAPI.deleteSession(sessionId);
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setSessionMessages([]);
        }
      } catch (err) {
        console.error('Failed to delete session:', err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredSessions = sessions.filter(s =>
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      {() => (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conversation History & Logs</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Inspect detailed chat transcripts, delete unwanted logs, or resume past advice sessions.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Main Sessions List Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-indigo-500" />
              <span>Fetching conversation history...</span>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-200 dark:border-gray-700/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center mx-auto">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">No Conversations Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery ? `No sessions matching "${searchQuery}"` : 'You haven\'t started any career assistant chats yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleInspectSession(session)}
                  className="group relative p-5 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 dark:hover:border-indigo-500/80 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5 truncate pr-6">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform flex-shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {session.title || 'Career Chat'}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      disabled={deletingId === session.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Conversation Log"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Date & Metadata */}
                  <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(session.created_at || Date.now()).toLocaleDateString()}</span>
                    </span>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat/${session.id}`);
                      }}
                      className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-200 transition-all font-medium"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inspection Detail Modal */}
          {selectedSession && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-md">
                        {selectedSession.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">
                        Session ID: {selectedSession.id} • {new Date(selectedSession.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDeleteSession(e, selectedSession.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors flex items-center space-x-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mr-2 text-indigo-500" />
                      <span>Loading conversation transcript...</span>
                    </div>
                  ) : sessionMessages.length === 0 ? (
                    <div className="text-center py-12 text-xs text-gray-400">
                      No messages recorded in this conversation log.
                    </div>
                  ) : (
                    sessionMessages.map((msg, index) => (
                      <div key={msg.id || index} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                          <span className="uppercase font-mono text-[11px]">
                            {msg.role === 'user' ? '👤 User Prompt' : '🤖 AI Career Assistant'}
                          </span>
                          {msg.category && (
                            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px]">
                              <Tag className="w-3 h-3" />
                              <span>{msg.category}</span>
                            </span>
                          )}
                        </div>

                        <div className={`p-4 rounded-2xl border text-sm ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
                        }`}>
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          ) : (
                            <MarkdownRenderer content={msg.message} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Modal Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Close Log
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${selectedSession.id}`)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:opacity-90 transition-opacity"
                  >
                    <span>Open in Career Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};
