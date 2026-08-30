import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Check, CheckCheck, X, CreditCard, Tag, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Appointment } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { RoleBottomNav, CustomerBottomNav } from '../../components/BottomNav';

export const AdminAppointmentsScreen: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/appointments');
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await apiRequest(`/appointments/${id}/status`, 'PUT', { status });
      await loadAppointments();
    } catch (err: any) {
      alert(err.message || 'Error updating appointment');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading salon appointments..." fullScreen />
        <RoleBottomNav role={user?.role || 'admin'} active="Appointments" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            BOOKINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Appointments
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Keep every salon visit beautifully organized and monitored.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === status
                  ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm'
                  : 'bg-[#FFFDFC] border border-[#E6D9CC] text-[#796A61] hover:border-[#C9A66B]'
              }`}
            >
              {status} ({status === 'all' ? appointments.length : appointments.filter(a => a.status === status).length})
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id || apt._id}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-5 shadow-[0px_6px_20px_rgba(58,36,28,0.06)] hover:border-[#C9A66B] transition-all"
            >
              <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#241611]">
                      Appointment #{apt.booking_id || String(apt.id || apt._id).slice(-6)}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#796A61]">
                      <Clock size={12} className="text-[#C9A66B]" />
                      <span>{apt.appointment_date} · {apt.start_time} - {apt.end_time || '12:00'}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider capitalize ${
                    apt.status === 'confirmed'
                      ? 'bg-[#F1F6F0] text-[#58745A]'
                      : apt.status === 'completed'
                      ? 'bg-[#EFE5D8] text-[#3A241C]'
                      : apt.status === 'cancelled'
                      ? 'bg-[#FFF5F3] text-[#A45145]'
                      : 'bg-[#FCF9F5] text-[#C9A66B]'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Appointment Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#796A61] mb-3">
                <div>
                  <span className="font-bold text-[#241611] block">Customer:</span>
                  <span className="text-[#2E211C] font-semibold">{apt.customer_name}</span>
                  <span className="block text-[#796A61]">{apt.mobile_number || apt.customer_phone || 'No phone'}</span>
                </div>

                <div>
                  <span className="font-bold text-[#241611] block">Assigned Stylist:</span>
                  <span className="text-[#2E211C] font-semibold">{apt.staff_name || 'Sara Khan'}</span>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <span className="font-bold text-[#241611]">Services: </span>
                  <span className="text-[#2E211C]">
                    {apt.services && apt.services.length > 0
                      ? apt.services.map((s) => s.name).join(', ')
                      : apt.service_name || 'Signature Salon Service'}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-[#241611]">Payment Method: </span>
                  <span className="capitalize">{apt.payment_method?.replace(/_/g, ' ') || 'Pay at Salon'}</span>
                </div>

                <div>
                  <span className="font-bold text-[#241611]">Payment Status: </span>
                  <span className="capitalize font-semibold text-[#58745A]">
                    {apt.payment_status?.replace(/_/g, ' ') || 'Pending'}
                  </span>
                </div>

                {apt.transaction_reference && (
                  <div className="sm:col-span-2 bg-[#F8F3EC] p-2 rounded-lg font-mono text-[11px] text-[#3A241C]">
                    Transaction ID: {apt.transaction_reference}
                  </div>
                )}

                {apt.notes && (
                  <div className="sm:col-span-2 italic text-[#796A61]">
                    Notes: "{apt.notes}"
                  </div>
                )}
              </div>

              {/* Bottom Actions & Price */}
              <div className="pt-3 border-t border-[#E6D9CC] flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-extrabold text-[#6B4A3A]">
                  Total: Rs {(apt.total_price || apt.total_amount || 0).toLocaleString()}
                </div>

                <div className="flex flex-wrap gap-2">
                  {apt.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id || apt._id!, 'confirmed')}
                      className="px-3 py-1.5 bg-[#F1F6F0] border border-[#58745A] text-[#58745A] text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#e2ede0] transition-colors"
                    >
                      <Check size={14} />
                      <span>Confirm</span>
                    </button>
                  )}

                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id || apt._id!, 'completed')}
                      className="px-3 py-1.5 bg-[#EFE5D8] border border-[#C9A66B] text-[#3A241C] text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#E4D1AD] transition-colors"
                    >
                      <CheckCheck size={14} />
                      <span>Complete</span>
                    </button>
                  )}

                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id || apt._id!, 'cancelled')}
                      className="px-3 py-1.5 bg-[#FFF5F3] border border-[#E2C7C2] text-[#A45145] text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#FFEAE6] transition-colors"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <EmptyState
              icon={<Calendar size={28} />}
              title="No Appointments Found"
              text={`No appointments found with '${filter}' status.`}
            />
          )}
        </div>

      </div>

      <RoleBottomNav role={user?.role || 'admin'} active="Appointments" />
    </div>
  );
};
