import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  onClick,
  selected = false
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center bg-[#FFFDFC] border ${
        selected ? 'border-[#C9A66B] ring-2 ring-[#C9A66B]/30' : 'border-[#E6D9CC]'
      } rounded-2xl p-4 mb-3 text-left transition-all duration-200 hover:border-[#C9A66B] hover:shadow-[0px_6px_20px_rgba(58,36,28,0.06)] active:scale-[0.99] cursor-pointer group`}
    >
      <div className="w-11 h-11 rounded-xl bg-[#F8F3EC] flex items-center justify-center mr-3.5 text-[#C9A66B] flex-shrink-0 transition-colors group-hover:bg-[#EFE5D8]">
        {icon}
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <h3 className="text-[#241611] font-extrabold text-[15px] leading-snug group-hover:text-[#3A241C]">
          {title}
        </h3>
        <p className="text-[#796A61] text-xs leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
      <div className="text-[#6B4A3A] group-hover:text-[#241611] group-hover:translate-x-1 transition-transform flex-shrink-0">
        <ChevronRight size={20} />
      </div>
    </button>
  );
};
