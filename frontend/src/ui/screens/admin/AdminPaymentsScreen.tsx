import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, User, CheckCircle, Tag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PaymentRecord } from '../../../types';
import { apiRequest } from '../../../data/api';
import { LoadingView } from '../../components/LoadingView';
import { EmptyState } from '../../components/EmptyState';
import { RoleBottomNav, CustomerBottomNav } from '../../components/BottomNav';

export const AdminPaymentsScreen: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/payments');
      setPayments(data.payments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] pb-24">
        <LoadingView message="Loading payment transactions..." fullScreen />
        {user?.role === 'customer' ? <CustomerBottomNav active="Profile" /> : <RoleBottomNav role={user?.role || 'admin'} active="Home" />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        
        {/* Header */}
        <div className="mb-5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase block mb-1">
            FINANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#241611]">
            Billing & Payments
          </h1>
          <p className="text-xs text-[#796A61] mt-1 leading-relaxed">
            Keep track of salon invoices, revenue transactions, and payment statuses.
          </p>
        </div>

        {/* Revenue Summary Card */}
        <div className="bg-[#3A241C] text-[#FFFDFC] rounded-3xl p-5 mb-6 shadow-md flex items-center justify-between border border-[#3A241C]">
          <div>
            <span className="text-[10px] font-extrabold text-[#E4D1AD] tracking-widest uppercase block mb-1">
              TOTAL RECORDED REVENUE
            </span>
            <div className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#FFFDFC]">
              Rs {totalRevenue.toLocaleString()}
            </div>
            <span className="text-xs text-[#EFE5D8] mt-1 block">
              {payments.length} transactions processed
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E4D1AD]">
            <CreditCard size={24} />
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-3.5">
          {payments.map((payment) => (
            <div
              key={payment.id || payment._id}
              className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#C9A66B] transition-all"
            >
              <div className="flex items-center justify-between border-b border-[#E6D9CC] pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B]">
                    <CreditCard size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#241611]">
                      {payment.service_name}
                    </h3>
                    <span className="text-[11px] text-[#796A61]">
                      Ref: #{payment.booking_id || payment.id}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#6B4A3A] block">
                    Rs {Number(payment.amount).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F1F6F0] text-[#58745A] uppercase inline-block mt-0.5">
                    {payment.payment_status || 'Paid'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#796A61]">
                <p className="flex items-center gap-1.5">
                  <User size={13} className="text-[#C9A66B]" />
                  <span>Client: <strong className="text-[#241611]">{payment.customer_name}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Tag size={13} className="text-[#C9A66B]" />
                  <span>Method: <strong className="text-[#241611] capitalize">{payment.payment_method?.replace(/_/g, ' ')}</strong></span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#C9A66B]" />
                  <span>Date: {payment.paid_at || '2026-08-24'}</span>
                </p>
              </div>
            </div>
          ))}

          {payments.length === 0 && (
            <EmptyState
              icon={<CreditCard size={28} />}
              title="No Payment Records"
              text="No transaction history found."
            />
          )}
        </div>

      </div>

      {user?.role === 'customer' ? (
        <CustomerBottomNav active="Profile" />
      ) : (
        <RoleBottomNav role={user?.role || 'admin'} active="Home" />
      )}
    </div>
  );
};
