import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ResumeModal } from '../Resume/ResumeModal';
import { JobDescriptionModal } from '../JobDescription/JobDescriptionModal';
import { resumeAPI, jobDescriptionAPI } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export const AppLayout = ({ children, activeSessionId, onNewChat, onSelectSession }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [jdModalOpen, setJdModalOpen] = useState(false);

  const [resumeText, setResumeText] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Load initial Resume and Job Description context
  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const [resResume, resJD] = await Promise.all([
          resumeAPI.get(),
          jobDescriptionAPI.get()
        ]);
        if (resResume.data?.resume_text) {
          setResumeText(resResume.data.resume_text);
          setResumeFileName(resResume.data.file_name || 'Resume.txt');
        }
        if (resJD.data?.description) {
          setJobDescription(resJD.data);
        }
      } catch (err) {
        console.warn('Could not fetch context details:', err);
      }
    };

    fetchContexts();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSessionId={activeSessionId}
        onNewChat={() => {
          onNewChat?.();
          if (!location.pathname.startsWith('/chat')) navigate('/chat');
        }}
        onSelectSession={(id) => {
          onSelectSession?.(id);
          navigate(`/chat/${id}`);
        }}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          resumeAttached={!!resumeText}
          jdAttached={!!jobDescription?.description}
          onOpenResume={() => setResumeModalOpen(true)}
          onOpenJD={() => setJdModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto min-w-0">
          {typeof children === 'function'
            ? children({
                resumeText,
                jobDescriptionText: jobDescription?.description,
                onOpenResume: () => setResumeModalOpen(true),
                onOpenJD: () => setJdModalOpen(true)
              })
            : children}
        </main>
      </div>

      {/* Context Modals */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        currentResume={resumeText}
        onResumeUpdated={(text, file) => {
          setResumeText(text);
          setResumeFileName(file);
        }}
      />

      <JobDescriptionModal
        isOpen={jdModalOpen}
        onClose={() => setJdModalOpen(false)}
        currentJD={jobDescription}
        onJDUpdated={(jdObj) => {
          setJobDescription(jdObj);
        }}
      />
    </div>
  );
};
