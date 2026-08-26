import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = ''
}) => {
  return (
    <div className={`mb-6 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <span className="block text-[10px] font-extrabold tracking-[0.2em] text-[#C9A66B] uppercase mb-1.5">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[#241611] font-serif-luxury text-2xl md:text-3xl font-bold tracking-tight mb-1.5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#796A61] text-xs md:text-sm leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};
