import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Award, User, Phone, Check, CheckCheck, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Appointment, StaffMember } from '../../../types';
import { apiRequest } from '../../../data/api';
import { StatCard } from '../../components/StatCard';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { RoleBottomNav } from '../../components/BottomNav';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<{
    staff?: StaffMember;
    stats?: { today: number; pending: number; confirmed: number; completed: number };
    appointments?: Appointment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/staff/me/overview');
      setOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await apiRequest(`/appointments/${id}/status`, 'PUT', { status });
      await loadOverview();
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading staff workspace..." fullScreen />
        <RoleBottomNav role="staff" active="Home" />
      </div>
    );
  }

  const staff = overview?.staff;
  const stats = overview?.stats || { today: 3, pending: 1, confirmed: 2, completed: 1 };
  const appointments = overview?.appointments || [];

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            STAFF WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Welcome, {user?.name || staff?.name || 'Sara Khan'}
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            {staff?.specialization || 'Master Hair Stylist & Colorist'} · <span className="text-[#58745A] font-bold">Active</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-between mb-6">
          <StatCard
            icon={<Calendar size={20} />}
            title="Today"
            value={stats.today}
          />
          <StatCard
            icon={<Clock size={20} />}
            title="Pending"
            value={stats.pending}
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            title="Confirmed"
            value={stats.confirmed}
          />
          <StatCard
            icon={<Award size={20} />}
            title="Completed"
            value={stats.completed}
          />
        </div>

        {/* My Assigned Services */}
        <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-5 mb-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-[#C9A66B]" />
            <h2 className="font-serif-luxury font-bold text-base text-[#241611]">
              My Assigned Qualifications
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(staff?.services || [
              { name: 'Signature Haircut & Style', duration: 45 },
              { name: 'Keratin Smooth Rebonding', duration: 180 },
              { name: 'Balayage & Highlights', duration: 120 }
            ]).map((svc, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-[#F8F3EC] border border-[#E6D9CC] rounded-xl text-xs font-semibold text-[#3A241C]"
              >
                • {svc.name} <span className="text-[#796A61] text-[10px]">({svc.duration} min)</span>
              </span>
            ))}
          </div>
        </div>

        {/* My Schedule / Live Appointments */}
        <div className="mb-4">
          <h2 className="font-serif-luxury font-bold text-lg text-[#241611] mb-3">
            Today & Upcoming Schedule
          </h2>

          <div className="space-y-3.5">
            {appointments.map((apt) => (
              <div
                key={apt.id || apt._id}
                className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs hover:border-[#C9A66B] transition-all"
              >
                <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-2.5 mb-2.5">
                  <div>
                    <h3 className="font-bold text-sm text-[#241611]">
                      {apt.services && apt.services.length > 0
                        ? apt.services.map((s) => s.name).join(' + ')
                        : apt.service_name || 'Salon Treatment'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#796A61] mt-0.5">
                      <Clock size={13} className="text-[#C9A66B]" />
                      <span>{apt.start_time} - {apt.end_time || '12:00'} ({apt.duration || 45} min)</span>
                      <span>· {apt.appointment_date}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider capitalize ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#796A61] mb-3">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-[#C9A66B]" />
                    <span>Client: <strong className="text-[#241611]">{apt.customer_name}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-[#C9A66B]" />
                    <span>Phone: <strong className="text-[#241611]">{apt.mobile_number || apt.customer_phone || '+92 300 0000000'}</strong></span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E6D9CC]/60">
                  {apt.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id || apt._id!, 'confirmed')}
                      className="px-3.5 py-1.5 bg-[#F8F3EC] border border-[#C9A66B] text-[#3A241C] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#EFE5D8] transition-colors"
                    >
                      <Check size={14} className="text-[#58745A]" />
                      <span>Confirm Appointment</span>
                    </button>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(apt.id || apt._id!, 'completed')}
                      className="px-3.5 py-1.5 bg-[#F1F6F0] border border-[#58745A] text-[#58745A] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#e4ede3] transition-colors"
                    >
                      <CheckCheck size={14} />
                      <span>Mark Completed</span>
                    </button>
                  )}

                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
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
            ))}

            {appointments.length === 0 && (
              <EmptyState
                icon={<Calendar size={28} />}
                title="No Appointments Assigned"
                text="You currently have no bookings assigned to your schedule."
              />
            )}
          </div>
        </div>

      </div>

      <RoleBottomNav role="staff" active="Home" />
    </div>
  );
};
