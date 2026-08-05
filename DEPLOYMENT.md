# 🚀 Production Deployment Guide: Supabase, Render & Vercel

This guide provides step-by-step instructions for deploying your **AI Career Assistant Full Stack Web Application** across **Supabase** (Database & Auth), **Render** (Full Stack Server), and **Vercel** (Frontend & API).

---

## 1. 🗄️ Step 1: Deploy Database & Auth to Supabase

### A. Database Migrations
1. Log in to **[Supabase Dashboard](https://app.supabase.com)**.
2. Select your project (or create a new project).
3. Navigate to **SQL Editor** in the left navigation menu.
4. Copy the entire contents of [`database/migrations/01_initial_schema.sql`](file:///c:/Users/ruthw/ai%20career/database/migrations/01_initial_schema.sql) and paste into the SQL Editor.
5. Click **Run**. This creates:
   - `profiles`, `resumes`, `job_descriptions`, `chat_sessions`, `chat_messages` tables.
   - All Row Level Security (RLS) policies for data protection.

### B. Retrieve Supabase Credentials
Go to **Project Settings -> API** and copy:
- `Project URL`: (`https://<project-ref>.supabase.co`)
- `anon public key`: (`eyJhbGci...`)
- `service_role secret key`: (`eyJhbGci...`)

---

## 2. ⚙️ Step 2: Deploy Backend & Full Stack to Render

1. Log in to **[Render.com](https://dashboard.render.com)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository:
   👉 **`https://github.com/ruthwikcherukuri841-beep/ai-career-assistant-fullstack`**
4. Render will automatically read [`render.yaml`](file:///c:/Users/ruthw/ai%20career/render.yaml).
5. In the **Environment Variables** tab, add:

| Environment Variable | Value |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key |
| `JWT_SECRET` | Any random 32-character secret string |
| `NODE_ENV` | `production` |

6. Click **Deploy Web Service**. Your app will be live at `https://ai-career-assistant.onrender.com`!

---

## 3. ⚡ Step 3: Deploy Frontend & API to Vercel

1. Log in to **[Vercel.com](https://vercel.com)**.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: **`ai-career-assistant-fullstack`**.
4. Vercel will automatically detect [`vercel.json`](file:///c:/Users/ruthw/ai%20career/vercel.json).
5. Add the Environment Variables:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
6. Click **Deploy**. Your app will be live at `https://ai-career-assistant.vercel.app`!
