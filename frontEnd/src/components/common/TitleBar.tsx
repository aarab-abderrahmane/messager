import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { MSN_LOGO_URL } from '../../constants';

interface TitleBarProps {
  title: string;
  variant?: 'xp' | 'live';
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, variant = 'xp' , icon }) => {
  if (variant === 'live') {
    return (
      <div className="h-8 bg-gradient-to-b from-[#F0F0F0] to-[#D0D0D0] flex items-center justify-between px-2 border-b border-[#A0A0A0] shrink-0">
        <div className="flex items-center gap-2">
          <img src={MSN_LOGO_URL} className="w-4 h-4" alt="MSN" />
          <span className="text-[11px] text-black font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-5 hover:bg-gray-200 flex items-center justify-center transition-colors"><Minus size={12} /></button>
          <button className="w-6 h-5 hover:bg-gray-200 flex items-center justify-center transition-colors"><Square size={10} /></button>
          <button className="w-11 h-5 hover:bg-[#E81123] hover:text-white flex items-center justify-center transition-colors"><X size={12} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-gradient-to-b from-[#0058E6] via-[#3C96FF] to-[#0058E6] flex items-center justify-between px-2 select-none shrink-0 border-b border-[#003399]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-5  rounded-sm flex items-center justify-center shadow-inner">
          <img src={icon} className="w-6 h-6" alt="MSN" />
        </div>
        <span className="text-white font-bold text-sm drop-shadow-md">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-6 h-5 bg-[#0058E6] border border-white/30 rounded-sm flex items-center justify-center hover:bg-[#3C96FF] transition-colors shadow-sm">
          <Minus size={14} className="text-white" />
        </button>
        <button className="w-6 h-5 bg-[#0058E6] border border-white/30 rounded-sm flex items-center justify-center hover:bg-[#3C96FF] transition-colors shadow-sm">
          <Square size={10} className="text-white" />
        </button>
        <button className="w-11 h-5 bg-gradient-to-b from-[#E96E4C] to-[#C33E23] border border-white/30 rounded-sm flex items-center justify-center hover:from-[#ff8e6c] hover:to-[#e35e43] transition-colors shadow-sm">
          <X size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
};
