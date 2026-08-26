import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Sparkles, CreditCard, Tag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Appointment } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { CustomerBottomNav } from '../../components/BottomNav';

export const MyAppointmentsScreen: React.FC = () => {
  const { navigate } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/appointments/my');
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return 'bg-[#F1F6F0] text-[#58745A] border-[#58745A]/30';
    }
    if (status === 'completed') {
      return 'bg-[#EFE5D8] text-[#3A241C] border-[#C9A66B]/40';
    }
    if (status === 'cancelled') {
      return 'bg-[#FFF5F3] text-[#A45145] border-[#A45145]/30';
    }
    return 'bg-[#FCF9F5] text-[#C9A66B] border-[#C9A66B]/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading your appointments..." fullScreen />
        <CustomerBottomNav active="MyAppointments" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            YOUR VISITS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            My Appointments
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Your upcoming and previous salon visits.
          </p>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id || apt._id}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-5 shadow-[0px_6px_22px_rgba(58,36,28,0.06)]"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#241611]">
                      Appointment #{apt.booking_id || String(apt.id || apt._id).slice(-6)}
                    </h3>
                    <span className="text-[11px] text-[#796A61]">
                      {apt.appointment_date} at {apt.start_time}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider capitalize ${getStatusBadge(
                    apt.status
                  )}`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Body Details */}
              <div className="space-y-2 text-xs text-[#796A61]">
                <div className="flex items-start gap-2">
                  <Sparkles size={14} className="text-[#C9A66B] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-[#241611]">Services: </span>
                    <span>
                      {apt.services && apt.services.length > 0
                        ? apt.services.map((s) => s.name).join(', ')
                        : apt.service_name || 'Signature Salon Service'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#C9A66B] flex-shrink-0" />
                  <span>
                    Stylist: <strong className="text-[#241611]">{apt.staff_name || 'Assigned Stylist'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-[#C9A66B] flex-shrink-0" />
                  <span>
                    Payment: <strong className="text-[#241611] capitalize">{apt.payment_method?.replace(/_/g, ' ')}</strong> (
                    <span className="capitalize">{apt.payment_status?.replace(/_/g, ' ')}</span>)
                  </span>
                </div>

                {apt.transaction_reference && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-[#C9A66B] flex-shrink-0" />
                    <span>
                      Ref ID: <strong className="text-[#241611] font-mono">{apt.transaction_reference}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Summary */}
              <div className="mt-4 pt-3 border-t border-[#E6D9CC] flex items-center justify-between">
                <span className="text-xs font-bold text-[#796A61]">
                  Total Amount
                </span>
                <span className="text-base font-extrabold text-[#6B4A3A]">
                  Rs {(apt.total_price || apt.total_amount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <EmptyState
              icon={<Calendar size={28} />}
              title="No Appointments Found"
              text="You do not have any appointments scheduled yet."
              actionText="Book New Appointment"
              onAction={() => navigate('BookAppointment')}
            />
          )}
        </div>

      </div>

      <CustomerBottomNav active="MyAppointments" />
    </div>
  );
};
