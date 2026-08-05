# 🚀 Full Stack AI Career Assistant Chatbot

> A production-ready, ChatGPT-style AI Career Assistant powered by **Google Gemini SDK (`@google/genai`)**, **Node.js/Express**, **Supabase (Auth & PostgreSQL RLS)**, **React**, **Vite**, and **Tailwind CSS**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-purple.svg)](https://vitejs.dev/)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange.svg)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 🌟 Key Features

### 🤖 AI-Powered Career Guidance (Google Gemini 2.5)
- **Real-Time Token Streaming**: Real-time chunked response streaming using Server-Sent Events (SSE) via `@google/genai`'s `generateContentStream`.
- **ATS Match Optimization**: Compare uploaded resumes directly against target Job Descriptions to calculate estimated ATS match percentages and keyword gaps.
- **Server-Side Resume Parsing**: Extracts readable text from `.pdf` (`pdf-parse`), `.docx` (`mammoth`), and `.txt` files.
- **Technical & HR Interview Prep**: Generate role-specific interview questions with STAR-framework answer outlines.
- **Actionable Bullet Rewriter**: Transform bland experience bullets into quantified impact metrics (XYZ format).
- **Personalized Roadmaps & Projects**: Create 4-week tech learning plans and portfolio project recommendations.

### 🔑 Authentication & Account Linking
- **Supabase Auth**: Secure email/password login and registration.
- **Social OAuth Sign-In**: One-click authentication with **Google**, **GitHub**, and **ChatGPT / OpenAI**.
- **Linked Accounts Manager**: Connect or disconnect social accounts directly inside user profiles.

### 📜 Conversation History & Logs
- **Searchable Chat Logs**: Full `/history` page with real-time keyword filtering.
- **Transcript Inspection Modal**: Inspect detailed conversation transcripts, copy responses, or delete session logs.
- **Session Continuity**: Resume past conversations directly in the main AI chat workspace.

### 🎨 Premium UI/UX & Design
- **Theme Toggle**: Full Dark Mode & Light Mode support.
- **Rich Typography & Formatting**: GitHub Flavored Markdown (`react-markdown` + `remark-gfm`) with fenced code syntax highlighting (`react-syntax-highlighter`) and copy code buttons.
- **Glassmorphism Aesthetics**: Tailored HSL gradients, responsive sidebar navigation drawer, and animated typing indicators.

---

## 🏗️ Architecture & Tech Stack

```
[ React + Vite Frontend ] (Client Port 5173 / Production Dist)
         │
         ▼  REST API + Server-Sent Events (SSE) Streaming
[ Express Node.js Server ] (Server Port 5000)
         │
         ├──► [ Google Gemini SDK ] (@google/genai - gemini-2.5-flash)
         └──► [ Supabase PostgreSQL ] (Row Level Security Policies)
```

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, React Markdown, React Syntax Highlighter, Zod, Axios |
| **Backend** | Node.js, Express, `@google/genai` (Official SDK), Multer, `pdf-parse`, `mammoth`, Express Rate Limit, Helmet |
| **Database** | Supabase PostgreSQL + Row Level Security (RLS) policies |
| **Authentication** | Supabase Auth (Email/Password + Google/GitHub/OpenAI OAuth) |
| **Deployment** | Docker, Render.com (`render.yaml`), Procfile, Express static asset server |

---

## 📁 Repository Structure

```
.
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Chat, Resume, JobDescription & Shared UI
│   │   ├── context/            # AuthContext & ThemeContext
│   │   ├── pages/              # Login, Signup, Dashboard, CareerChat, History, Profile, Settings, 404
│   │   ├── services/           # Axios & SSE streaming API client
│   │   ├── App.jsx             # React Router Protected Navigation
│   │   ├── index.css           # Tailwind Design Tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js Express Backend
│   ├── config/                 # Gemini (@google/genai) & Supabase Client
│   ├── controllers/            # Streaming Chat, Resume Parser, JD & Profile Controllers
│   ├── middleware/             # Supabase JWT Auth & Express Rate Limiter
│   ├── prompts/                # System Prompt & Context Builder
│   ├── services/               # Gemini content stream generator
│   ├── validators/             # Zod Request Schemas
│   ├── routes/                 # Express API Router (/api/*)
│   └── server.js               # Main Express Server
│
├── database/
│   └── migrations/
│       └── 01_initial_schema.sql  # Supabase PostgreSQL DDL & RLS Policies
│
├── Dockerfile                  # Production Multi-Stage Dockerfile
├── Procfile                    # Cloud Process Descriptor (Railway/Heroku/Render)
├── render.yaml                 # Render.com Infrastructure Blueprint
├── DEPLOYMENT.md               # Production Deployment Guide
└── package.json                # Root package configuration
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- Google Gemini API Key ([Get Key Here](https://aistudio.google.com/))
- Supabase Account ([Create Free Project](https://supabase.com/))

### 2. Environment Variables Setup

Create a `.env` file in `server/.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Install Dependencies
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 4. Apply Database Migrations
Copy the contents of `database/migrations/01_initial_schema.sql` and run them in your **Supabase SQL Editor**.

### 5. Start Unified Full-Stack Application
```bash
npm start
```
- **Unified Website**: [http://localhost:5000](http://localhost:5000)
- **Frontend Dev Server**: [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## ☁️ Cloud & Docker Deployment

### Docker Container Build
```bash
docker build -t ai-career-assistant .
docker run -p 5000:5000 -e GEMINI_API_KEY=your_key ai-career-assistant
```

### Render.com Deployment
Connect your repository to **[Render.com](https://render.com)**. Render will automatically detect `render.yaml` and provision your full stack web application with automatic HTTPS SSL certificates for `https://aicareer.com`.

---

## 📄 License
This project is licensed under the MIT License.
