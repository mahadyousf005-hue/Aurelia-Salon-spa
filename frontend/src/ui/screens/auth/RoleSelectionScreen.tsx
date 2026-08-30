import React from 'react';
import { Shield, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AureliaLogo } from '../../components/AureliaLogo';
import { UserRole } from '../../../types';

export const RoleSelectionScreen: React.FC = () => {
  const { navigate, setSelectedRole } = useAuth();

  const roles: {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    featured?: boolean;
  }[] = [
    {
      role: 'customer',
      title: 'Customer',
      description: 'Book appointments, explore luxury treatments, and manage your personalized visits.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      role: 'staff',
      title: 'Staff Member',
      description: 'View your daily schedule, manage client profiles, and update your professional availability.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      featured: true
    },
    {
      role: 'admin',
      title: 'Administrator',
      description: 'Oversee salon operations, manage staff performance, and access detailed business reports.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    }
  ];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    navigate('Login', { role });
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC] flex flex-col justify-between items-center px-4 py-8 sm:p-12 overflow-y-auto">
      {/* Header */}
      <header className="text-center space-y-3 max-w-2xl mx-auto">
        <AureliaLogo size="lg" />

        <div className="pt-3">
          <span className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-[#C9A66B] font-semibold block">
            Welcome to Aurelia
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#241611] mt-1.5 tracking-tight">
            Select Your Role
          </h1>
          <p className="font-sans text-[#796A61] text-xs sm:text-sm mt-2 leading-relaxed">
            Choose your workspace to continue your beautiful journey.
          </p>
        </div>
      </header>

      {/* Role Cards Grid */}
      <main className="w-full max-w-5xl my-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {roles.map((item) => (
          <div
            key={item.role}
            onClick={() => handleSelectRole(item.role)}
            className={`group cursor-pointer rounded-[24px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-[#FFFDFC] border ${
              item.featured
                ? 'border-[#C9A66B] shadow-[0_20px_40px_rgba(107,74,58,0.09)] md:-translate-y-2 hover:shadow-[0_24px_50px_rgba(107,74,58,0.14)]'
                : 'border-[#E6D9CC] shadow-[0_6px_20px_rgba(58,36,28,0.04)] hover:border-[#C9A66B] hover:shadow-[0_16px_36px_rgba(107,74,58,0.08)] hover:-translate-y-1'
            }`}
          >
            <div>
              {/* Role Icon */}
              <div
                className={`w-14 h-14 mb-6 sm:mb-8 flex items-center justify-center rounded-2xl transition-colors duration-300 ${
                  item.featured
                    ? 'bg-[#C9A66B] text-[#FFFDFC] group-hover:bg-[#b89557]'
                    : 'bg-[#F8F3EC] text-[#C9A66B] group-hover:bg-[#EFE5D8]'
                }`}
              >
                {item.icon}
              </div>

              <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 font-serif font-semibold text-[#241611]">
                {item.title}
              </h3>

              <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#796A61]">
                {item.description}
              </p>
            </div>

            {/* Bottom Select Indicator */}
            <div className="mt-8 pt-4 border-t border-[#E6D9CC]/50 flex items-center justify-between">
              <span className="font-montserrat text-[11px] text-[#C9A66B] uppercase font-bold tracking-widest group-hover:text-[#3A241C] transition-colors">
                Select Role
              </span>
              <div className="text-[#C9A66B] group-hover:text-[#3A241C] group-hover:translate-x-1.5 transition-transform duration-200">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-[#E6D9CC] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-[#796A61]">
          <Lock size={14} className="text-[#796A61]" />
          <p className="font-sans text-xs text-[#796A61]">
            Your actual role is verified from your authenticated account.
          </p>
        </div>

        <div className="flex gap-5 text-xs text-[#796A61]">
          <span className="hover:text-[#3A241C] cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-[#3A241C] cursor-pointer transition-colors">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
};

