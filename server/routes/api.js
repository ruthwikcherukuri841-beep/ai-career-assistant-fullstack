import { Router } from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import { handleChatStream, createSession, getHistory, getSessionMessages, deleteSession, renameSession } from '../controllers/chat.controller.js';
import { uploadMiddleware, uploadOrUpdateResume, getResume } from '../controllers/resume.controller.js';
import { saveJobDescription, getJobDescription } from '../controllers/jobDescription.controller.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';

const router = Router();

// Apply Auth Middleware to all API routes
router.use(verifyAuth);

// AI Chat Routes
router.post('/chat', chatLimiter, handleChatStream);
router.post('/chat/session', createSession);
router.get('/chat/history', getHistory);
router.get('/chat/session/:id', getSessionMessages);
router.put('/chat/session/:id', renameSession);
router.delete('/chat/session/:id', deleteSession);

// Profile Routes
router.get('/user/profile', getProfile);
router.put('/user/profile', updateProfile);

// Resume Context Routes
router.post('/resume', (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadOrUpdateResume);

router.get('/resume', getResume);

// Job Description Context Routes
router.post('/job-description', saveJobDescription);
router.get('/job-description', getJobDescription);

export default router;
