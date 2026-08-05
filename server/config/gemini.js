import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ Warning: GEMINI_API_KEY is not defined in environment variables.');
}

// Instantiate official Google Gen AI SDK client
export const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Standard default model for multimodal career assistant operations
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
