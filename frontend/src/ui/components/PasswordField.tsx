import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "Enter password",
  required = false
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-[#2E211C] mb-2 tracking-wide">
        {label} {required && <span className="text-[#A45145]">*</span>}
      </label>
      <div className="h-[52px] flex items-center bg-[#FCF9F5] border border-[#E6D9CC] rounded-2xl px-4 transition-all focus-within:border-[#C9A66B] focus-within:bg-[#FFFDFC] focus-within:ring-1 focus-within:ring-[#C9A66B]/30 shadow-xs">
        <Lock size={19} className="text-[#C9A66B] mr-3 flex-shrink-0" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent text-[#2E211C] placeholder-[#A89A91] text-sm font-medium focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="p-2 text-[#6B4A3A] hover:text-[#3A241C] transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <Eye size={19} /> : <EyeOff size={19} />}
        </button>
      </div>
    </div>
  );
};
