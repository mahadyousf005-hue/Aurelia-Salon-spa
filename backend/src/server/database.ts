import 'dotenv/config';
import dotenv from 'dotenv';
import {
  INITIAL_SERVICES,
  INITIAL_PROMOTIONS,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_AVAILABILITY
} from '../data/salonData';
import {
  User,
  SalonService,
  Promotion,
  StaffMember,
  Customer,
  Appointment,
  PaymentRecord,
  AvailabilitySlot
} from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: new URL('../../.env', import.meta.url), override: true });

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);
export const verifyPassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

// In-Memory Database with Pre-Seeded Production Records
class SalonDatabase {
  users: Array<User & { passwordHash?: string }> = [
    { id: 'usr-admin-1', name: 'Aurelia Administrator', email: 'admin@aurelia.local', phone: '+92 314 9512707', role: 'admin', passwordHash: hashPassword('Demo123!') },
    { id: 'usr-staff-1', name: 'Sara Khan', email: 'sara.khan@aurelia.local', phone: '+92 314 9512707', role: 'staff', passwordHash: hashPassword('Staff123!') },
    { id: 'usr-customer-1', name: 'Ayesha Malik', email: 'customer@aurelia.local', phone: '+92 300 9876543', role: 'customer', passwordHash: hashPassword('Demo123!') }
  ];

  services: SalonService[] = [...INITIAL_SERVICES];
  promotions: Promotion[] = [...INITIAL_PROMOTIONS];
  staff: StaffMember[] = [...INITIAL_STAFF];
  customers: Customer[] = [...INITIAL_CUSTOMERS];
  appointments: Appointment[] = [...INITIAL_APPOINTMENTS];
  availability: Record<string, AvailabilitySlot[]> = { ...INITIAL_AVAILABILITY };
  private readonly supabase: SupabaseClient | null;
  readonly ready: Promise<void>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;
    this.ready = this.loadSupabaseState();
    void this.ready.catch(error => console.error(error));
  }

  private async loadSupabaseState() {
    if (!this.supabase) return;
    const { data, error } = await this.supabase.from('salon_state').select('*').eq('id', true).maybeSingle();
    if (error) throw new Error(`Supabase state load failed: ${error.message}`);
    if (data) {
      this.users = data.users || this.users;
      this.services = data.services || this.services;
      this.promotions = data.promotions || this.promotions;
      this.staff = data.staff || this.staff;
      this.customers = data.customers || this.customers;
      this.appointments = data.appointments || this.appointments;
      this.availability = data.availability || this.availability;
    }

    const [usersResult, servicesResult, promotionsResult, staffResult, customersResult, appointmentsResult, availabilityResult] = await Promise.all([
      this.supabase.from('users').select('*'),
      this.supabase.from('services').select('*'),
      this.supabase.from('promotions').select('*'),
      this.supabase.from('staff').select('*'),
      this.supabase.from('customers').select('*'),
      this.supabase.from('appointments').select('*'),
      this.supabase.from('availability').select('*')
    ]);
    const queryError = usersResult.error || servicesResult.error || promotionsResult.error || staffResult.error || customersResult.error || appointmentsResult.error || availabilityResult.error;
    if (queryError) throw new Error(`Supabase relational data load failed: ${queryError.message}`);
    this.users = (usersResult.data || []).map(user => ({ ...user, passwordHash: user.password_hash }));
    this.services = servicesResult.data || [];
    this.promotions = promotionsResult.data || [];
    this.staff = staffResult.data || [];
    this.customers = customersResult.data || [];
    this.appointments = appointmentsResult.data || [];
    this.availability = (availabilityResult.data || []).reduce<Record<string, AvailabilitySlot[]>>((slots, row) => {
      const { staff_id, id: _id, ...availability } = row;
      if (!slots[staff_id]) slots[staff_id] = [];
      slots[staff_id].push(availability as AvailabilitySlot);
      return slots;
    }, {});
  }

  persist() {
    void this.persistRemote().catch(error => console.error(error));
  }

  private async persistRemote() {
    if (!this.supabase) return;
    const { error } = await this.supabase.from('salon_state').upsert({ id: true, users: this.users, services: this.services, promotions: this.promotions, staff: this.staff, customers: this.customers, appointments: this.appointments, availability: this.availability, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase state save failed: ${error.message}`);
    await this.persistRemoteTables();
  }

  private async persistRemoteTables() {
    if (!this.supabase) throw new Error('Supabase server configuration is missing.');
    const { error: usersError } = await this.supabase.from('users').upsert(this.users.map(user => ({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, password_hash: user.passwordHash || 'managed-by-supabase-auth' })), { onConflict: 'id' });
    if (usersError) throw new Error(`Supabase users save failed: ${usersError.message}`);
    const { error: customersError } = await this.supabase.from('customers').upsert(this.customers.map(customer => ({ id: customer.id, user_id: this.users.some(user => user.id === customer.user_id) ? customer.user_id : null, name: customer.name, email: customer.email, phone: customer.phone, total_visits: customer.total_visits, last_visit: (customer as Customer & { last_visit?: string }).last_visit, role: customer.role })), { onConflict: 'id' });
    if (customersError) throw new Error(`Supabase customers save failed: ${customersError.message}`);
    const { error: staffError } = await this.supabase.from('staff').upsert(this.staff.map(member => ({ id: member.id, user_id: (member as StaffMember & { user_id?: string }).user_id, name: member.name, email: member.email, phone: member.phone, specialization: member.specialization, experience: member.experience, rating: member.rating, status: member.status, services: member.services })), { onConflict: 'id' });
    if (staffError) throw new Error(`Supabase staff save failed: ${staffError.message}`);
    const { error: servicesError } = await this.supabase.from('services').upsert(this.services.map(service => ({ id: service.id, name: service.name, category: service.category, price: service.price, duration: service.duration, description: service.description, image: service.image, rating: service.rating || 5, status: service.status || 'Active' })), { onConflict: 'id' });
    if (servicesError) throw new Error(`Supabase services save failed: ${servicesError.message}`);
    const { error: promotionsError } = await this.supabase.from('promotions').upsert(this.promotions.map(promotion => { const item = promotion as Promotion & { discount_type?: string; discount_value?: number; start_date?: string }; return { id: item.id, title: item.title, description: item.description, discount: item.discount, discount_type: item.discount_type, discount_value: item.discount_value, code: item.code, start_date: item.start_date, end_date: item.end_date, category: item.category, badge: item.badge, image: item.image }; }), { onConflict: 'id' });
    if (promotionsError) throw new Error(`Supabase promotions save failed: ${promotionsError.message}`);
    const { error: appointmentsError } = await this.supabase.from('appointments').upsert(this.appointments.map(appointment => ({ id: appointment.id, booking_id: appointment.booking_id || appointment.id, customer_name: appointment.customer_name, customer_phone: appointment.customer_phone || appointment.mobile_number || '', mobile_number: appointment.mobile_number || appointment.customer_phone || '', email: appointment.email, service_name: appointment.service_name || '', services: appointment.services || [], staff_id: appointment.staff_id, staff_name: appointment.staff_name, appointment_date: appointment.appointment_date, start_time: appointment.start_time, end_time: appointment.end_time || '00:00', duration: appointment.duration || appointment.total_duration || 45, total_duration: appointment.total_duration || appointment.duration || 45, total_price: appointment.total_price || appointment.total_amount || 0, total_amount: appointment.total_amount || appointment.total_price || 0, status: appointment.status, payment_method: appointment.payment_method || 'pay_at_salon', payment_status: ['pending', 'paid', 'failed'].includes(appointment.payment_status || '') ? appointment.payment_status : 'pending', transaction_reference: appointment.transaction_reference, payment_screenshot: appointment.payment_screenshot, notes: appointment.notes || '', created_at: appointment.created_at })), { onConflict: 'id' });
    if (appointmentsError) throw new Error(`Supabase appointments save failed: ${appointmentsError.message}`);
  }

  // Helper Methods
  findUserByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    return this.users.find(u => u.email.toLowerCase() === clean);
  }

  findUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  async getStaff() {
    if (!this.supabase) return this.staff;
    const { data, error } = await this.supabase.from('staff').select('*').order('created_at', { ascending: true });
    if (error) throw new Error(`Supabase staff load failed: ${error.message}`);
    return data || [];
  }

  async getServices() {
    if (!this.supabase) return this.services;
    const { data, error } = await this.supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) throw new Error(`Supabase services load failed: ${error.message}`);
    return data || [];
  }

  async getPromotions() {
    if (!this.supabase) return this.promotions;
    const { data, error } = await this.supabase.from('promotions').select('*').order('created_at', { ascending: true });
    if (error) throw new Error(`Supabase promotions load failed: ${error.message}`);
    return data || [];
  }

  async getCustomers() {
    if (!this.supabase) return this.customers;
    const { data, error } = await this.supabase.from('customers').select('*').order('created_at', { ascending: true });
    if (error) throw new Error(`Supabase customers load failed: ${error.message}`);
    return data || [];
  }

  async getAppointments() {
    if (!this.supabase) return this.appointments;
    const { data, error } = await this.supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(`Supabase appointments load failed: ${error.message}`);
    return data || [];
  }

  async getAvailability(staffId: string) {
    if (!this.supabase) return this.availability[staffId] || [];
    const { data, error } = await this.supabase.from('availability').select('day_of_week, start_time, end_time, break_start, break_end').eq('staff_id', staffId).order('day_of_week', { ascending: true });
    if (error) throw new Error(`Supabase availability load failed: ${error.message}`);
    return data || [];
  }

  async getDashboardStats() {
    if (!this.supabase) return this.getDashboardStatsFromMemory();
    const [customers, staff, services, appointments] = await Promise.all([
      this.supabase.from('customers').select('*', { count: 'exact', head: true }),
      this.supabase.from('staff').select('*', { count: 'exact', head: true }),
      this.supabase.from('services').select('*', { count: 'exact', head: true }),
      this.supabase.from('appointments').select('status, payment_status, total_price, total_amount')
    ]);
    const queryError = customers.error || staff.error || services.error || appointments.error;
    if (queryError) throw new Error(`Supabase dashboard load failed: ${queryError.message}`);
    const rows = appointments.data || [];
    return {
      customers: customers.count || 0,
      staff: staff.count || 0,
      services: services.count || 0,
      appointments: rows.length,
      pendingAppointments: rows.filter(appointment => appointment.status === 'pending').length,
      revenue: rows.filter(appointment => appointment.payment_status === 'paid' || appointment.status === 'completed').reduce((sum, appointment) => sum + Number(appointment.total_price || appointment.total_amount || 0), 0)
    };
  }

  private getDashboardStatsFromMemory() {
    const revenue = this.appointments.filter(a => a.payment_status === 'paid' || a.status === 'completed').reduce((sum, a) => sum + (a.total_price || a.total_amount || 0), 0);
    return { customers: this.customers.length, staff: this.staff.length, services: this.services.length, appointments: this.appointments.length, pendingAppointments: this.appointments.filter(a => a.status === 'pending').length, revenue };
  }

  async createUser(user: User & { passwordHash?: string }) {
    this.users.push(user);
    // Also add to customers if customer role
    if (user.role === 'customer') {
      this.customers.push({
        id: `cust-${Date.now()}`,
        user_id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "+92 300 0000000",
        total_visits: 0,
        role: "customer"
      });
    } else if (user.role === 'staff') {
      this.staff.push({
        id: `staff-${user.id}`,
        _id: `staff-${user.id}`,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        specialization: 'Staff Member',
        experience: 'New',
        rating: 5,
        status: 'Active',
        services: []
      });
    }
    await this.persistRemote();
    return user;
  }

  updateUser(id: string, updates: Partial<User>) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    
    // Update matching customer profile as well
    const cust = this.customers.find(c => c.user_id === id || c.email === user.email);
    if (cust) {
      if (updates.name) cust.name = updates.name;
      if (updates.phone) cust.phone = updates.phone;
      if (updates.role) cust.role = updates.role;
    }
    this.persist();
    return user;
  }

  // Services
  addService(service: SalonService) {
    this.services.unshift(service);
    this.persist();
    return service;
  }

  deleteService(id: string) {
    const idx = this.services.findIndex(s => s.id === id || s._id === id);
    if (idx !== -1) {
      const removed = this.services.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  updateService(id: string, updates: Partial<SalonService>) {
    const service = this.services.find(s => s.id === id || s._id === id);
    if (!service) return null;
    Object.assign(service, updates);
    this.persist();
    return service;
  }

  // Staff
  addStaff(member: StaffMember) {
    this.staff.push(member);
    if (!this.availability[member.id]) {
      this.availability[member.id] = [
        { day_of_week: 1, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
        { day_of_week: 2, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
        { day_of_week: 3, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
        { day_of_week: 4, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
        { day_of_week: 5, start_time: "09:00", end_time: "18:00", break_start: "13:00", break_end: "14:00" },
        { day_of_week: 6, start_time: "10:00", end_time: "19:00", break_start: "14:00", break_end: "15:00" }
      ];
    }
    if (!this.findUserByEmail(member.email)) {
      this.users.push({
        id: `usr-${member.id}`,
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: "staff"
      });
    }
    this.persist();
    return member;
  }

  deleteStaff(id: string) {
    const idx = this.staff.findIndex(s => s.id === id || s._id === id);
    if (idx !== -1) {
      const removed = this.staff.splice(idx, 1)[0];
      delete this.availability[id];
      delete this.availability[removed.id];
      this.persist();
      return removed;
    }
    return null;
  }

  updateStaff(id: string, updates: Partial<StaffMember>) {
    const member = this.staff.find(s => s.id === id || s._id === id);
    if (!member) return null;
    Object.assign(member, updates);
    this.persist();
    return member;
  }

  getPayments(): PaymentRecord[] {
    return this.appointments.map((a, i) => ({
      id: `pay-${i + 1}`,
      booking_id: a.booking_id || a.id,
      service_name: a.service_name || a.services?.[0]?.name || "Salon Treatment",
      customer_name: a.customer_name,
      amount: a.total_price || a.total_amount || 1500,
      payment_method: a.payment_method || "pay_at_salon",
      payment_status: a.payment_status || "pending",
      paid_at: a.appointment_date || new Date().toISOString().slice(0, 10)
    }));
  }

}

export const db = new SalonDatabase();
