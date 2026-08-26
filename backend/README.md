# 🌸 Aurelia Salon & Spa - Backend API

Standalone Express.js REST API for appointment booking, user authentication, services, staff management, and billing.

## Supabase Database

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase/schema.sql`](../supabase/schema.sql).
3. Copy `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY` into your backend `.env`.
4. Never expose the service-role key as a `VITE_*` variable or commit `.env`.

The SQL migration creates the users, services, promotions, staff, customers, availability, and appointments tables with indexes, timestamps, constraints, and RLS enabled.

## 🚀 Quick Start

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Start production server
npm start
```

## 📡 API Routes

- `GET  /api/health` - Server Health Check
- `POST /api/auth/login` - User Login
- `POST /api/auth/register` - User Registration
- `GET  /api/auth/me` - Current Authenticated Profile
- `PUT  /api/auth/me` - Update Profile
- `GET  /api/services` - List All Services
- `POST /api/services` - Add New Service (Admin)
- `GET  /api/promotions` - List Deals & Special Packages
- `GET  /api/staff` - Staff Directory
- `GET  /api/staff/me/overview` - Staff Dashboard Overview
- `GET  /api/staff/me/availability` - Staff Working Hours & Busy Slots
- `GET  /api/appointments` - All Salon Appointments
- `GET  /api/appointments/my` - Customer Appointments
- `GET  /api/appointments/availability` - Real-time slot availability generator
- `POST /api/appointments` - Create new booking
- `PUT  /api/appointments/:id/status` - Update appointment status
- `GET  /api/customers` - Customer CRM
- `PUT  /api/users/:id/role` - Update User Role
- `GET  /api/payments` - Billing & Payments List
- `GET  /api/dashboard` - Salon Business Intelligence Metrics
