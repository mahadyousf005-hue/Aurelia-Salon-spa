import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopHeader } from './ui/components/TopHeader';
import { RoleSelectionScreen } from './ui/screens/auth/RoleSelectionScreen';
import { LoginScreen } from './ui/screens/auth/LoginScreen';
import { RegisterScreen } from './ui/screens/auth/RegisterScreen';
import { CustomerDashboard } from './ui/screens/customer/CustomerDashboard';
import { StaffDashboard } from './ui/screens/staff/StaffDashboard';
import { AdminDashboard } from './ui/screens/admin/AdminDashboard';
import { ServicesScreen } from './ui/screens/customer/ServicesScreen';
import { BookAppointmentScreen } from './ui/screens/customer/BookAppointmentScreen';
import { MyAppointmentsScreen } from './ui/screens/customer/MyAppointmentsScreen';
import { PromotionsScreen } from './ui/screens/customer/PromotionsScreen';
import { AdminAppointmentsScreen } from './ui/screens/admin/AdminAppointmentsScreen';
import { AdminStaffScreen } from './ui/screens/admin/AdminStaffScreen';
import { AdminCustomersScreen } from './ui/screens/admin/AdminCustomersScreen';
import { AdminAvailabilityScreen } from './ui/screens/admin/AdminAvailabilityScreen';
import { AdminPaymentsScreen } from './ui/screens/admin/AdminPaymentsScreen';
import { StaffScheduleScreen, StaffAvailabilityScreen } from './ui/screens/staff/StaffScheduleScreen';
import { ProfileScreen } from './ui/screens/common/ProfileScreen';
import { LoadingView } from './ui/components/LoadingView';
import { Smartphone, Monitor } from 'lucide-react';

const MainNavigator: React.FC = () => {
  const { currentScreen, user, isLoading } = useAuth();
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile'>('responsive');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] flex items-center justify-center">
        <LoadingView message="Welcome to Aurelia Salon & Spa..." fullScreen />
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'RoleSelection':
        return <RoleSelectionScreen />;
      case 'Login':
        return <LoginScreen />;
      case 'Register':
        return <RegisterScreen />;
      case 'Home':
        if (user?.role === 'admin') return <AdminDashboard />;
        if (user?.role === 'staff') return <StaffDashboard />;
        return <CustomerDashboard />;
      case 'Services':
        return <ServicesScreen />;
      case 'BookAppointment':
        return <BookAppointmentScreen />;
      case 'MyAppointments':
        return <MyAppointmentsScreen />;
      case 'Appointments':
        return <AdminAppointmentsScreen />;
      case 'Promotions':
        return <PromotionsScreen />;
      case 'Staff':
        return <AdminStaffScreen />;
      case 'Schedule':
        return <StaffScheduleScreen />;
      case 'Availability':
        return <StaffAvailabilityScreen />;
      case 'AdminAvailability':
        return <AdminAvailabilityScreen />;
      case 'Customers':
        return <AdminCustomersScreen />;
      case 'Payments':
        return <AdminPaymentsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <RoleSelectionScreen />;
    }
  };

  const isAuthScreen = currentScreen === 'RoleSelection' || currentScreen === 'Login' || currentScreen === 'Register';

  return (
    <div className="min-h-screen bg-[#F8F3EC] text-[#2E211C] flex flex-col font-sans">
      
      {/* Device View Mode Toggle for Desktop testing */}
      <div className="hidden lg:flex fixed top-3 right-4 z-50 items-center bg-[#FFFDFC]/90 backdrop-blur-md border border-[#E6D9CC] rounded-full p-1 shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setDeviceMode('responsive')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            deviceMode === 'responsive'
              ? 'bg-[#3A241C] text-[#FFFDFC]'
              : 'text-[#796A61] hover:text-[#241611]'
          }`}
        >
          <Monitor size={13} />
          <span>Full Layout</span>
        </button>
        <button
          type="button"
          onClick={() => setDeviceMode('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            deviceMode === 'mobile'
              ? 'bg-[#3A241C] text-[#FFFDFC]'
              : 'text-[#796A61] hover:text-[#241611]'
          }`}
        >
          <Smartphone size={13} />
          <span>Phone Frame</span>
        </button>
      </div>

      {deviceMode === 'mobile' ? (
        <div className="min-h-screen bg-[#241611] py-8 px-4 flex items-center justify-center">
          <div className="w-[410px] h-[860px] bg-[#F8F3EC] rounded-[48px] border-[10px] border-[#3A241C] shadow-[0px_25px_70px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
            {/* Phone Notch */}
            <div className="h-6 bg-[#3A241C] w-36 mx-auto rounded-b-2xl flex items-center justify-center">
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {!isAuthScreen && <TopHeader showBack={currentScreen !== 'Home'} />}
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {renderScreen()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {!isAuthScreen && <TopHeader showBack={currentScreen !== 'Home'} />}
          <main className="flex-1">
            {renderScreen()}
          </main>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
