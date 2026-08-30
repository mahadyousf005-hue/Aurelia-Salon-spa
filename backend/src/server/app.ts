import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db, hashPassword, verifyPassword } from './database';
import { User, UserRole, Appointment, TimeSlot, StaffMember } from '../types';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper: Extract Auth User from Bearer Token
const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const supabase = process.env.SUPABASE_URL && serverKey
  ? createClient(process.env.SUPABASE_URL, serverKey, { auth: { persistSession: false } })
  : null;

async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) return next();

  // Tokens are format "token-<userId>" or "token-<timestamp>" or mock
  if (token.startsWith('token-')) {
    const userId = token.replace('token-', '');
    const user = db.findUserById(userId) || db.users.find(u => u.id && token.includes(u.id));
    if (user) {
      (req as any).user = user;
    }
  } else if (supabase) {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      const { data: profile } = await supabase.from('profiles').select('id, full_name, email, phone, role').eq('id', user.id).single();
      if (profile) (req as any).user = { id: profile.id, name: profile.full_name, email: profile.email, phone: profile.phone, role: profile.role };
    }
  }
  next();
}

app.use(authenticate);
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  if (_req.path === '/api/auth/register' || _req.path === '/api/auth/login') {
    return next();
  }
  try {
    await db.ready;
    next();
  } catch (error) {
    next(error);
  }
});

// Generate Time Slots Helper
function calculateSlots(dateString: string, serviceDuration: number = 45): TimeSlot[] {
  const allSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const existingApts = db.appointments.filter(
    (apt) => apt.appointment_date === dateString && apt.status !== "cancelled"
  );

  return allSlots.map((time) => {
    const isBooked = existingApts.some((apt) => apt.start_time === time);
    const [h, m] = time.split(":").map(Number);
    const endMinutes = h * 60 + m + serviceDuration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    return {
      startTime: time,
      endTime,
      available: !isBooked
    };
  });
}

// ==========================================
// 1. Health Check
// ==========================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Aurelia Salon & Spa Backend API'
  });
});

// ==========================================
// 2. Authentication Routes
// ==========================================
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (role !== 'customer' && role !== 'staff') {
      return res.status(403).json({ error: 'Only customer and staff accounts can register.' });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: String(email).trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: { full_name: String(name).trim(), phone: phone?.trim() || '', role }
      });
      if (error) return res.status(400).json({ error: error.message });

      const profile = {
        id: data.user.id,
        full_name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone?.trim() || '',
        role
      };
      const { error: userError } = await supabase.from('users').upsert({
        id: data.user.id,
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        role,
        password_hash: 'managed-by-supabase-auth'
      }, { onConflict: 'id' });
      if (userError) return res.status(500).json({ error: userError.message });
      const { error: profileError } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
      if (profileError) return res.status(500).json({ error: profileError.message });

      const account = {
        id: data.user.id,
        user_id: data.user.id,
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone
      };
      const { error: accountError } = role === 'customer'
        ? await supabase.from('customers').upsert({ ...account, total_visits: 0, role: 'customer' }, { onConflict: 'id' })
        : await supabase.from('staff').upsert({ ...account, specialization: 'Staff Member', experience: 'New', rating: 5, status: 'Active', services: [] }, { onConflict: 'id' });
      if (accountError) return res.status(500).json({ error: accountError.message });

      return res.status(201).json({ message: 'Account created successfully', user: { id: data.user.id, name, email, phone, role } });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User & { passwordHash?: string } = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '+92 300 0000000',
      role: (role as UserRole) || 'customer',
      passwordHash: hashPassword(password)
    };

    await db.ready;
    await db.createUser(newUser);
    const token = `token-${newUser.id}`;

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email or phone number is required.' });
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password: password || '' });
      if (error) return res.status(401).json({ error: error.message });
      if (!data.session) return res.status(401).json({ error: 'No authenticated session was returned.' });
      const { data: profile, error: profileError } = await supabase.from('profiles').select('id, full_name, email, phone, role').eq('id', data.user.id).single();
      if (profileError) return res.status(500).json({ error: profileError.message });
      return res.json({ token: data.session.access_token, user: { id: profile.id, name: profile.full_name, email: profile.email, phone: profile.phone, role: profile.role } });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let user = db.findUserByEmail(cleanEmail);

    // Allow registered users to sign in with their email or phone.
    if (!user) {
      user = db.users.find(u => u.phone?.replace(/[^0-9]/g, '') === cleanEmail.replace(/[^0-9]/g, ''));
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = user.passwordHash && verifyPassword(password || '', user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `token-${user.id}`;
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

app.put('/api/auth/me', (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, phone } = req.body;
  const updated = db.updateUser(currentUser.id, { name, phone });

  res.json({
    message: 'Profile updated successfully',
    user: updated
  });
});

// ==========================================
// 3. Services Catalog
// ==========================================
app.get('/api/services', async (_req: Request, res: Response) => {
  try {
    res.json({ services: await db.getServices() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load services.' });
  }
});

app.post('/api/services', (req: Request, res: Response) => {
  try {
    const { name, category, price, duration, description, image, status } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ error: 'Name, price, and duration are required.' });
    }

    const newService = {
      id: `srv-${Date.now()}`,
      _id: `srv-${Date.now()}`,
      name: name.trim(),
      category: category || 'Hair',
      price: Number(price),
      duration: Number(duration),
      description: description?.trim() || 'Custom luxury salon treatment.',
      image: image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      status: status || 'Active'
    };

    db.addService(newService);
    res.status(201).json({ service: newService, message: 'Service added successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not add service' });
  }
});

app.delete('/api/services/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removed = db.deleteService(id);
    if (!removed) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    res.json({
      success: true,
      message: `${removed.name} has been removed from services.`,
      service: removed
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not delete service' });
  }
});

app.put('/api/services/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateService(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    res.json({
      success: true,
      message: 'Service updated successfully',
      service: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not update service' });
  }
});

// ==========================================
// 4. Promotions
// ==========================================
app.get('/api/promotions', async (_req: Request, res: Response) => {
  try {
    res.json({ promotions: await db.getPromotions() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load promotions.' });
  }
});

// ==========================================
// 5. Staff & Availability
// ==========================================
app.get('/api/staff', async (_req: Request, res: Response) => {
  try {
    res.json({ staff: await db.getStaff() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load staff members.' });
  }
});

app.post('/api/staff', (req: Request, res: Response) => {
  try {
    const { name, email, phone, specialization, experience, rating, status, services } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      _id: `staff-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '+92 314 0000000',
      specialization: specialization?.trim() || 'Senior Stylist',
      experience: experience?.trim() || '5+ Years',
      rating: Number(rating) || 5.0,
      status: status || 'Active',
      services: services && Array.isArray(services) && services.length > 0 ? services : [
        { name: 'Signature Haircut & Styling', duration: 45 },
        { name: 'Aura Royal Gold Facial', duration: 60 }
      ]
    };

    db.addStaff(newStaff);
    res.status(201).json({
      message: 'Staff member added successfully',
      staff: newStaff
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not add staff member' });
  }
});

app.delete('/api/staff/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const removed = db.deleteStaff(id);
    if (!removed) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }
    res.json({
      success: true,
      message: `${removed.name} has been removed from the team.`,
      staff: removed
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not delete staff member' });
  }
});

app.put('/api/staff/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateStaff(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }
    res.json({
      success: true,
      message: 'Staff member updated successfully',
      staff: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not update staff member' });
  }
});

app.get('/api/staff/me/overview', async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  try {
    const staffMembers = await db.getStaff();
    const staffMember = staffMembers.find(s => s.user_id === currentUser?.id || s.email === currentUser?.email);
    if (!staffMember) return res.status(404).json({ error: 'Staff profile not found.' });
    const appointments = await db.getAppointments();

    const todayStr = new Date().toISOString().slice(0, 10);
    const staffAppointments = appointments.filter(a => a.staff_id === staffMember.id || a.staff_name === staffMember.name);

    const stats = {
      today: staffAppointments.filter(a => a.appointment_date === todayStr).length,
      pending: staffAppointments.filter(a => a.status === 'pending').length,
      confirmed: staffAppointments.filter(a => a.status === 'confirmed').length,
      completed: staffAppointments.filter(a => a.status === 'completed').length
    };

    res.json({ staff: staffMember, stats, appointments: staffAppointments });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load staff overview.' });
  }
});

app.get('/api/staff/me/availability', async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  try {
    const staffMembers = await db.getStaff();
    const staffMember = staffMembers.find(s => s.user_id === currentUser?.id || s.email === currentUser?.email);
    if (!staffMember) return res.status(404).json({ error: 'Staff profile not found.' });
    const appointments = await db.getAppointments();
    const availability = await db.getAvailability(staffMember.id);
    const busy = appointments.filter(a => a.staff_id === staffMember.id && a.status !== 'cancelled')
    .map(a => ({ date: a.appointment_date, start_time: a.start_time, end_time: a.end_time, status: 'booked' }));

    res.json({ availability, busy });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load staff availability.' });
  }
});

app.get('/api/availability/:staffId', async (req: Request, res: Response) => {
  const { staffId } = req.params;
  try {
    res.json({ availability: await db.getAvailability(staffId) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load availability.' });
  }
});

// ==========================================
// 6. Appointments
// ==========================================
app.get('/api/appointments/availability', (req: Request, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
  const duration = Number(req.query.duration) || 45;
  const slots = calculateSlots(date, duration);
  res.json({ slots });
});

app.get('/api/appointments', async (_req: Request, res: Response) => {
  try {
    res.json({ appointments: await db.getAppointments() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load appointments.' });
  }
});

app.get('/api/appointments/my', async (req: Request, res: Response) => {
  const currentUser = (req as any).user;
  if (!currentUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const appointments = await db.getAppointments();
    const userApts = appointments.filter(a => a.email?.toLowerCase() === currentUser.email?.toLowerCase() || a.customer_name?.toLowerCase() === currentUser.name?.toLowerCase());
    res.json({ appointments: userApts });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load appointments.' });
  }
});

app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      mobile_number,
      email,
      service_ids,
      appointment_date,
      start_time,
      end_time,
      payment_method,
      payment_status,
      transaction_reference,
      payment_screenshot,
      notes
    } = req.body;

    if (!customer_name || !mobile_number || !appointment_date || !start_time) {
      return res.status(400).json({ error: 'Please provide all required appointment details.' });
    }

    const bookedServices = db.services.filter(s =>
      service_ids && (service_ids.includes(s.id) || service_ids.includes(s._id))
    );

    const totalDuration = bookedServices.reduce((sum, s) => sum + s.duration, 0) || 45;
    const totalPrice = bookedServices.reduce((sum, s) => sum + s.price, 0) || 1200;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      _id: `apt-${Date.now()}`,
      booking_id: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name,
      customer_phone: mobile_number,
      mobile_number,
      email: email || '',
      service_name: bookedServices.map(s => s.name).join(', ') || 'Signature Treatment',
      services: bookedServices.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration })),
      staff_id: 'staff-1',
      staff_name: 'Sara Khan',
      appointment_date,
      start_time,
      end_time: end_time || '12:00',
      duration: totalDuration,
      total_duration: totalDuration,
      total_price: totalPrice,
      total_amount: totalPrice,
      status: 'pending',
      payment_method: payment_method || 'pay_at_salon',
      payment_status: payment_status || 'pending',
      transaction_reference: transaction_reference || null,
      payment_screenshot: payment_screenshot || null,
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    db.appointments.unshift(newAppointment);
    db.persist();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not create appointment' });
  }
});

app.put('/api/appointments/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const target = db.appointments.find(a => a.id === id || a._id === id);
  if (!target) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  target.status = status;
  if (status === 'completed') {
    target.payment_status = 'paid';
  }
  db.persist();

  res.json({
    success: true,
    message: `Appointment status updated to ${status}`,
    appointment: target
  });
});

// ==========================================
// 7. Customers & Role Management
// ==========================================
app.get('/api/customers', async (_req: Request, res: Response) => {
  try {
    res.json({ customers: await db.getCustomers() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load customers.' });
  }
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'staff', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid user role specified.' });
  }

  const updated = db.updateUser(id, { role: role as UserRole });
  if (!updated) {
    // Check if id matches a customer id
    const cust = db.customers.find(c => c.id === id || c.user_id === id);
    if (cust) {
      cust.role = role as UserRole;
      db.persist();
    }
  }

  res.json({
    success: true,
    message: `User role successfully changed to ${role}`
  });
});

// ==========================================
// 8. Payments & Billing
// ==========================================
app.get('/api/payments', (_req: Request, res: Response) => {
  const payments = db.getPayments();
  res.json({ payments });
});

// ==========================================
// 9. Admin Dashboard Metrics
// ==========================================
app.get('/api/dashboard', async (_req: Request, res: Response) => {
  try {
    res.json({ dashboard: await db.getDashboardStats() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Could not load dashboard.' });
  }
});

// ==========================================
// 10. API Root Endpoint
// ==========================================
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: '🌸 Aurelia Salon & Spa Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login, /api/auth/register',
      users: '/api/users',
      appointments: '/api/appointments',
      staff: '/api/staff',
      payments: '/api/payments',
      dashboard: '/api/dashboard'
    }
  });
});

export default app;
