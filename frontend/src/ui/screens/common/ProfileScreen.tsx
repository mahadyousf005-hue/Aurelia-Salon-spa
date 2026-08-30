import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Edit3, LogOut, Receipt, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { PrimaryGoldButton } from '../../components/PrimaryGoldButton';
import { MenuButton } from '../../components/MenuButton';
import { CustomerBottomNav, RoleBottomNav } from '../../components/BottomNav';

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile, logout, navigate } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(name, phone);
      setEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'staff') return 'Staff Member';
    return 'Customer';
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        
        {/* Profile Avatar Hero */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#3A241C] text-[#FFFDFC] text-3xl font-serif-luxury font-bold flex items-center justify-center mx-auto mb-3 shadow-[0px_8px_24px_rgba(58,36,28,0.2)]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h1 className="text-2xl font-serif-luxury font-bold text-[#241611]">
            {user?.name || 'Aurelia Member'}
          </h1>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE5D8] rounded-full text-xs font-bold text-[#6B4A3A] mt-1.5">
            <ShieldCheck size={14} className="text-[#C9A66B]" />
            <span>{getRoleLabel(user?.role)}</span>
          </div>
        </div>

        {savedMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#F1F6F0] border border-[#58745A]/30 text-[#58745A] text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-6 shadow-[0px_8px_24px_rgba(58,36,28,0.06)] space-y-4">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-4 text-xs font-medium text-[#2E211C] focus:outline-none focus:border-[#C9A66B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E211C] mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-4 text-xs font-medium text-[#2E211C] focus:outline-none focus:border-[#C9A66B]"
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <PrimaryGoldButton
                  title="SAVE PROFILE"
                  onClick={handleSave}
                  loading={saving}
                  variant="chocolate"
                />
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-5 h-[54px] border border-[#E6D9CC] text-[#796A61] rounded-2xl text-xs font-bold hover:bg-[#F8F3EC] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-3 text-xs text-[#796A61] border-b border-[#E6D9CC] pb-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User size={15} className="text-[#C9A66B]" />
                    <span>Full Name</span>
                  </span>
                  <span className="font-bold text-[#241611] text-sm">{user?.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mail size={15} className="text-[#C9A66B]" />
                    <span>Email Address</span>
                  </span>
                  <span className="font-semibold text-[#241611]">{user?.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Phone size={15} className="text-[#C9A66B]" />
                    <span>Mobile</span>
                  </span>
                  <span className="font-semibold text-[#241611]">{user?.phone || 'Not added'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-[#C9A66B]" />
                    <span>Role Access</span>
                  </span>
                  <span className="font-bold text-[#6B4A3A] uppercase tracking-wider">{getRoleLabel(user?.role)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full h-12 border border-[#3A241C] text-[#3A241C] font-bold text-xs rounded-2xl uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#3A241C]/5 transition-colors cursor-pointer"
              >
                <Edit3 size={15} />
                <span>EDIT PROFILE</span>
              </button>

              <MenuButton
                icon={<Receipt size={19} />}
                title="Invoices & Receipts"
                subtitle="Review past payments and transaction history"
                onClick={() => navigate('Payments')}
              />

              <button
                type="button"
                onClick={() => logout()}
                className="w-full h-12 bg-[#FFF8F7] border border-[#E2C7C2] text-[#A45145] font-extrabold text-xs rounded-2xl uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#FFEAE6] transition-colors cursor-pointer mt-4"
              >
                <LogOut size={16} />
                <span>LOG OUT OF ACCOUNT</span>
              </button>
            </>
          )}
        </div>

      </div>

      {user?.role === 'customer' ? (
        <CustomerBottomNav active="Profile" />
      ) : (
        <RoleBottomNav role={user?.role || 'admin'} active="Profile" />
      )}
    </div>
  );
};
