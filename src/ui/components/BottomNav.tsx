import React from 'react';
import { Home, Sparkles, Calendar, Tag, User as UserIcon, Grid, Users, Clock, CheckCircle, Settings } from 'lucide-react';
import { useAuth, ScreenName } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface BottomNavProps {
  active: string;
}

export const CustomerBottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const { navigate } = useAuth();

  const items: { key: string; label: string; screen: ScreenName; icon: React.ReactNode }[] = [
    { key: 'Home', label: 'Home', screen: 'Home', icon: <Home size={19} /> },
    { key: 'Services', label: 'Services', screen: 'Services', icon: <Sparkles size={19} /> },
    { key: 'Appointments', label: 'Visits', screen: 'MyAppointments', icon: <Calendar size={19} /> },
    { key: 'Promotions', label: 'Offers', screen: 'Promotions', icon: <Tag size={19} /> },
    { key: 'Profile', label: 'Profile', screen: 'Profile', icon: <UserIcon size={19} /> }
  ];

  const currentTab = active === 'MyAppointments' ? 'Appointments' : active;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-2 pt-1 bg-[#F8F3EC]/90 backdrop-blur-md">
      <div className="max-w-xl mx-auto min-h-[64px] bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl flex items-center justify-around px-2 shadow-[0px_-4px_20px_rgba(58,36,28,0.08)]">
        {items.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm' : 'text-[#796A61] hover:text-[#3A241C]'
              }`}
            >
              <div className={isActive ? 'text-[#FFFDFC]' : 'text-[#796A61]'}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-[#FFFDFC]' : 'text-[#796A61]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const RoleBottomNav: React.FC<{ role: UserRole; active: string }> = ({ role, active }) => {
  const { navigate } = useAuth();

  const adminItems: { key: string; label: string; screen: ScreenName; icon: React.ReactNode }[] = [
    { key: 'Home', label: 'Dashboard', screen: 'Home', icon: <Grid size={19} /> },
    { key: 'Appointments', label: 'Bookings', screen: 'Appointments', icon: <Calendar size={19} /> },
    { key: 'Staff', label: 'Staff', screen: 'Staff', icon: <Users size={19} /> },
    { key: 'Services', label: 'Services', screen: 'Services', icon: <Sparkles size={19} /> },
    { key: 'Profile', label: 'Settings', screen: 'Profile', icon: <Settings size={19} /> }
  ];

  const staffItems: { key: string; label: string; screen: ScreenName; icon: React.ReactNode }[] = [
    { key: 'Home', label: 'Home', screen: 'Home', icon: <Home size={19} /> },
    { key: 'Appointments', label: 'Schedule', screen: 'Appointments', icon: <Calendar size={19} /> },
    { key: 'Schedule', label: 'Roster', screen: 'Schedule', icon: <Clock size={19} /> },
    { key: 'Availability', label: 'Hours', screen: 'Availability', icon: <CheckCircle size={19} /> },
    { key: 'Profile', label: 'Profile', screen: 'Profile', icon: <UserIcon size={19} /> }
  ];

  const items = role === 'admin' ? adminItems : staffItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-2 pt-1 bg-[#F8F3EC]/90 backdrop-blur-md">
      <div className="max-w-xl mx-auto min-h-[64px] bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl flex items-center justify-around px-2 shadow-[0px_-4px_20px_rgba(58,36,28,0.08)]">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'bg-[#3A241C] text-[#FFFDFC] shadow-sm' : 'text-[#796A61] hover:text-[#3A241C]'
              }`}
            >
              <div className={isActive ? 'text-[#FFFDFC]' : 'text-[#796A61]'}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-[#FFFDFC]' : 'text-[#796A61]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
