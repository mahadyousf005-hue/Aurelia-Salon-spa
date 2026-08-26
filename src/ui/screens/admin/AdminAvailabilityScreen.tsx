import React, { useState, useEffect } from 'react';
import { Clock, UserCheck, Calendar } from 'lucide-react';
import { StaffMember } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { RoleBottomNav } from '../../components/BottomNav';

export const AdminAvailabilityScreen: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    loadAllAvailability();
  }, []);

  const loadAllAvailability = async () => {
    try {
      setLoading(true);
      const staffRes = await apiRequest('/staff');
      const team: StaffMember[] = staffRes.staff || [];
      setStaff(team);

      const map: Record<string, any[]> = {};
      for (const member of team) {
        const id = member.id || member._id;
        try {
          const availRes = await apiRequest(`/availability/${id}`);
          map[id] = availRes.availability || [];
        } catch (e) {
          map[id] = [];
        }
      }
      setAvailabilityMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading staff working hours..." fullScreen />
        <RoleBottomNav role="admin" active="Home" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            OPERATIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Staff Availability
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Review working hours, scheduled shift blocks and break windows across all staff.
          </p>
        </div>

        <div className="space-y-4">
          {staff.map((person) => {
            const id = person.id || person._id;
            const entries = availabilityMap[id] || [];

            return (
              <div
                key={id}
                className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-5 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#241611]">
                      {person.name}
                    </h3>
                    <span className="text-xs text-[#6B4A3A] font-semibold">
                      {person.specialization}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold px-2.5 py-1 bg-[#F1F6F0] text-[#58745A] rounded-full uppercase">
                    {person.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-2">
                  {entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F8F3EC] rounded-xl p-2.5 flex items-center justify-between text-xs text-[#2E211C]"
                    >
                      <span className="font-bold">{dayNames[entry.day_of_week] || `Day ${entry.day_of_week}`}:</span>
                      <span>Duty: {entry.start_time} - {entry.end_time}</span>
                      <span className="text-[#796A61]">Break: {entry.break_start || 'None'} - {entry.break_end || 'None'}</span>
                    </div>
                  ))}

                  {entries.length === 0 && (
                    <p className="text-xs text-[#796A61] italic py-1">
                      Standard working roster: Mon-Sat 09:00 - 18:00 (Break: 13:00 - 14:00)
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <RoleBottomNav role="admin" active="Home" />
    </div>
  );
};
