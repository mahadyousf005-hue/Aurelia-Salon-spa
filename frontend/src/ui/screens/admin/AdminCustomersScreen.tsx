import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShieldCheck, Scissors, UserCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Customer, UserRole } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { RoleBottomNav } from '../../components/BottomNav';

export const AdminCustomersScreen: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/customers');
      setCustomers(data.customers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (customer: Customer, newRole: UserRole) => {
    try {
      const userId = customer.user_id || customer.userId || customer.id;
      await apiRequest(`/users/${userId}/role`, 'PUT', { role: newRole });
      alert(`${customer.name} has been assigned the role: ${newRole.toUpperCase()}.`);
      await loadCustomers();
    } catch (err: any) {
      alert(err.message || 'Could not update role.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading customer directory..." fullScreen />
        <RoleBottomNav role={user?.role || 'admin'} active="Customers" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            CLIENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Registered Customers
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Salon community members, profiles and role access management.
          </p>
        </div>

        <div className="space-y-3.5">
          {customers.map((cust) => (
            <div
              key={cust.id || cust._id}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#C9A66B] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EFE5D8] flex items-center justify-center text-[#3A241C] font-bold text-base">
                    {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#241611]">
                      {cust.name}
                    </h3>
                    <span className="text-xs text-[#796A61]">
                      {cust.email}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#F8F3EC] border border-[#E6D9CC] text-[#6B4A3A] uppercase tracking-wider">
                  {cust.role || 'Customer'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#796A61] border-t border-[#E6D9CC] pt-2.5">
                <p className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#C9A66B]" />
                  <span>{cust.phone || 'No phone provided'}</span>
                </p>
                <span>Visits: {cust.total_visits || 0}</span>
              </div>

              {/* Admin Role Permission Actions */}
              {user?.role === 'admin' && (
                <div className="mt-3 pt-2.5 border-t border-[#E6D9CC]/60 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateRole(cust, 'staff')}
                    className="px-3 py-1.5 bg-[#F8F3EC] border border-[#E4D1AD] text-[#3A241C] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#EFE5D8] transition-colors"
                  >
                    <Scissors size={13} className="text-[#C9A66B]" />
                    <span>Make Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRole(cust, 'admin')}
                    className="px-3 py-1.5 bg-[#F8F3EC] border border-[#E4D1AD] text-[#3A241C] text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#EFE5D8] transition-colors"
                  >
                    <ShieldCheck size={13} className="text-[#C9A66B]" />
                    <span>Make Admin</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <RoleBottomNav role={user?.role || 'admin'} active="Customers" />
    </div>
  );
};
