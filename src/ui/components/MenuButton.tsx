import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  featured?: boolean;
  className?: string;
  badge?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  featured = false,
  className = '',
  badge
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[74px] rounded-2xl p-4 mb-3 flex items-center text-left transition-all duration-200 border cursor-pointer select-none active:scale-[0.99] group ${
        featured
          ? 'bg-[#3A241C] border-[#3A241C] text-[#FFFDFC] shadow-[0px_8px_24px_rgba(58,36,28,0.22)]'
          : 'bg-[#FFFDFC] border-[#E6D9CC] text-[#241611] hover:border-[#C9A66B] shadow-[0px_4px_16px_rgba(58,36,28,0.05)]'
      } ${className}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mr-3.5 flex-shrink-0 transition-transform group-hover:scale-105 ${
          featured ? 'bg-[#FFFDFC]/15 text-[#FFFDFC]' : 'bg-[#F8F3EC] text-[#C9A66B]'
        }`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm leading-snug ${featured ? 'text-[#FFFDFC]' : 'text-[#241611]'}`}>
            {title}
          </span>
          {badge && (
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#C9A66B] text-[#241611] rounded-full uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <span className={`block text-xs leading-relaxed mt-0.5 ${featured ? 'text-[#E4D1AD]' : 'text-[#796A61]'}`}>
          {subtitle}
        </span>
      </div>

      <ChevronRight
        size={20}
        className={`flex-shrink-0 transition-transform group-hover:translate-x-1 ${
          featured ? 'text-[#FFFDFC]' : 'text-[#6B4A3A]'
        }`}
      />
    </button>
  );
};
