import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PrimaryGoldButtonProps {
  title: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'chocolate' | 'outline' | 'gold';
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PrimaryGoldButton: React.FC<PrimaryGoldButtonProps> = ({
  title,
  onClick,
  loading = false,
  disabled = false,
  variant = 'chocolate',
  icon,
  className = '',
  fullWidth = true
}) => {
  const baseStyles = "h-[54px] rounded-2xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer select-none active:scale-[0.99]";

  let variantStyles = "";
  if (variant === 'chocolate') {
    variantStyles = "bg-[#3A241C] text-[#FFFDFC] hover:bg-[#241611] shadow-[0px_8px_20px_rgba(58,36,28,0.2)] disabled:bg-[#3A241C]/60";
  } else if (variant === 'gold') {
    variantStyles = "bg-[#C9A66B] text-[#241611] hover:bg-[#b8955a] shadow-[0px_8px_20px_rgba(201,166,107,0.3)] disabled:bg-[#C9A66B]/60";
  } else if (variant === 'outline') {
    variantStyles = "border border-[#3A241C] bg-transparent text-[#3A241C] hover:bg-[#3A241C]/5";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${fullWidth ? 'w-full' : 'px-6'} ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <span>{title}</span>
          {icon || <ArrowRight size={18} />}
        </>
      )}
    </button>
  );
};
