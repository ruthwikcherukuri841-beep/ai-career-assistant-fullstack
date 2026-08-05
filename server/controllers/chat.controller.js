import { chatRequestSchema, createSessionSchema, sessionParamSchema } from '../validators/chat.validator.js';
import { generateStreamingResponse } from '../services/gemini.service.js';
import { supabaseAdmin } from '../config/supabase.js';


// In-memory fallback store when Supabase DB is unconfigured
const mockSessions = new Map();
const mockMessages = new Map();

export const handleChatStream = async (req, res) => {
  try {
    const parseResult = chatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      console.warn('Zod Chat Validation Error Details:', JSON.stringify(parseResult.error.format(), null, 2));
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const { message, resume, jobDescription, history } = parseResult.data;
    let { sessionId } = parseResult.data;
    const userId = req.user?.id || 'demo-user';

    // 1. Ensure Session exists or create new session
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : 'session-' + Date.now();
      const initialTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
      
      try {
        await supabaseAdmin.from('chat_sessions').insert({
          id: sessionId,
          user_id: userId,
          title: initialTitle
        });
      } catch (err) {
        mockSessions.set(sessionId, { id: sessionId, user_id: userId, title: initialTitle, created_at: new Date().toISOString() });
      }
    }

    // 2. Save User Message
    try {
      await supabaseAdmin.from('chat_messages').insert({
        session_id: sessionId,
        role: 'user',
        message: message
      });
    } catch (err) {
      if (!mockMessages.has(sessionId)) mockMessages.set(sessionId, []);
      mockMessages.get(sessionId).push({
        id: 'msg-' + Date.now(),
        session_id: sessionId,
        role: 'user',
        message: message,
        created_at: new Date().toISOString()
      });
    }

    // 3. Setup SSE Headers for Real-Time Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send sessionId header event
    res.write(`data: ${JSON.stringify({ sessionId, type: 'init' })}\n\n`);

    // 4. Stream response from Gemini
    let fullResponseText = '';

    await generateStreamingResponse(
      { message, resume, jobDescription, history },
      (textChunk) => {
        fullResponseText += textChunk;
        res.write(`data: ${JSON.stringify({ text: textChunk, type: 'chunk' })}\n\n`);
      }
    );

    // 5. Parse Category Tag from AI Response if available
    let category = 'General Career Chat';
    const categoryMatch = fullResponseText.match(/__CATEGORY__:\s*(\{[^}]+\})/);
    if (categoryMatch) {
      try {
        const parsed = JSON.parse(categoryMatch[1]);
        if (parsed.category) category = parsed.category;
      } catch (e) {
        // ignore json parse error
      }
    }

    // Clean up category tag from final message
    const cleanMessage = fullResponseText.replace(/__CATEGORY__:\s*\{[^}]+\}/, '').trim();

    // 6. Save Assistant Response
    try {
      await supabaseAdmin.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        message: cleanMessage,
        category: category
      });
    } catch (err) {
      if (!mockMessages.has(sessionId)) mockMessages.set(sessionId, []);
      mockMessages.get(sessionId).push({
        id: 'msg-' + (Date.now() + 1),
        session_id: sessionId,
        role: 'assistant',
        message: cleanMessage,
        category: category,
        created_at: new Date().toISOString()
      });
    }

    // End stream
    res.write(`data: ${JSON.stringify({ type: 'done', category, sessionId })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat Stream Controller Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Internal Server Error during AI streaming response' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message, type: 'error' })}\n\n`);
      res.end();
    }
  }
};

export const createSession = async (req, res) => {
  try {
    const parseResult = createSessionSchema.safeParse(req.body);
    const title = parseResult.success ? parseResult.data.title : 'New Career Chat';
    const userId = req.user?.id || 'demo-user';
    const sessionId = crypto.randomUUID ? crypto.randomUUID() : 'session-' + Date.now();

    try {
      const { data, error } = await supabaseAdmin.from('chat_sessions').insert({
        id: sessionId,
        user_id: userId,
        title: title
      }).select().single();

      if (!error && data) return res.status(201).json(data);
    } catch (err) {
      // Fallback
    }

    const sessionObj = { id: sessionId, user_id: userId, title, created_at: new Date().toISOString() };
    mockSessions.set(sessionId, sessionObj);
    return res.status(201).json(sessionObj);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';

    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) return res.json(data);
    } catch (err) {
      // Fallback
    }

    const userMockSessions = Array.from(mockSessions.values())
      .filter((s) => s.user_id === userId || userId === 'demo-user')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return res.json(userMockSessions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('session_id', id)
        .order('created_at', { ascending: true });

      if (!error && data) return res.json(data);
    } catch (err) {
      // Fallback
    }

    const messages = mockMessages.get(id) || [];
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await supabaseAdmin.from('chat_sessions').delete().eq('id', id);
    } catch (err) {
      // Fallback
    }

    mockSessions.delete(id);
    mockMessages.delete(id);

    return res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const renameSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Session title cannot be empty.' });
    }

    try {
      await supabaseAdmin.from('chat_sessions').update({ title }).eq('id', id);
    } catch (err) {
      // Fallback
    }

    if (mockSessions.has(id)) {
      const sess = mockSessions.get(id);
      sess.title = title;
      mockSessions.set(id, sess);
    }

    return res.json({ success: true, message: 'Session title updated successfully', id, title });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

