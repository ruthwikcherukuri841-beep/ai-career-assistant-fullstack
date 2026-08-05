import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/Layout/AppLayout';
import { User, Mail, Shield, FileText, Briefcase, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { LinkedAccounts } from '../components/Auth/LinkedAccounts';

export const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      {({ resumeText, jobDescriptionText, onOpenResume, onOpenJD }) => (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {(user?.email || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account & Career Profile</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Manage your credentials and active AI context parameters.
              </p>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4">
              <User className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">Personal Information</h2>
            </div>

            {saved && (
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Linked Social Accounts Manager */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-sm">
            <LinkedAccounts />
          </div>

          {/* Context Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="font-bold text-base text-gray-900 dark:text-white">Active Gemini Context State</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Resume Text</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {resumeText ? `${resumeText.length} characters stored` : 'No resume uploaded yet.'}
                </p>
                <button
                  onClick={onOpenResume}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                >
                  {resumeText ? 'Manage Resume' : '+ Upload Resume'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-3">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  <Briefcase className="w-4 h-4" />
                  <span>Job Description</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {jobDescriptionText ? `${jobDescriptionText.length} characters stored` : 'No target job description set.'}
                </p>
                <button
                  onClick={onOpenJD}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
                >
                  {jobDescriptionText ? 'Manage Job Posting' : '+ Add Job Posting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
