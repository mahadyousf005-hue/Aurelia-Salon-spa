import React from 'react';

interface AuthTextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  keyboardType?: string;
  autoCapitalize?: string;
  required?: boolean;
}

export const AuthTextField: React.FC<AuthTextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  type = 'text',
  required = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-[#2E211C] mb-2 tracking-wide">
        {label} {required && <span className="text-[#A45145]">*</span>}
      </label>
      <div className="h-[52px] flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-4 transition-all focus-within:border-[#C9A66B] focus-within:bg-[#FFFDFC] focus-within:ring-1 focus-within:ring-[#C9A66B]/30 shadow-xs">
        {icon && <div className="text-[#C9A66B] mr-3 flex-shrink-0">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent text-[#2E211C] placeholder-[#A89A91] text-sm font-medium focus:outline-none"
        />
      </div>
    </div>
  );
};
