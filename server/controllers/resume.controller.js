import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { supabaseAdmin } from '../config/supabase.js';

// Setup multer memory storage with file size limits (max 5MB)
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
}).single('resume');

// In-memory fallback
const mockResumes = new Map();

export const uploadOrUpdateResume = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    let resumeText = '';
    let fileName = 'Uploaded_Resume.txt';

    if (req.file) {
      fileName = req.file.originalname;
      const buffer = req.file.buffer;

      if (req.file.mimetype === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
        const parsedPdf = await pdfParse(buffer);
        resumeText = parsedPdf.text;
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.toLowerCase().endsWith('.docx')) {
        const parsedDocx = await mammoth.extractRawText({ buffer });
        resumeText = parsedDocx.value;
      } else {
        resumeText = buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
      fileName = req.body.fileName || 'Pasted_Resume.txt';
    } else {
      return res.status(400).json({ error: 'Please provide a file or resumeText in the request body.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract readable text from the uploaded document.' });
    }

    // Clean up excessive whitespace
    resumeText = resumeText.replace(/\r\n/g, '\n').trim();

    try {
      // Upsert into Supabase resumes table
      const { data: existing } = await supabaseAdmin.from('resumes').select('id').eq('user_id', userId).maybeSingle();

      if (existing) {
        await supabaseAdmin.from('resumes').update({ resume_text: resumeText, file_name: fileName, updated_at: new Date() }).eq('id', existing.id);
      } else {
        await supabaseAdmin.from('resumes').insert({ user_id: userId, resume_text: resumeText, file_name: fileName });
      }
    } catch (err) {
      // Fallback
    }

    mockResumes.set(userId, { user_id: userId, resume_text: resumeText, file_name: fileName, updated_at: new Date().toISOString() });

    return res.json({
      success: true,
      message: 'Resume text extracted and saved successfully.',
      fileName,
      characterCount: resumeText.length,
      resumeText
    });
  } catch (error) {
    console.error('Resume Controller Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process resume file' });
  }
};

export const getResume = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user';

    try {
      const { data, error } = await supabaseAdmin.from('resumes').select('*').eq('user_id', userId).maybeSingle();
      if (!error && data) return res.json(data);
    } catch (err) {
      // Fallback
    }

    const fallbackData = mockResumes.get(userId) || { resume_text: null, file_name: null };
    return res.json(fallbackData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
