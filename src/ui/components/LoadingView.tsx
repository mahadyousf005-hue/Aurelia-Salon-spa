import React from 'react';
import { Flower, Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingView: React.FC<LoadingViewProps> = ({
  message = "Preparing your experience...",
  fullScreen = false
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${fullScreen ? 'min-h-[70vh]' : ''}`}>
      <div className="w-16 h-16 rounded-full bg-[#FFFDFC] border border-[#E4D1AD] flex items-center justify-center shadow-sm text-[#C9A66B] animate-pulse">
        <Flower size={30} className="stroke-[1.75]" />
      </div>
      <Loader2 className="w-6 h-6 text-[#C9A66B] animate-spin mt-4 mb-2" />
      <p className="text-xs text-[#796A61] font-semibold tracking-wide">
        {message}
      </p>
    </div>
  );
};
