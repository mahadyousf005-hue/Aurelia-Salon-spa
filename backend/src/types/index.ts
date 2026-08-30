export type UserRole = "customer" | "staff" | "admin";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
  avatar?: string;
  specialization?: string;
}

export interface SalonService {
  id: string;
  _id?: string;
  name: string;
  category: "Hair" | "Facial" | "Massage" | "Nails" | "Makeup" | "Spa" | "Waxing" | "Other" | string;
  price: number;
  duration: number; // in minutes
  description: string;
  image: string;
  rating?: number;
  average_rating?: number;
  averageRating?: number;
  status?: string;
}

export interface AppointmentServiceItem {
  id?: string;
  _id?: string;
  service_id?: string;
  name: string;
  price?: number;
  duration?: number;
}

export interface Appointment {
  id: string;
  _id?: string;
  booking_id?: string;
  customer_name: string;
  customer_phone?: string;
  mobile_number?: string;
  email?: string;
  service_name?: string;
  services?: AppointmentServiceItem[];
  staff_id?: string;
  staff_name?: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  total_duration?: number;
  total_price?: number;
  total_amount?: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment_method?: "pay_at_salon" | "cash" | "online_payment" | string;
  payment_status?: "pending" | "verification_pending" | "paid" | "completed" | string;
  transaction_reference?: string | null;
  payment_screenshot?: string | null;
  notes?: string;
  created_at?: string;
}

export interface Promotion {
  id: string;
  _id?: string;
  title: string;
  description: string;
  discount: string;
  discount_type?: string;
  discount_value?: number;
  code?: string;
  start_date: string;
  end_date: string;
  category?: string;
  image: string;
  badge?: string;
}

export interface StaffMember {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: "Active" | "On Break" | "Off Duty" | string;
  rating?: number;
  experience?: string;
  services?: { _id: string; name: string; duration: number; price?: number }[];
}

export interface AvailabilitySlot {
  _id?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Customer {
  id: string;
  _id?: string;
  user_id?: string;
  userId?: string;
  user?: { id: string };
  name: string;
  email: string;
  phone: string;
  total_visits?: number;
  last_visit?: string;
  role?: UserRole;
}

export interface PaymentRecord {
  id: string;
  _id?: string;
  booking_id?: string;
  service_name: string;
  customer_name: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  paid_at: string;
}

export interface DashboardStats {
  customers: number;
  staff: number;
  services: number;
  appointments: number;
  pendingAppointments: number;
  revenue: number;
}
