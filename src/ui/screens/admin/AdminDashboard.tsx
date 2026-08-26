import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Sparkles, Calendar, Clock, Wallet, ShieldCheck, Tag, CreditCard, Clock4 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { DashboardStats } from '../../../types';
import { apiRequest } from '../../../data/api';
import { StatCard } from '../../components/StatCard';
import { MenuButton } from '../../components/MenuButton';
import { LoadingView } from '../../components/LoadingView';
import { RoleBottomNav } from '../../components/BottomNav';

export const AdminDashboard: React.FC = () => {
  const { user, navigate } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/dashboard');
      setStats(data.dashboard);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading admin dashboard..." fullScreen />
        <RoleBottomNav role="admin" active="Home" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
              AURELIA SALON & SPA
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
              Welcome, {user?.name || 'Administrator'}
            </h1>
            <p className="text-xs text-[#796A61] mt-0.5">
              Here's your comprehensive salon overview.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#3A241C] text-[#FFFDFC] flex items-center justify-center font-bold text-lg shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>

        {/* Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE5D8] rounded-full text-xs font-bold text-[#6B4A3A] mb-5">
          <ShieldCheck size={14} className="text-[#C9A66B]" />
          <span>Administrator</span>
        </div>

        {/* Salon Overview Section */}
        <div className="mb-6">
          <h2 className="font-serif-luxury font-bold text-xl text-[#241611]">
            Salon Overview
          </h2>
          <p className="text-xs text-[#796A61] mb-3">
            Monitor business performance metrics at a glance.
          </p>

          <div className="flex flex-wrap justify-between">
            <StatCard
              icon={<Users size={20} />}
              title="Customers"
              value={stats?.customers || 12}
            />
            <StatCard
              icon={<UserCheck size={20} />}
              title="Staff Members"
              value={stats?.staff || 4}
            />
            <StatCard
              icon={<Sparkles size={20} />}
              title="Services"
              value={stats?.services || 10}
            />
            <StatCard
              icon={<Calendar size={20} />}
              title="Appointments"
              value={stats?.appointments || 18}
            />
            <StatCard
              icon={<Clock size={20} />}
              title="Pending"
              value={stats?.pendingAppointments || 2}
            />
            <StatCard
              icon={<Wallet size={20} />}
              title="Revenue"
              value={`Rs ${(stats?.revenue || 12800).toLocaleString()}`}
            />
          </div>
        </div>

        {/* Management Actions */}
        <div className="mb-4">
          <h2 className="font-serif-luxury font-bold text-xl text-[#241611] mb-3">
            Management
          </h2>

          <div className="space-y-2.5">
            <MenuButton
              icon={<Sparkles size={20} />}
              title="Manage Services"
              subtitle="View, configure and organize salon service catalog"
              onClick={() => navigate('Services')}
            />
            <MenuButton
              icon={<UserCheck size={20} />}
              title="Manage Staff"
              subtitle="View your salon team & specializations"
              onClick={() => navigate('Staff')}
            />
            <MenuButton
              icon={<Calendar size={20} />}
              title="Appointments"
              subtitle="Manage customer bookings, statuses & payments"
              featured={true}
              onClick={() => navigate('Appointments')}
            />
            <MenuButton
              icon={<Users size={20} />}
              title="Customers"
              subtitle="View registered customers & manage role permissions"
              onClick={() => navigate('Customers', { adminMode: true })}
            />
            <MenuButton
              icon={<Tag size={20} />}
              title="Promotions"
              subtitle="Create and review seasonal discount packages"
              onClick={() => navigate('Promotions')}
            />
            <MenuButton
              icon={<CreditCard size={20} />}
              title="Billing & Payments"
              subtitle="Track salon transactions, revenue & receipts"
              onClick={() => navigate('Payments')}
            />
            <MenuButton
              icon={<Clock4 size={20} />}
              title="Staff Availability"
              subtitle="Review working hours, rosters and break windows"
              onClick={() => navigate('AdminAvailability')}
            />
          </div>
        </div>

      </div>

      <RoleBottomNav role="admin" active="Home" />
    </div>
  );
};
