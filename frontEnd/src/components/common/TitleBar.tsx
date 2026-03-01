import React from 'react';
import { Minus, Square, X } from 'lucide-react';
import { MSN_LOGO_URL } from '../../constants';

interface TitleBarProps {
  title: string;
  variant?: 'xp' | 'live' | 'win7';
  icon?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, variant = 'xp', icon  , onClose}) => {
  if (variant === 'live') {
    return (
      <div className="h-10 bg-gradient-to-b from-[#F0F0F0] to-[#D0D0D0] flex items-center justify-between px-2 border-b border-[#A0A0A0] shrink-0">
        <div className="flex items-center gap-2">
          <img src={icon} className="w-6 h-5" alt="MSN" />
          <span className="text-[13px] text-black font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 hover:bg-gray-200 flex items-center justify-center transition-colors rounded-sm"><Minus size={12} /></button>
          <button className="w-6 h-6 hover:bg-gray-200 flex items-center justify-center transition-colors rounded-sm"><Square size={10} /></button>
          <button className="w-11 h-6 hover:bg-[#E81123] hover:text-white flex items-center justify-center transition-colors rounded-sm cursor-pointer" onClick={onClose}><X size={12} /></button>
        </div>
      </div>
    );
  }

  if (variant === 'win7') {
    return (
      <div className="h-10 bg-white/20 backdrop-blur-md flex items-center justify-between px-2 select-none shrink-0 border-b border-white/30 rounded-t-lg overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/10 pointer-events-none" />
        <div className="flex items-center gap-2 relative z-10">
          {icon && (
            <div className="w-5 h-5 flex items-center justify-center">
              <img src={icon} className="w-full h-full object-contain filter drop-shadow-sm" alt="icon" />
            </div>
          )}
          <span className="text-white font-semibold text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{title}</span>
        </div>
        <div className="flex items-center gap-0.5 relative z-10">
          <button className="w-7 h-5 flex items-center justify-center bg-white/10 hover:bg-white/30 border border-white/20 rounded-sm transition-all">
            <Minus size={14} className="text-white drop-shadow-sm" />
          </button>
          <button className="w-7 h-5 flex items-center justify-center bg-white/10 hover:bg-white/30 border border-white/20 rounded-sm transition-all">
            <Square size={10} className="text-white drop-shadow-sm" />
          </button>
          <button className="w-11 h-5 flex items-center justify-center bg-red-500/80 hover:bg-red-500 border border-white/20 rounded-sm transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <X size={14} className="text-white drop-shadow-sm" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-gradient-to-b from-[#0058E6] via-[#3C96FF] to-[#0058E6] flex items-center justify-between px-2 select-none shrink-0 border-b border-[#003399]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-5  rounded-sm flex items-center justify-center shadow-inner">
          {icon && <img src={icon} className="w-6 h-6" alt="MSN" />}
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
