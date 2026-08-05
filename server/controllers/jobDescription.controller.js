import { jobDescriptionSchema } from '../validators/chat.validator.js';
import { supabaseAdmin } from '../config/supabase.js';

// Fallback store
const mockJDs = new Map();

export const saveJobDescription = async (req, res) => {
  try {
    const parseResult = jobDescriptionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Validation Error', details: parseResult.error.format() });
    }

    const { title, description } = parseResult.data;
    const userId = req.user?.id || 'demo-user';

    try {
      const { data: existing } = await supabaseAdmin.from('job_descriptions').select('id').eq('user_id', userId).maybeSingle();

      if (existing) {
        await supabaseAdmin.from('job_descriptions').update({ title, description, updated_at: new Date() }).eq('id', existing.id);
      } else {
        await supabaseAdmin.from('job_descriptions').insert({ user_id: userId, title, description });
      }
    } catch (err) {
      // Fallback
    }

    mockJDs.set(userId, { user_id: userId, title, description, updated_at: new Date().toISOString() });

    return res.json({
      success: true,
      message: 'Job Description saved successfully.',
      title,
      description
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getJobDescription = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';

    try {
      const { data, error } = await supabaseAdmin.from('job_descriptions').select('*').eq('user_id', userId).maybeSingle();
      if (!error && data) return res.json(data);
    } catch (err) {
      // Fallback
    }

    const fallbackData = mockJDs.get(userId) || { description: null, title: null };
    return res.json(fallbackData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
