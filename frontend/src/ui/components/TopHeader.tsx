import React from 'react';
import { Flower, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth, ScreenName } from '../../context/AuthContext';

interface TopHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ showBack = false, onBack, title }) => {
  const { user, logout, navigate, currentScreen } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('Home');
    }
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Administrator';
    if (role === 'staff') return 'Staff Member';
    return 'Customer';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F3EC]/95 backdrop-blur-md border-b border-[#E6D9CC]/70 px-4 py-3">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 lg:px-8">
        <div className="flex items-center gap-3">
          {showBack && currentScreen !== 'Home' && (
            <button
              type="button"
              onClick={handleBack}
              className="w-9 h-9 rounded-xl bg-[#FFFDFC] border border-[#E6D9CC] flex items-center justify-center text-[#3A241C] hover:bg-[#EFE5D8] transition-colors shadow-xs"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(user ? 'Home' : 'RoleSelection')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFDFC] border border-[#E4D1AD] flex items-center justify-center text-[#C9A66B] shadow-xs group-hover:scale-105 transition-transform">
              <Flower size={17} className="stroke-[2]" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-[#3A241C] text-sm tracking-[0.15em] block leading-none">
                {title || 'AURELIA'}
              </span>
              <span className="text-[7.5px] font-bold text-[#C9A66B] tracking-[0.2em] uppercase block mt-0.5">
                SALON & SPA
              </span>
            </div>
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('Profile')}
              className="flex items-center gap-2 bg-[#FFFDFC] border border-[#E6D9CC] rounded-full pl-1.5 pr-3 py-1 hover:border-[#C9A66B] transition-colors shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#3A241C] text-[#FFFDFC] flex items-center justify-center text-[11px] font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#2E211C] leading-none block">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-bold text-[#C9A66B] uppercase tracking-wider block">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              title="Log out"
              className="w-8 h-8 rounded-full bg-[#FFF5F3] border border-[#E2C7C2] text-[#A45145] flex items-center justify-center hover:bg-[#FFEAE6] transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('RoleSelection')}
            className="text-xs font-bold text-[#3A241C] px-3 py-1.5 rounded-xl border border-[#3A241C] hover:bg-[#3A241C] hover:text-[#FFFDFC] transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
