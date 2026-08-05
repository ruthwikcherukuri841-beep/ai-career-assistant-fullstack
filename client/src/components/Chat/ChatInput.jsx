import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, FileText, Briefcase, Sparkles } from 'lucide-react';

const chatInputSchema = z.object({
  message: z.string().min(2, 'Message must be at least 2 characters').max(4000, 'Maximum 4000 characters')
});

export const ChatInput = ({ onSendMessage, disabled, resumeAttached, jdAttached, onOpenResume, onOpenJD }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(chatInputSchema),
    defaultValues: { message: '' }
  });

  const messageValue = watch('message', '');

  const onSubmit = (data) => {
    if (disabled || !data.message.trim()) return;
    onSendMessage(data.message.trim());
    reset();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Active Context Badges */}
      <div className="flex items-center space-x-2 mb-2 px-1 text-xs">
        <button
          type="button"
          onClick={onOpenResume}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all ${
            resumeAttached
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{resumeAttached ? 'Resume Attached' : '+ Add Resume'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenJD}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all ${
            jdAttached
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-medium'
              : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-500'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{jdAttached ? 'Job Description Attached' : '+ Add Job Description'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="relative rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
          <textarea
            {...register('message')}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask about resume improvements, technical interview prep, ATS score..."
            rows={2}
            className="w-full px-4 pt-3 pb-10 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none text-sm sm:text-base leading-relaxed"
          />

          {/* Bottom Toolbar inside input */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] text-gray-400 font-mono">
              {messageValue.length}/4000
            </span>

            <button
              type="submit"
              disabled={disabled || !messageValue.trim()}
              className="pointer-events-auto flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {errors.message && (
          <p className="mt-1 text-xs text-red-500 px-1">{errors.message.message}</p>
        )}
      </form>
    </div>
  );
};
