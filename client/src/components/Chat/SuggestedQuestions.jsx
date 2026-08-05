import React from 'react';
import { Sparkles, Target, FileSearch, Code2, Map, HelpCircle, Layers } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: Target,
    title: "ATS Optimization",
    prompt: "Compare my resume with the job description. Give me an estimated ATS match percentage and list missing keywords.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: FileSearch,
    title: "Resume Bullet Rewrite",
    prompt: "Rewrite 3 of my main resume bullet points using strong action verbs and quantified impact metrics.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Code2,
    title: "Technical Interview",
    prompt: "Generate 5 challenging technical interview questions based on my target job description with ideal answer outlines.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    icon: Map,
    title: "Learning Roadmap",
    prompt: "Create a structured 4-week step-by-step learning roadmap to bridge my current skill gaps for a Senior Fullstack Engineer role.",
    color: "from-orange-500 to-amber-600"
  },
  {
    icon: HelpCircle,
    title: "HR & Behavioral Prep",
    prompt: "What are top behavioral questions using STAR technique for this position, and how should I structure my responses?",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: Layers,
    title: "Project Ideas",
    prompt: "Suggest 3 impressive portfolio projects that will highlight my skills to recruiters for this target job.",
    color: "from-indigo-500 to-purple-600"
  }
];

export const SuggestedQuestions = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center my-auto p-6 max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
      {/* Header Icon */}
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-500/10">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          How can I help your career today?
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Select a prompt below or upload your resume & job description to get instant tailored guidance.
        </p>
      </div>

      {/* Grid of suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full pt-4">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.prompt)}
              className="group p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 hover:border-indigo-500 dark:hover:border-indigo-500/80 hover:shadow-lg transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                "{item.prompt}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
