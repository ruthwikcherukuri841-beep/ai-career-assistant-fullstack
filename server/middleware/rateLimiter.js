import rateLimit from 'express-rate-limit';

// Standard rate limiter for API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Stricter rate limiter for AI streaming chat endpoint
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 chat requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Chat rate limit reached. Please wait a moment before sending another prompt.'
  }
});
