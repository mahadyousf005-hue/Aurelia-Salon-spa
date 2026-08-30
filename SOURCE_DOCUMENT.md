# 🌸 Aurelia Salon & Spa - Complete Source Document

## Project Overview

**Aurelia Salon & Spa** is a full-stack luxury salon booking and management application built with modern web technologies. It provides customers with an elegant booking experience and admins with comprehensive salon management tools.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Directory Structure](#directory-structure)
6. [Setup Instructions](#setup-instructions)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Deployment Guide](#deployment-guide)
10. [Environment Variables](#environment-variables)

---

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern UI library with hooks and concurrent rendering
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite 6** - Lightning-fast build tool and dev server
- **Lucide React** - Beautiful SVG icon library
- **Motion** - Smooth animations and transitions
- **Supabase Client** - Real-time database and authentication

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Fast, unopinionated web framework
- **TypeScript** - Type-safe backend code
- **tsx** - TypeScript execution engine
- **CORS** - Cross-Origin Resource Sharing
- **Supabase SDK** - Backend database access with service role

### Database
- **Supabase (PostgreSQL)** - Open-source Firebase alternative
- **PostgREST** - Auto-generated REST API
- **Real-time Subscriptions** - Live data updates
- **Row-Level Security (RLS)** - Fine-grained access control

### Deployment
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and CI/CD
- **Environment Variables** - Secure configuration management

---

## ✨ Features

### Customer Features
- **User Authentication** - Secure login/registration
- **Appointment Booking** - Real-time availability checking
- **Service Browsing** - Luxury salon services with pricing
- **Appointment Management** - View, reschedule, cancel bookings
- **Profile Management** - Update personal information
- **Promotions** - View special offers and packages
- **Booking History** - Track past and upcoming appointments

### Admin Features
- **Admin Dashboard** - Key metrics and insights
- **Service Management** - Create, edit, delete services
- **Staff Management** - Manage staff members and specializations
- **Appointment Management** - View all bookings, manage status
- **Customer CRM** - Customer database and history
- **Availability Management** - Set staff working hours
- **Payment Tracking** - Monitor salon revenue
- **Role Management** - User role assignment

### Staff Features
- **Staff Dashboard** - Personal schedule overview
- **Availability Management** - Set working hours
- **Appointment Schedule** - View assigned appointments
- **Performance Metrics** - Rating and review tracking

---

## 🏗 Architecture

### System Design
```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + Vite)                   │
│  - User Interface                                   │
│  - Authentication Context                          │
│  - API Communication                               │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ REST API Calls
┌────────────────────▼────────────────────────────────┐
│     Backend (Express.js + TypeScript)               │
│  - API Routes & Controllers                        │
│  - Authentication & Authorization                  │
│  - Business Logic                                  │
│  - Database Queries                                │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
                     │ SQL Queries
┌────────────────────▼────────────────────────────────┐
│    Database (Supabase PostgreSQL)                   │
│  - Tables & Schemas                                │
│  - Row-Level Security                              │
│  - Real-time Subscriptions                         │
│  - Authentication                                  │
└─────────────────────────────────────────────────────┘
```

### Authentication Flow
1. User enters email and password
2. Backend validates credentials against Supabase Auth
3. Backend generates session token
4. Frontend stores token in localStorage
5. Subsequent requests include token in Authorization header
6. Backend verifies token before processing requests

---

## 📁 Directory Structure

```
aurelia-salon-&-spa/
│
├── backend/                           # Express.js REST API
│   ├── src/
│   │   ├── server.ts                  # Main server entry point
│   │   ├── server/
│   │   │   ├── app.ts                 # Express app configuration & routes
│   │   │   └── database.ts            # Database utilities & models
│   │   ├── data/
│   │   │   ├── api.ts                 # API client utilities
│   │   │   ├── salonData.ts           # Mock data for development
│   │   │   └── supabase.ts            # Supabase configuration
│   │   └── types/
│   │       └── index.ts               # TypeScript interfaces
│   ├── .env                           # Backend environment variables
│   ├── .env.example                   # Example environment file
│   ├── package.json                   # Backend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   └── README.md                      # Backend documentation
│
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx                   # Entry point
│   │   ├── App.tsx                    # Root component
│   │   ├── index.css                  # Global styles
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Authentication state management
│   │   ├── data/
│   │   │   ├── api.ts                 # API client
│   │   │   ├── salonData.ts           # Mock data
│   │   │   └── supabase.ts            # Supabase client
│   │   ├── types/
│   │   │   └── index.ts               # Type definitions
│   │   ├── ui/
│   │   │   ├── components/            # Reusable components
│   │   │   │   ├── TopHeader.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── PrimaryGoldButton.tsx
│   │   │   │   └── ...
│   │   │   ├── screens/               # Page components
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   ├── customer/
│   │   │   │   ├── staff/
│   │   │   │   └── common/
│   │   │   └── theme/
│   │   │       └── colors.ts          # Design tokens
│   │   └── vite-env.d.ts              # Vite type definitions
│   ├── .env.example                   # Example environment file
│   ├── index.html                     # HTML entry point
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── vite.config.ts                 # Vite configuration with API proxy
│   └── README.md                      # Frontend documentation
│
├── supabase/
│   └── schema.sql                     # Database schema & migrations
│
├── .git/                              # Git repository
├── .gitignore                         # Git ignore rules
├── vercel.json                        # Vercel deployment configuration
├── DEPLOYMENT.md                      # Deployment guide
├── README.md                          # Project README
└── SOURCE_DOCUMENT.md                 # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- Supabase account (free tier available)
- Vercel account (for deployment)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/mahadyousf005-hue/Aurelia-Salon-spa.git
cd aurelia-salon-&-spa
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Supabase

**Create Supabase Project:**
1. Visit [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project name and password
4. Create project

**Run Database Schema:**
1. In Supabase dashboard, open SQL Editor
2. Copy contents from `supabase/schema.sql`
3. Execute the SQL migration

**Get API Credentials:**
1. Go to Settings → API
2. Copy:
   - Project URL → SUPABASE_URL
   - anon public → VITE_SUPABASE_ANON_KEY
   - service_role → SUPABASE_SERVICE_ROLE_KEY

#### 4. Set Environment Variables

**Backend (.env)**
```
PORT=3000
NODE_ENV=development
JWT_SECRET=aurelia_luxury_salon_secret_key_2026
DATABASE_URL=
CLIENT_URL=http://localhost:3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

#### 5. Run Development Servers

**Option A: Run Both Together**
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

#### 6. Access Application
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
GET    /api/auth/me                 - Get current user profile
PUT    /api/auth/me                 - Update user profile
```

### Services
```
GET    /api/services                - List all services
POST   /api/services                - Create service (Admin)
PUT    /api/services/:id            - Update service (Admin)
DELETE /api/services/:id            - Delete service (Admin)
```

### Appointments
```
GET    /api/appointments            - Get all appointments (Admin)
GET    /api/appointments/my         - Get user's appointments
POST   /api/appointments            - Create new appointment
PUT    /api/appointments/:id/status - Update appointment status
GET    /api/appointments/availability - Get available time slots
```

### Staff
```
GET    /api/staff                   - List all staff members
GET    /api/staff/me/overview       - Staff dashboard metrics
GET    /api/staff/me/availability   - Get staff availability
POST   /api/staff                   - Add staff member (Admin)
```

### Users & Admin
```
GET    /api/users                   - List all users (Admin)
PUT    /api/users/:id/role          - Update user role (Admin)
GET    /api/customers               - Customer CRM data
GET    /api/payments                - Payment records
GET    /api/dashboard               - Admin dashboard metrics
```

### Health Check
```
GET    /api/health                  - Server health status
GET    /api                         - API documentation
```

---

## 🗄 Database Schema

### Users Table
```sql
- id: UUID (Primary Key)
- name: String
- email: String (Unique)
- phone: String
- role: Enum (customer, staff, admin)
- password_hash: String
- created_at: Timestamp
- updated_at: Timestamp
```

### Services Table
```sql
- id: String (Primary Key)
- name: String
- category: String
- price: Decimal
- duration: Integer (minutes)
- description: Text
- image: String (URL)
- rating: Decimal
- status: Enum (Active, Inactive)
- created_at: Timestamp
- updated_at: Timestamp
```

### Appointments Table
```sql
- id: String (Primary Key)
- customer_id: UUID (Foreign Key)
- staff_id: UUID (Foreign Key)
- service_id: String (Foreign Key)
- appointment_date: Date
- start_time: String (HH:MM)
- end_time: String (HH:MM)
- status: Enum (Pending, Confirmed, Completed, Cancelled)
- notes: Text
- created_at: Timestamp
- updated_at: Timestamp
```

### Staff Table
```sql
- id: UUID (Primary Key)
- name: String
- email: String
- phone: String
- specialization: String
- experience: String
- rating: Decimal
- status: Enum (Active, Inactive)
- services: Array of String IDs
- created_at: Timestamp
- updated_at: Timestamp
```

### Customers Table
```sql
- id: UUID (Primary Key)
- name: String
- email: String
- phone: String
- total_visits: Integer
- role: String (customer)
- created_at: Timestamp
- updated_at: Timestamp
```

### Promotions Table
```sql
- id: String (Primary Key)
- title: String
- description: Text
- discount_percent: Integer
- start_date: Date
- end_date: Date
- services: Array of Service IDs
- created_at: Timestamp
- updated_at: Timestamp
```

---

## 🌐 Deployment Guide

### Prerequisites for Deployment
1. GitHub repository with code pushed
2. Supabase project created and configured
3. Vercel account (free tier available)
4. Environment variables ready

### Deploy to Vercel

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin aurelia-salon
```

#### Step 2: Connect to Vercel
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Select repository: `Aurelia-Salon-spa`
4. Click "Import"

#### Step 3: Configure Settings
- **Root Directory**: Select root (.)
- **Framework**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### Step 4: Add Environment Variables

Production Environment:
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
PORT = 3000
```

#### Step 5: Deploy
- Click "Deploy"
- Wait 3-5 minutes for deployment
- Get your live URL

### Verify Deployment
- Visit `https://your-app.vercel.app`
- Check API at `https://your-app.vercel.app/api`
- Verify health check at `https://your-app.vercel.app/api/health`

### Post-Deployment Checklist
- [ ] Frontend loads correctly
- [ ] Login/Register works
- [ ] Can create appointments
- [ ] Admin dashboard is accessible
- [ ] Services can be added (Admin)
- [ ] Database is synced

---

## 🔑 Environment Variables

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development`, `production` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side API key | `sb_secret_xxxxx` |
| `JWT_SECRET` | Token signing key | `aurelia_luxury_salon_secret_key_2026` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3001` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Supabase Getting Credentials

1. **Project URL**: Settings → API → "Project URL"
2. **anon public**: Settings → API → "anon public"
3. **service_role**: Settings → API → "service_role" (Keep SECRET!)

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Keep service_role_key SECRET** - Don't expose in frontend
3. **Use HTTPS only** - Always use secure connections
4. **Enable Row-Level Security** - Restrict database access
5. **Validate all inputs** - Prevent SQL injection
6. **Use rate limiting** - Prevent API abuse
7. **Update dependencies** - Keep packages current

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express.js API](https://expressjs.com/api.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Support
- GitHub Issues: Report bugs and request features
- Supabase Community: Ask database questions
- Vercel Support: Deployment assistance

---

## 📝 Project Status

- ✅ Frontend: Complete with all screens
- ✅ Backend: REST API with all endpoints
- ✅ Database: Schema and migrations ready
- ✅ Authentication: User login/registration
- ✅ Deployment: Vercel configuration ready
- 📋 Testing: Unit tests pending
- 📋 Documentation: In progress

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Team

- **Project Lead**: Mahad Yousaf
- **Frontend Developer**: React + Vite specialist
- **Backend Developer**: Express.js + TypeScript specialist
- **Database Admin**: Supabase expert

---

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] SMS notifications
- [ ] Email confirmations
- [ ] Loyalty program
- [ ] Review and ratings system
- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] AI-powered recommendations
- [ ] Multi-location support

---

**Last Updated**: August 30, 2026
**Version**: 1.0.0
