import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for SSE & inline scripts during local dev
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://aicareer:5000',
    'http://aicareer.local:5000',
    'http://aicareer',
    'http://aicareer.local',
    'http://aicareer.com',
    'http://aicareer.com:5000',
    'http://www.aicareer.com',
    'http://www.aicareer.com:5000',
    'https://aicareer.com',
    'https://www.aicareer.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply General Rate Limiter to /api
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Career Assistant Full Stack Application',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Mount Main API Router
app.use('/api', apiRouter);

// Serve Static Frontend Assets (Unified Full Stack Production Server)
app.use(express.static(clientDistPath));

// Catch-all SPA route to serve client index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Full stack website build not found. Please run "npm run build" in root.');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Express Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Career Assistant Unified Full Stack Web Application running on http://localhost:${PORT}`);
  console.log(`🔗 Custom Domain Link: http://aicareer:${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/health`);
});
