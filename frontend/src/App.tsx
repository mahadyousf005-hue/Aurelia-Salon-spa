import React from 'react';
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

const MainNavigator: React.FC = () => {
  const { currentScreen, user, isLoading } = useAuth();

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
      <div className="flex min-h-screen flex-1 flex-col">
        {!isAuthScreen && <TopHeader showBack={currentScreen !== 'Home'} />}
        <main className="flex-1">
          {renderScreen()}
        </main>
      </div>
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
