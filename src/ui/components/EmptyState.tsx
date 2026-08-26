import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title?: string;
  text: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  text,
  actionText,
  onAction
}) => {
  return (
    <div className="w-full bg-[#FFFDFC] border border-[#E6D9CC] rounded-3xl p-8 text-center flex flex-col items-center justify-center my-4 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#C9A66B] mb-4">
        {icon}
      </div>
      {title && (
        <h3 className="text-[#241611] font-bold text-base mb-1">
          {title}
        </h3>
      )}
      <p className="text-xs text-[#796A61] max-w-sm leading-relaxed mb-4">
        {text}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 bg-[#3A241C] text-[#FFFDFC] text-xs font-bold rounded-xl hover:bg-[#241611] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
