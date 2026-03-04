import React , {useState} from 'react';
import { motion } from 'motion/react';
import { TitleBar } from '../common/TitleBar';
import {X} from "lucide-react"

const DEFAULT_THEME = {
  bgColor: '#ECE9D8',
  textColor: '#000000',
  appFontSize: 14,
  fontFamily: 'sans-serif'
};


function ThemeDialog({ currentTheme, onClose, onSave }: { currentTheme: any, onClose: () => void, onSave: (theme: any) => void }) {
  const [theme, setTheme] = useState(currentTheme);

  return (
        <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          width: 460,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
          border: '1px solid #b0b0b0',
          borderRadius: 8,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        <TitleBar title="Customize Theme" />

        {/* Subheader */}
        <div style={{
          background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
          borderBottom: '1px solid #b0c8e8',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
            border: '1px solid #1e4fa0',
            borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
            flexShrink: 0,
          }}>
            {/* palette icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1.5" fill="white" stroke="none"/>
              <circle cx="15" cy="8" r="1.5" fill="white" stroke="none"/>
              <circle cx="16.5" cy="14" r="1.5" fill="white" stroke="none"/>
              <circle cx="10" cy="15.5" r="1.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
              fontSize: 13, fontWeight: 800, color: '#1a3e7a',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
            }}>
              Personalize Your Chat
            </span>
            <span style={{
              fontSize: 11, color: '#5a7fa8', fontStyle: 'italic',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
            }}>
              Change colors, font and size
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #f2f2f2 100%)',
        }}>

          {/* Color pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Background Color', key: 'bgColor', value: theme.bgColor },
              { label: 'Text Color', key: 'textColor', value: theme.textColor },
            ].map(field => (
              <div
                key={field.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  padding: '10px 12px',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
                  border: '1px solid #b0c8e8',
                  borderRadius: 5,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 800, color: '#7aaee0',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  {field.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={field.value}
                    onChange={e => setTheme({ ...theme, [field.key]: e.target.value })}
                    style={{
                      width: 36, height: 36,
                      border: '1px solid #b0c8e8',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: 2,
                      background: 'white',
                    }}
                  />
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#444',
                    fontFamily: 'Consolas, monospace',
                  }}>
                    {field.value.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Font family */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            padding: '10px 12px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 5,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
          }}>
            <span style={{
              fontSize: 10, fontWeight: 800, color: '#7aaee0',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              Font Family
            </span>
            <select
              value={theme.fontFamily}
              onChange={e => setTheme({ ...theme, fontFamily: e.target.value })}
              style={{
                height: 30,
                paddingLeft: 10, paddingRight: 10,
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
                border: '1px solid #b0c8e8',
                borderRadius: 4,
                fontSize: 13,
                fontFamily: theme.fontFamily,
                color: '#333',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              <option value="sans-serif" style={{ fontFamily: 'sans-serif' }}>Sans Serif</option>
              <option value="serif" style={{ fontFamily: 'serif' }}>Serif</option>
              <option value="monospace" style={{ fontFamily: 'monospace' }}>Monospace</option>
              <option value="'Comic Sans MS', cursive" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans</option>
            </select>
          </div>

          {/* Font size slider */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '10px 12px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 5,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: 10, fontWeight: 800, color: '#7aaee0',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                App Font Size
              </span>
              <div style={{
                background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                border: '1px solid #1e4fa0',
                borderRadius: 10,
                padding: '1px 8px',
                fontSize: 11, fontWeight: 800, color: '#fff',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
                {theme.appFontSize}px
              </div>
            </div>
            <input
              type="range"
              min="10" max="24" step="1"
              value={theme.appFontSize}
              onChange={e => setTheme({ ...theme, appFontSize: parseInt(e.target.value) })}
              style={{
                width: '100%',
                height: 4,
                accentColor: '#3169C6',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, color: '#aaa', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>10px</span>
              <span style={{ fontSize: 9, color: '#aaa', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>24px</span>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '10px 16px',
          background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
          borderTop: '1px solid #c0c0c0',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Apply button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSave(theme)}
              style={{
                flex: 1, height: 32,
                background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                border: '1px solid #1e4fa0',
                borderRadius: 5,
                fontSize: 12, fontWeight: 700,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(42,95,181,0.3)',
                textShadow: '0 1px 1px rgba(0,0,0,0.2)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)'; }}
            >
              ✓ Apply Theme
            </motion.button>

            {/* Cancel button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                flex: 1, height: 32,
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                border: '1px solid #c0c0c0',
                borderRadius: 5,
                fontSize: 12, fontWeight: 700,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: '#444',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)'; e.currentTarget.style.borderColor = '#aaa'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)'; e.currentTarget.style.borderColor = '#c0c0c0'; }}
            >
              <X size={12} /> Cancel
            </motion.button>
          </div>

          {/* Reset button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(DEFAULT_THEME)}
            style={{
              width: '100%', height: 28,
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
              border: '1px solid #c0c0c0',
              borderRadius: 5,
              fontSize: 11, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#2a5fb5',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)'; e.currentTarget.style.borderColor = '#7aaee0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)'; e.currentTarget.style.borderColor = '#c0c0c0'; }}
          >
            ↺ Reset to Default
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


export  default ThemeDialog