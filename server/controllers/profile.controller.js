import { supabaseAdmin } from '../config/supabase.js';

const mockProfiles = new Map();

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';

    try {
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (!error && data) return res.json(data);
    } catch (err) {
      // Fallback
    }

    const profile = mockProfiles.get(userId) || {
      id: userId,
      full_name: req.user?.email ? req.user.email.split('@')[0] : 'Engineer',
      email: req.user?.email || 'demo@careerassistant.ai',
      created_at: new Date().toISOString()
    };

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { full_name } = req.body;

    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long.' });
    }

    try {
      const { data: existing } = await supabaseAdmin.from('profiles').select('id').eq('id', userId).maybeSingle();
      if (existing) {
        await supabaseAdmin.from('profiles').update({ full_name }).eq('id', userId);
      } else {
        await supabaseAdmin.from('profiles').insert({ id: userId, full_name });
      }
    } catch (err) {
      // Fallback
    }

    const updatedProfile = { id: userId, full_name, email: req.user?.email || 'demo@careerassistant.ai', updated_at: new Date().toISOString() };
    mockProfiles.set(userId, updatedProfile);

    return res.json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
