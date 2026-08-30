import React, { useState, useEffect } from 'react';
import { Clock, User, Calendar, CheckCircle } from 'lucide-react';
import { apiRequest } from '../../../data/api';
import { Appointment } from '../../../types';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { RoleBottomNav } from '../../components/BottomNav';

export const StaffScheduleScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/staff/me/overview');
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading assigned schedule..." fullScreen />
        <RoleBottomNav role="staff" active="Schedule" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-3xl mx-auto px-4 pt-4">
        
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            STAFF WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            My Schedule
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Your assigned client appointments from the database.
          </p>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id || apt._id}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-2 mb-2">
                <div className="flex items-center gap-2 text-[#3A241C] font-bold text-sm">
                  <Clock size={16} className="text-[#C9A66B]" />
                  <span>{apt.start_time} - {apt.end_time || '12:00'}</span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#F1F6F0] text-[#58745A] uppercase capitalize">
                  {apt.status}
                </span>
              </div>

              <div className="text-xs text-[#796A61] space-y-1">
                <p className="font-bold text-[#241611] text-sm">
                  {apt.services?.map((s) => s.name).join(' + ') || apt.service_name}
                </p>
                <p className="flex items-center gap-1.5">
                  <User size={13} className="text-[#C9A66B]" />
                  <span>Customer: <strong className="text-[#241611]">{apt.customer_name}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#C9A66B]" />
                  <span>Date: {apt.appointment_date}</span>
                </p>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <EmptyState
              icon={<Clock size={28} />}
              title="No Schedule Entries"
              text="No assigned schedule items found for this period."
            />
          )}
        </div>

      </div>

      <RoleBottomNav role="staff" active="Schedule" />
    </div>
  );
};

export const StaffAvailabilityScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/staff/me/availability');
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading working hours & breaks..." fullScreen />
        <RoleBottomNav role="staff" active="Availability" />
      </div>
    );
  }

  const availability = data?.availability || [];
  const busy = data?.busy || [];

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-3xl mx-auto px-4 pt-4">
        
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            STAFF WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Availability
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Working hours, break intervals, and busy appointment slots.
          </p>
        </div>

        <h2 className="font-serif-luxury font-bold text-base text-[#241611] mb-3">
          Weekly Working Hours
        </h2>

        <div className="space-y-2.5 mb-6">
          {availability.map((entry: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
            >
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#241611]">
                  {dayNames[entry.day_of_week]}
                </h3>
                <span className="text-[11px] text-[#796A61]">
                  Duty: {entry.start_time} - {entry.end_time}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#C9A66B] block">
                  BREAK WINDOW
                </span>
                <span className="text-xs font-semibold text-[#6B4A3A]">
                  {entry.break_start || 'None'} - {entry.break_end || 'None'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-serif-luxury font-bold text-base text-[#241611] mb-3">
          Busy Appointments Time
        </h2>

        <div className="space-y-2">
          {busy.map((slot: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-3 text-xs text-[#796A61] flex items-center justify-between"
            >
              <span>{slot.date} · {slot.start_time} - {slot.end_time}</span>
              <span className="font-bold text-[#A45145] uppercase">{slot.status}</span>
            </div>
          ))}
          {busy.length === 0 && (
            <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 text-center text-xs text-[#796A61]">
              <CheckCircle size={20} className="text-[#58745A] mx-auto mb-1" />
              <span>No busy appointment clashes for this week.</span>
            </div>
          )}
        </div>

      </div>

      <RoleBottomNav role="staff" active="Availability" />
    </div>
  );
};
