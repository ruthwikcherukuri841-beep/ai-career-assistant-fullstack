import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/Layout/AppLayout';
import { Sparkles, FileText, Briefcase, Target, Code2, MapPin, ArrowRight, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    chatAPI.getHistory()
      .then(res => setRecentChats((res.data || []).slice(0, 4)))
      .catch(err => console.warn('Could not load history for dashboard:', err));
  }, []);

  return (
    <AppLayout>
      {({ resumeText, jobDescriptionText, onOpenResume, onOpenJD }) => (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-6 sm:p-10 text-white shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next-Gen Career Optimization Engine</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Hello, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Engineer'} 👋
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                Ready to accelerate your tech career? Upload your resume and job description to get instant ATS scores, interview questions, and customized learning roadmaps.
              </p>
              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-lg transition-all"
                >
                  <span>Launch AI Career Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Context Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Resume Context Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-md flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl ${resumeText ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">Resume Context</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resumeText ? `${resumeText.length} characters loaded` : 'No resume uploaded yet'}
                    </p>
                  </div>
                </div>
                {resumeText ? (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Missing</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {resumeText
                  ? `"${resumeText.substring(0, 140)}..."`
                  : 'Upload your resume in PDF, DOCX, or TXT format so Gemini can tailor bullet points and calculate ATS fit.'}
              </p>

              <button
                onClick={onOpenResume}
                className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                {resumeText ? 'Manage / Update Resume' : '+ Upload Resume Document'}
              </button>
            </div>

            {/* Job Description Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-md flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl ${jobDescriptionText ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">Target Job Description</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {jobDescriptionText ? `${jobDescriptionText.length} characters loaded` : 'No job description attached'}
                    </p>
                  </div>
                </div>
                {jobDescriptionText ? (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs font-semibold">
                    <span>Optional</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {jobDescriptionText
                  ? `"${jobDescriptionText.substring(0, 140)}..."`
                  : 'Paste a target job posting to uncover skill gaps, generate interview questions, and tailor responses.'}
              </p>

              <button
                onClick={onOpenJD}
                className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                {jobDescriptionText ? 'Edit Target Job Posting' : '+ Add Job Description'}
              </button>
            </div>
          </div>

          {/* Core Feature Quick Action Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Targeted AI Capabilities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => navigate('/chat')}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">ATS Score Optimization</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Calculate keyword match percentage and resolve parsing bottlenecks.
                </p>
              </div>

              <div
                onClick={() => navigate('/chat')}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Technical Interview Practice</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Practice coding, system design, and algorithmic problem discussions.
                </p>
              </div>

              <div
                onClick={() => navigate('/chat')}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-600 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Custom Learning Roadmaps</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Generate structured week-by-week roadmaps to acquire missing tech skills.
                </p>
              </div>

              <div
                onClick={() => navigate('/chat')}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer space-y-3 group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-600 text-white w-fit shadow-md group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Resume Bullet Rewriter</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Transform bland bullet points into impact metrics using Google XYZ format.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Conversations */}
          {recentChats.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Conversations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                        {chat.title || 'Career Chat'}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};
