import React from 'react';
import { Check, X } from 'lucide-react';

interface AuthActionModalProps {
  action: 'login' | 'register' | 'success';
  isOpen: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AuthActionModal: React.FC<AuthActionModalProps> = ({ action, isOpen, loading = false, onClose, onConfirm }) => {
  if (!isOpen) return null;
  const isLogin = action === 'login';
  const isSuccess = action === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241611]/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="auth-action-title">
      <div className="w-full max-w-sm rounded-2xl border border-[#E6D9CC] bg-[#FFFDFC] p-6 shadow-[0px_20px_60px_rgba(36,22,17,0.25)]">
        <div className="flex items-start justify-between">
          <div className="h-11 w-11 rounded-full bg-[#F4EDE6] flex items-center justify-center text-[#C9A66B]">
            <Check size={22} />
          </div>
          <button type="button" onClick={onClose} aria-label="Close popup" className="text-[#796A61] hover:text-[#241611]"><X size={19} /></button>
        </div>
        <h2 id="auth-action-title" className="mt-5 font-serif-luxury text-xl font-bold text-[#241611]">
          {isSuccess ? 'Account created successfully!' : isLogin ? 'Ready to sign in?' : 'Create your account?'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#796A61]">
          {isSuccess ? 'Your Aurelia Salon & Spa account is ready. Continue to sign in.' : isLogin ? 'Confirm to securely sign in to your Aurelia Salon & Spa account.' : 'Confirm to create your Aurelia Salon & Spa account and get started.'}
        </p>
        <div className="mt-6 flex gap-3">
          {!isSuccess && <button type="button" onClick={onClose} disabled={loading} className="h-11 flex-1 rounded-xl border border-[#D8C7B8] text-xs font-bold uppercase tracking-wider text-[#6B4A3A] hover:bg-[#F8F3EC] disabled:opacity-50">Cancel</button>}
          <button type="button" onClick={onConfirm} disabled={loading} className="h-11 flex-1 rounded-xl bg-[#3A241C] text-xs font-bold uppercase tracking-wider text-[#FFFDFC] hover:bg-[#241611] disabled:opacity-70">
            {loading ? 'Please wait...' : isSuccess ? 'Continue to Login' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};