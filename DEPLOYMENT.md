# AI Career Assistant — Production Deployment Guide

This guide details step-by-step instructions to deploy your **AI Career Assistant Full Stack Web Application** to production hosting platforms.

---

## 📋 Production Environment Variables

Make sure to set the following Environment Variables on your hosting provider:

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | **Yes** | Your Google Gemini API Key |
| `SUPABASE_URL` | **Yes** | Your Supabase Project URL (`https://your-project.supabase.co`) |
| `SUPABASE_ANON_KEY` | **Yes** | Your Supabase Anonymous Public Key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Your Supabase Service Role Secret Key |
| `JWT_SECRET` | **Yes** | Secret key for JWT verification |
| `NODE_ENV` | **Yes** | Set to `production` |
| `PORT` | Optional | Set to `5000` (auto-assigned by Render/Railway) |

---

## 🚀 Deployment Options

### Option 1: Render.com (Recommended Free Hosting)
1. Push your project to **GitHub**.
2. Go to **[Render Dashboard](https://dashboard.render.com)** -> **New Web Service**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. Fill in `GEMINI_API_KEY` and `SUPABASE_URL` in the Environment Variables tab.
5. Click **Create Web Service**.

### Option 2: Docker Container Deployment (AWS / Cloud Run / DigitalOcean)
```bash
# Build image
docker build -t ai-career-assistant .

# Run container locally or push to registry
docker run -p 5000:5000 \
  -e GEMINI_API_KEY=your_gemini_key \
  -e SUPABASE_URL=your_supabase_url \
  ai-career-assistant
```

### Option 3: Railway.app / Heroku
1. Connect your repository to **Railway** or **Heroku**.
2. Set Environment Variables in the project dashboard.
3. The platform will automatically read `Procfile` (`web: node server/server.js`) and start the website.

---

## 🗄️ Database Setup
Remember to execute `database/migrations/01_initial_schema.sql` in your **Supabase SQL Editor** to create tables and Row Level Security policies.
