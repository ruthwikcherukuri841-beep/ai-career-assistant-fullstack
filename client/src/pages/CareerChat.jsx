import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/Layout/AppLayout';
import { MessageBubble } from '../components/Chat/MessageBubble';
import { ChatInput } from '../components/Chat/ChatInput';
import { SuggestedQuestions } from '../components/Chat/SuggestedQuestions';
import { TypingIndicator } from '../components/Chat/TypingIndicator';
import { chatAPI, fetchChatStream } from '../services/api';

export const CareerChat = () => {
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(paramSessionId || null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef(null);

  // Sync state with URL parameter
  useEffect(() => {
    if (paramSessionId) {
      setSessionId(paramSessionId);
      loadSessionMessages(paramSessionId);
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [paramSessionId]);

  const loadSessionMessages = async (id) => {
    setLoadingHistory(true);
    try {
      const res = await chatAPI.getSessionMessages(id);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to load session messages:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isStreaming]);

  const handleSendMessage = async (userPromptText, contextData) => {
    const userMsgObj = {
      id: 'usr-' + Date.now(),
      role: 'user',
      message: userPromptText
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setIsStreaming(true);
    setStreamingText('');

    let accumulatedAIResponse = '';

    await fetchChatStream(
      {
        message: userPromptText,
        sessionId: sessionId,
        resume: contextData.resumeText,
        jobDescription: contextData.jobDescriptionText,
        history: messages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', message: m.message }))
      },
      (chunkText) => {
        accumulatedAIResponse += chunkText;
        setStreamingText((prev) => prev + chunkText);
      },
      (doneData) => {
        setIsStreaming(false);

        const newSessionId = doneData.sessionId;
        if (newSessionId && newSessionId !== sessionId) {
          setSessionId(newSessionId);
          navigate(`/chat/${newSessionId}`, { replace: true });
        }

        // Clean category tag from message
        const cleanText = accumulatedAIResponse.replace(/__CATEGORY__:\s*\{[^}]+\}/, '').trim();

        const assistantMsgObj = {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          message: cleanText,
          category: doneData.category || 'General Career Chat'
        };

        setMessages((prev) => [...prev, assistantMsgObj]);
        setStreamingText('');
      },
      (err) => {
        setIsStreaming(false);
        setStreamingText('');
        const errorMsgObj = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          message: `⚠️ **Error**: ${err.message || 'Failed to reach AI streaming server.'}`
        };
        setMessages((prev) => [...prev, errorMsgObj]);
      }
    );
  };

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setStreamingText('');
    navigate('/chat');
  };

  return (
    <AppLayout
      activeSessionId={sessionId}
      onNewChat={handleNewChat}
      onSelectSession={(id) => navigate(`/chat/${id}`)}
    >
      {(contextData) => (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-dark-bg">
          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Loading session messages...
              </div>
            ) : messages.length === 0 && !isStreaming ? (
              <SuggestedQuestions
                onSelectPrompt={(promptText) => handleSendMessage(promptText, contextData)}
              />
            ) : (
              <div className="max-w-4xl mx-auto space-y-4 pb-4">
                {messages.map((msg, index) => (
                  <MessageBubble key={msg.id || index} message={msg} />
                ))}

                {/* Live SSE Streaming Bubble */}
                {isStreaming && (
                  <>
                    {streamingText ? (
                      <MessageBubble
                        message={{
                          role: 'assistant',
                          message: streamingText
                        }}
                        isStreaming={true}
                      />
                    ) : (
                      <TypingIndicator />
                    )}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input Container */}
          <div className="max-w-4xl w-full mx-auto">
            <ChatInput
              onSendMessage={(txt) => handleSendMessage(txt, contextData)}
              disabled={isStreaming}
              resumeAttached={!!contextData.resumeText}
              jdAttached={!!contextData.jobDescriptionText}
              onOpenResume={contextData.onOpenResume}
              onOpenJD={contextData.onOpenJD}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
};
