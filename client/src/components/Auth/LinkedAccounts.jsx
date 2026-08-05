import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const LinkedAccounts = () => {
  const { linkedProviders, linkProvider, unlinkProvider } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleToggleLink = async (providerName) => {
    setLoadingProvider(providerName);
    setFeedback(null);
    const isLinked = linkedProviders.includes(providerName);

    try {
      if (isLinked) {
        await unlinkProvider(providerName);
        setFeedback(`Unlinked ${providerName.toUpperCase()} account successfully.`);
      } else {
        await linkProvider(providerName);
        setFeedback(`Linked ${providerName.toUpperCase()} account successfully!`);
      }
    } catch (err) {
      console.error(`Failed to toggle ${providerName} link:`, err);
    } finally {
      setLoadingProvider(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const PROVIDERS = [
    {
      id: 'google',
      name: 'Google Account',
      description: 'Used for single sign-on and Gmail profile sync.',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )
    },
    {
      id: 'github',
      name: 'GitHub Account',
      description: 'Import repositories and authorize developer credentials.',
      icon: (
        <svg className="w-5 h-5 fill-current text-gray-900 dark:text-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    {
      id: 'openai',
      name: 'ChatGPT / OpenAI Account',
      description: 'Connect ChatGPT subscription for integrated prompts.',
      icon: (
        <svg className="w-5 h-5 fill-current text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.535-3.0137l.142.0852 4.783 2.7582a.7948.7948 0 0 0 .7854 0l5.833-3.3692v2.3326a.071.071 0 0 1-.0332.0569l-4.8398 2.7961a4.504 4.504 0 0 1-6.1354-1.6461zM2.3408 8.6456a4.466 4.466 0 0 1 2.3456-1.9729v.1658l0 5.5165a.7948.7948 0 0 0 .3928.6813l5.833 3.3693-2.02 1.1685a.071.071 0 0 1-.0664 0l-4.8398-2.7961A4.504 4.504 0 0 1 2.3408 8.6456zm16.0997 3.8558l-5.833-3.3693 2.02-1.1685a.071.071 0 0 1 .0664 0l4.8398 2.7961a4.504 4.504 0 0 1-.6727 8.1396v-.1658l0-5.5165a.7948.7948 0 0 0-.3928-.6813zm2.0107-3.0231l-.1419-.0852-4.783-2.7582a.7948.7948 0 0 0-.7854 0L9.0079 9.9984V7.6658a.071.071 0 0 1 .0332-.0569l4.8398-2.7961a4.504 4.504 0 0 1 6.6704 4.6598zm-8.4704-5.2655a4.4755 4.4755 0 0 1 2.8764 1.0408l-.1419.0804-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052V8.7042a4.504 4.504 0 0 1 4.4945-4.4944z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
        <Link2 className="w-5 h-5 text-indigo-500" />
        <h2 className="font-bold text-base text-gray-900 dark:text-white">Linked Social Accounts</h2>
      </div>

      {feedback && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="space-y-3">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviders.includes(provider.id);
          const isLoading = loadingProvider === provider.id;

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                  {provider.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{provider.name}</h3>
                    {isLinked ? (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Linked</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[11px]">
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{provider.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleLink(provider.id)}
                disabled={isLoading}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isLinked
                    ? 'border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isLinked ? 'Disconnect' : '+ Link Account'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
