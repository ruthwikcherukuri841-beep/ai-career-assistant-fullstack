import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { resumeAPI } from '../../services/api';

export const ResumeModal = ({ isOpen, onClose, currentResume, onResumeUpdated }) => {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState(currentResume || '');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (activeTab === 'upload') {
        if (!file) throw new Error('Please select a PDF, DOCX, or TXT file.');
        const formData = new FormData();
        formData.append('resume', file);

        const res = await resumeAPI.upload(formData);
        setSuccessMsg(`Successfully parsed ${res.data.fileName} (${res.data.characterCount} chars)`);
        onResumeUpdated(res.data.resumeText, res.data.fileName);
      } else {
        if (!pastedText.trim() || pastedText.trim().length < 10) {
          throw new Error('Please enter at least 10 characters of your resume.');
        }

        const res = await resumeAPI.saveText(pastedText);
        setSuccessMsg('Resume text updated successfully!');
        onResumeUpdated(res.data.resumeText, 'Pasted_Resume.txt');
      }

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manage Resume Context</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI uses your resume text to tailor advice and score ATS match.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 px-6 pt-3 space-x-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Upload File (PDF / DOCX / TXT)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Paste Resume Text
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-gray-800/30 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center space-y-3 cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {file ? file.name : 'Click or Drag & Drop file here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, or TXT (Max 5MB)</p>
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your full resume content here..."
                rows={10}
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1 font-mono">
                {pastedText.length} characters
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUploadSubmit}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save & Attach Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
