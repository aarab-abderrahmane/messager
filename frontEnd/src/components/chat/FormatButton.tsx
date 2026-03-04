import React from 'react'

function FormatButton({ icon, label, onClick, active }: {
  icon: React.ReactNode,
  label?: string,
  onClick?: () => void,
  active?: boolean
}) {
  return (
    <div
      onClick={onClick}
      title={label}
      style={{
        height: 30,
        paddingLeft: label && label !== 'text' && label !== 'emoji' ? 8 : 6,
        paddingRight: label && label !== 'text' && label !== 'emoji' ? 10 : 6,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: active
          ? 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)'
          : 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
        border: active ? '1px solid #7aaee0' : '1px solid #c0c0c0',
        borderRadius: 6,
        cursor: 'pointer',
        boxShadow: active
          ? 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(49,105,198,0.1)'
          : 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 1px rgba(0,0,0,0.08)',
        transition: 'all 0.1s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
          e.currentTarget.style.borderColor = '#aaa';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)';
          e.currentTarget.style.borderColor = '#c0c0c0';
        }
      }}
    >
      {/* Icon */}
      <div style={{ color: active ? '#2a5fb5' : '#555', display: 'flex', alignItems: 'center' }}>
        {icon}
      </div>

      {/* Label for Voice Clip / PDF */}
      {(label === 'Voice Clip' || label === 'PDF') && (
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: active ? '#1a4fa0' : '#444',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </span>
      )}

      {/* Dropdown arrow for text / emoji */}
      {(label === 'text' || label === 'emoji') && (
        <div style={{
          width: 0, height: 0,
          borderLeft: '3px solid transparent',
          borderRight: '3px solid transparent',
          borderTop: `4px solid ${active ? '#2a5fb5' : '#777'}`,
          marginLeft: 1,
        }} />
      )}
    </div>
  );
}


export default FormatButton