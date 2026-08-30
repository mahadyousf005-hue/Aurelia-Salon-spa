import React from 'react';

interface AureliaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AureliaLogo: React.FC<AureliaLogoProps> = ({ size = 'md', className = '' }) => {
  const circleClass =
    size === 'sm'
      ? 'w-9 h-9 mb-1.5'
      : size === 'lg'
      ? 'w-14 h-14 mb-3'
      : 'w-12 h-12 mb-2';

  const titleClass =
    size === 'sm'
      ? 'text-xs tracking-[0.25em]'
      : size === 'lg'
      ? 'text-lg tracking-[0.3em]'
      : 'text-sm tracking-[0.3em]';

  const subtitleClass =
    size === 'sm'
      ? 'text-[8px] tracking-[0.18em]'
      : size === 'lg'
      ? 'text-[11px] tracking-[0.22em]'
      : 'text-[10px] tracking-[0.2em]';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Luxury Golden Emblem */}
      <div
        className={`${circleClass} flex items-center justify-center rounded-full border border-[#C9A66B] bg-[#F8F3EC] shadow-[0_2px_10px_rgba(201,166,107,0.15)] transition-transform duration-300 hover:scale-105`}
      >
        <svg
          width={size === 'sm' ? 18 : size === 'lg' ? 26 : 22}
          height={size === 'sm' ? 18 : size === 'lg' ? 26 : 22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A66B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4z" />
          <path d="M12 13a4 4 0 0 0-4 4c0 3 4 5 4 5s4-2 4-5a4 4 0 0 0-4-4z" />
          <circle cx="12" cy="10" r="1.5" fill="#C9A66B" />
        </svg>
      </div>

      <h2 className={`font-montserrat font-bold uppercase text-[#6B4A3A] ${titleClass} leading-tight`}>
        Aurelia
      </h2>
      <p className={`font-montserrat uppercase text-[#796A61] ${subtitleClass} mt-0.5`}>
        Salon & Spa
      </p>
    </div>
  );
};

