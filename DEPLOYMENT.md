# 🌸 Aurelia Salon & Spa - Full-Stack Architecture & Vercel Deployment

Aurelia Salon & Spa is structured with separate, clean **Frontend** and **Backend** folders, while providing a unified root runner for instant local preview and single-click Vercel deployments.

---

## 📁 Project Directory Structure

```text
├── backend/                      # 📡 Standalone Backend API (Node + Express)
│   ├── src/
│   │   ├── app.ts                # Express API Application & Routes
│   │   ├── database.ts           # Supabase-backed Salon DB & Schema Models
│   │   ├── server.ts             # Independent Server Entry Point (Port 5000)
│   │   └── types.ts              # TypeScript Domain Interfaces
│   ├── package.json              # Backend Dependencies (Express, CORS, tsx, etc.)
│   ├── tsconfig.json             # Backend TypeScript Configuration
│   ├── .env.example              # Backend Environment Variables
│   └── README.md                 # Backend Guide
│
├── frontend/                     # 🎨 Standalone Frontend App (React 19 + Vite)
│   ├── package.json              # Frontend Dependencies (React, Tailwind, Lucide)
│   ├── tsconfig.json             # Frontend TypeScript Configuration
│   ├── vite.config.ts            # Vite Setup + Proxy to Backend
│   ├── .env.example              # Frontend Environment Variables
│   └── README.md                 # Frontend Guide
│
├── src/                          # 🌿 Application Source Code (Unified)
│   ├── context/                  # React Contexts (Auth, Navigation, State)
│   ├── data/                     # Universal API client & auth session storage
│   ├── server/                   # Server routes & Express app integration
│   ├── types/                    # Domain data models
│   └── ui/                       # Screens, Navigation, Modals & Components
│
├── api/
│   └── index.ts                  # Vercel Serverless Function Handler
├── server.ts                     # Full-Stack Production Express Server
├── vercel.json                   # Vercel Production Deployment Config
└── package.json                  # Root Monorepo Orchestration
```

---

## 🚀 How to Deploy to Vercel

### Option 1: Full-Stack Monorepo Deployment (Recommended)
1. Push your repository to **GitHub** or **GitLab**.
2. Open [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Select your repository.
4. Vercel will automatically read `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Serverless API**: `api/index.ts` handles all `/api/*` requests.
5. Click **"Deploy"**!

---

### Option 2: Deploy Frontend & Backend Separately

#### 🌐 Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend` (or root `.` with `npm run build`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_BASE_URL=https://your-backend.com/api`

#### 📡 Deploy Backend (Railway / Render / Render Web Service)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start` (or `npx tsx src/server.ts`)
- **Port**: `5000` or `$PORT`

---

## 💻 Local Development Commands

### Run Everything Together (Dev Mode):
```bash
npm run dev
```

### Run Backend Standalone:
```bash
cd backend
npm install
npm run dev
```

### Run Frontend Standalone:
```bash
cd frontend
npm install
npm run dev
```
