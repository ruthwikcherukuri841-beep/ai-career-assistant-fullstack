import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().min(2, 'Message must be at least 2 characters').max(4000, 'Message cannot exceed 4000 characters'),
  sessionId: z.string().nullable().optional().or(z.literal('')),
  resume: z.string().nullable().optional(),
  jobDescription: z.string().nullable().optional(),
  history: z.array(
    z.object({
      role: z.string(),
      message: z.string()
    }).passthrough()
  ).optional().default([])
});

export const resumeUploadSchema = z.object({
  resumeText: z.string().min(10, 'Resume text must be at least 10 characters').max(50000, 'Resume text too large')
});

export const jobDescriptionSchema = z.object({
  title: z.string().max(200).optional().default('Target Job Description'),
  description: z.string().min(10, 'Job description must be at least 10 characters').max(10000, 'Job description cannot exceed 10,000 characters')
});

export const sessionParamSchema = z.object({
  id: z.string().uuid('Invalid session ID')
});

export const createSessionSchema = z.object({
  title: z.string().min(1).max(200).optional().default('New Career Chat')
});
