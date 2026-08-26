import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number | undefined;
  subtitle?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value = 0,
  subtitle,
  className = ''
}) => {
  return (
    <div className={`w-[48%] md:w-[31.5%] bg-[#FFFDFC] border border-[#E6D9CC] rounded-2xl p-4 mb-3.5 shadow-[0px_4px_16px_rgba(58,36,28,0.05)] transition-all hover:border-[#C9A66B] ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B] mb-3">
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-serif-luxury font-bold text-[#241611] tracking-tight">
        {value}
      </div>
      <div className="text-[11px] font-semibold text-[#796A61] mt-0.5">
        {title}
      </div>
      {subtitle && (
        <div className="text-[10px] text-[#58745A] font-medium mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};
