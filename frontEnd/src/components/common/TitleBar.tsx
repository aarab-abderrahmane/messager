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
          <div
        style={{
          height: 38,
          background: 'linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 100%)',
          borderBottom: '1px solid #a0a0a0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 8,
          paddingRight: 4,
          flexShrink: 0,
          userSelect: 'none',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gloss sweep */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Left — icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden', flex: 1 }}>
          {icon && (
            <div style={{
              width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
            }}>
              <img src={icon} style={{ width: 18, height: 18 }} alt="" />
            </div>
          )}
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#222',
            textShadow: '0 1px 0 rgba(255,255,255,0.8)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>

        {/* Right — window controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>

          {/* Minimize */}
          <button
            style={{
              width: 22, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
              border: '1px solid #b0b0b0',
              borderRadius: 3,
              color: '#444',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
              e.currentTarget.style.borderColor = '#7aaee0';
              e.currentTarget.style.color = '#1a4fa0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)';
              e.currentTarget.style.borderColor = '#b0b0b0';
              e.currentTarget.style.color = '#444';
            }}
          >
            <Minus size={11} />
          </button>

          {/* Maximize */}
          <button
            style={{
              width: 22, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
              border: '1px solid #b0b0b0',
              borderRadius: 3,
              color: '#444',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
              e.currentTarget.style.borderColor = '#7aaee0';
              e.currentTarget.style.color = '#1a4fa0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)';
              e.currentTarget.style.borderColor = '#b0b0b0';
              e.currentTarget.style.color = '#444';
            }}
          >
            <Square size={9} />
          </button>

          {/* Close — red on hover */}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
              border: '1px solid #b0b0b0',
              borderRadius: 3,
              color: '#555',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              transition: 'all 0.1s',
              marginLeft: 2,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)';
              e.currentTarget.style.borderColor = '#8a1a08';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)';
              e.currentTarget.style.borderColor = '#b0b0b0';
              e.currentTarget.style.color = '#555';
            }}
          >
            <X size={12} />
          </button>
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
      <div
        style={{
          height: 32,
          background: 'linear-gradient(180deg, #1a6fd4 0%, #1255b0 40%, #0d4a9e 100%)',
          borderBottom: '1px solid #0a3a80',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 8,
          paddingRight: 4,
          flexShrink: 0,
          userSelect: 'none',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gloss sweep */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Left — icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden', flex: 1 }}>
          {icon && (
            <div style={{
              width: 18, height: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
            }}>
              <img src={icon} style={{ width: 18, height: 18 }} alt="" />
            </div>
          )}
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>

        {/* Right — window controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>

          {/* Minimize */}
          <button
            style={{
              width: 22, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 3,
              color: 'white',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.14) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
            }}
          >
            <Minus size={11} color="white" />
          </button>

          {/* Maximize */}
          <button
            style={{
              width: 22, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 3,
              color: 'white',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.14) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
            }}
          >
            <Square size={9} color="white" />
          </button>

          {/* Close — red */}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)',
              border: '1px solid #8a1a08',
              borderRadius: 3,
              color: 'white',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.1s',
              marginLeft: 2,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #f07050 0%, #d04020 100%)';
              e.currentTarget.style.borderColor = '#a02010';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)';
              e.currentTarget.style.borderColor = '#8a1a08';
            }}
          >
            <X size={12} color="white" />
          </button>
        </div>
      </div>
  );
};
