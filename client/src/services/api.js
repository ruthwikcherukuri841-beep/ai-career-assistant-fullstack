import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth token
api.interceptors.request.use((config) => {
  const mockUser = localStorage.getItem('ai_career_mock_user');
  if (mockUser) {
    const parsed = JSON.parse(mockUser);
    config.headers.Authorization = `Bearer demo-token-${parsed.id}`;
  } else {
    const supabaseToken = localStorage.getItem('sb-placeholder-project-auth-token');
    if (supabaseToken) {
      try {
        const tokenObj = JSON.parse(supabaseToken);
        config.headers.Authorization = `Bearer ${tokenObj.access_token}`;
      } catch (e) {
        config.headers.Authorization = `Bearer guest-token`;
      }
    } else {
      config.headers.Authorization = `Bearer guest-token`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Real-time SSE Chat Streaming client function
export const fetchChatStream = async ({ message, sessionId, resume, jobDescription, history }, onChunk, onDone, onError) => {
  const token = localStorage.getItem('ai_career_mock_user')
    ? `Bearer demo-token-${JSON.parse(localStorage.getItem('ai_career_mock_user')).id}`
    : 'Bearer guest-token';

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ message, sessionId, resume, jobDescription, history })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to stream response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.substring(6);
          try {
            const data = JSON.parse(jsonStr);
            if (data.type === 'chunk' && data.text) {
              onChunk(data.text);
            } else if (data.type === 'init' && data.sessionId) {
              // Session initialized
            } else if (data.type === 'done') {
              if (onDone) onDone(data);
            } else if (data.type === 'error') {
              if (onError) onError(new Error(data.error));
            }
          } catch (err) {
            console.error('SSE JSON parse error:', err);
          }
        }
      }
    }
  } catch (error) {
    if (onError) onError(error);
  }
};

// API Methods
export const resumeAPI = {
  upload: (formData) => api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  saveText: (resumeText) => api.post('/resume', { resumeText }),
  get: () => api.get('/resume'),
};

export const jobDescriptionAPI = {
  save: (data) => api.post('/job-description', data),
  get: () => api.get('/job-description'),
};

export const chatAPI = {
  createSession: (title) => api.post('/chat/session', { title }),
  getHistory: () => api.get('/chat/history'),
  getSessionMessages: (id) => api.get(`/chat/session/${id}`),
  deleteSession: (id) => api.delete(`/chat/session/${id}`),
};

export default api;
