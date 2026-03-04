import React , {useState} from 'react';
import { motion,  AnimatePresence } from 'motion/react';
import { TitleBar } from '../common/TitleBar';
import {  UserData } from '../../types';
import {  AVATARS } from '../../constants';
import { Eye, EyeOff ,X , User ,Mail,Lock
} from 'lucide-react';

function ProfileDialog({ user, onClose, onSave }: { user: UserData, onClose: () => void, onSave: (user: UserData) => void }) {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [confirmPassword, setConfirmPassword] = useState(user.password || '');
  const [newPassword, setNewPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);

  return (
<div
  className="fixed inset-0 flex items-center justify-center z-[100] p-4"
  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)' }}
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 20 }}
    style={{
      width: 580,
      display: 'flex', flexDirection: 'column',
      background: '#ffffff',
      border: '1px solid #a0a0a0',
      borderRadius: 10,
      boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
      overflow: 'visible', // ← KEY FIX: was 'hidden'
      position: 'relative',
    }}
  >
    {/* Clip only the title bar area */}
    <div style={{ borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
      <TitleBar title="Edit Profile — Windows Live" icon="/assets/icons/user.png" />
    </div>

    {/* Left + Right two-column layout */}
    <div style={{
      display: 'flex', flex: 1,
      borderRadius: '0 0 10px 10px',
      overflow: 'hidden',
    }}>

      {/* LEFT sidebar */}
      <div style={{
        width: 185,
        background: 'linear-gradient(180deg, #1a6fd4 0%, #1255b0 40%, #0d4a9e 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 16px',
        gap: 16,
        position: 'relative',
        flexShrink: 0,
        overflow: 'visible', // ← allow picker to overflow
      }}>
        {/* Gloss */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)',
          pointerEvents: 'none', borderRadius: '0 0 0 0',
        }} />

        {/* Avatar */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            onClick={() => setShowAvatars(!showAvatars)}
            style={{
              width: 108, height: 108,
              background: 'rgba(255,255,255,0.1)',
              border: '3px solid rgba(255,255,255,0.55)',
              borderRadius: 16,
              padding: 5,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
              transition: 'all 0.15s',
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.95)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.35)';
            }}
          >
            <img
              src={avatar}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 11, display: 'block' }}
              alt="Avatar"
            />
            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute', inset: 0, borderRadius: 11,
                background: 'rgba(0,0,0,0)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
            >
              <span style={{
                fontSize: 11, fontWeight: 800, color: 'white',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}>Change</span>
            </div>
          </div>

          {/* Change badge */}
          <button
            onClick={() => setShowAvatars(!showAvatars)}
            style={{
              position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%)',
              border: '1px solid #c0c0c0', borderRadius: 10,
              padding: '2px 12px',
              fontSize: 10, fontWeight: 800, color: '#3a6090',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              whiteSpace: 'nowrap', cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            Change ▾
          </button>

          {/* Avatar picker — rendered with high z-index, outside overflow clipping */}
          <AnimatePresence>
            {showAvatars && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                style={{
                  position: 'fixed', // ← KEY FIX: fixed instead of absolute
                  // We'll calculate position via JS or just center it smartly
                  top: '45%',
                  left: '40%',
                  transform: 'translate(-50%, -10%)',
                  width: 320,
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                  border: '1px solid #b0b0b0', borderRadius: 8,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 12px 40px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                  zIndex: 9999, // ← above everything
                }}
              >
                {/* Picker title bar */}
                <div style={{
                  height: 30,
                  background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                  borderBottom: '1px solid #1e4fa0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingLeft: 12, paddingRight: 7,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 14, height: 14,
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="8" height="8" rx="1" fill="white"/>
                        <rect x="13" y="3" width="8" height="8" rx="1" fill="white"/>
                        <rect x="3" y="13" width="8" height="8" rx="1" fill="white"/>
                        <rect x="13" y="13" width="8" height="8" rx="1" fill="white"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Segoe UI, Tahoma, sans-serif', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                      Choose display picture
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAvatars(false)}
                    style={{
                      width: 20, height: 17,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)',
                      border: '1px solid #8a1a08', borderRadius: 3, color: 'white', cursor: 'pointer',
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>

                {/* Grid */}
                <div style={{ padding: 12, maxHeight: 260, overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {AVATARS.map((url, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setAvatar(url); setShowAvatars(false); }}
                        style={{
                          aspectRatio: '1',
                          borderRadius: 7,
                          cursor: 'pointer',
                          border: avatar === url ? '2px solid #4a85d8' : '2px solid transparent',
                          boxShadow: avatar === url
                            ? '0 0 0 2px rgba(74,133,216,0.3), 0 2px 6px rgba(49,105,198,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                          background: '#e8e8e8',
                          transition: 'border-color 0.1s, box-shadow 0.1s',
                        }}
                      >
                        <img
                          src={url}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          alt={`Avatar ${idx}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Picker footer */}
                <div style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
                  borderTop: '1px solid #c0c0c0',
                  display: 'flex', justifyContent: 'flex-end',
                }}>
                  <button
                    onClick={() => setShowAvatars(false)}
                    style={{
                      height: 22, paddingLeft: 14, paddingRight: 14,
                      background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                      border: '1px solid #c0c0c0', borderRadius: 3,
                      fontSize: 11, fontWeight: 700, color: '#444',
                      fontFamily: 'Segoe UI, Tahoma, sans-serif', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Name + email */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1, marginTop: 14, width: '100%' }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: '#fff',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textAlign: 'center',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            width: '100%',
          }}>
            {username || 'Your Name'}
          </span>
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,0.65)',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textAlign: 'center',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            width: '100%',
          }}>
            {user.email}
          </span>

          {/* Online pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 12, padding: '3px 12px', marginTop: 4,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'linear-gradient(180deg, #6dd84a 0%, #3aaa18 100%)',
              boxShadow: '0 0 6px rgba(100,220,60,0.7)',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
              Online
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Section header */}
        <div style={{
          height: 38,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #eeeeee 100%)',
          borderBottom: '1px solid #d8d8d8',
          display: 'flex', alignItems: 'center',
          paddingLeft: 18, gap: 9,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
        }}>
          <div style={{
            width: 18, height: 18,
            background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
            border: '1px solid #1e4fa0', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
            <svg width="10" height="10" viewBox="0 0 9 9" fill="none">
              <circle cx="4.5" cy="3" r="2" stroke="white" strokeWidth="1.2"/>
              <path d="M1 8c0-1.657 1.567-3 3.5-3S8 6.343 8 8" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#444', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
            Account Information
          </span>
        </div>

        {/* Fields */}
        <div style={{
          flex: 1,
          padding: '18px 22px',
          display: 'flex', flexDirection: 'column', gap: 14,
          background: '#fafafa',
        }}>
          {[
            { label: 'Email Address', type: 'text', value: user.email, onChange: undefined, disabled: true, placeholder: '', icon: <Mail size={14} color="#7aaee0" /> },
            { label: 'Display Name', type: 'text', value: username, onChange: (e: any) => setUsername(e.target.value), disabled: false, placeholder: 'Your display name', icon: <User size={14} color="#7aaee0" /> },
            { label: 'New Password', type: showNewPassword ? 'text' : 'password', value: newPassword, onChange: (e: any) => setNewPassword(e.target.value), disabled: false, placeholder: 'Leave empty to keep current', icon: <Lock size={14} color="#7aaee0" />, showToggle: true, toggle: () => setShowNewPassword(!showNewPassword), isVisible: showNewPassword },
            { label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password', value: confirmPassword, onChange: (e: any) => setConfirmPassword(e.target.value), disabled: false, placeholder: 'Confirm new password', icon: <Lock size={14} color="#7aaee0" />, showToggle: true, toggle: () => setShowConfirmPassword(!showConfirmPassword), isVisible: showConfirmPassword },
          ].map((field, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{
                fontSize: 10, fontWeight: 800, color: '#5a7fa8',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.07em', marginLeft: 2,
              }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                  {field.icon}
                </div>
                <input
                  type={field.type as string}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', height: 36,
                    paddingLeft: 32, paddingRight: field.showToggle ? 36 : 12,
                    background: field.disabled ? '#f0f0f0' : '#ffffff',
                    border: `1px solid ${field.disabled ? '#d8d8d8' : '#c0d4ec'}`,
                    borderRadius: 5,
                    fontSize: 13,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: field.disabled ? '#999' : '#222',
                    outline: 'none',
                    boxShadow: field.disabled ? 'none' : 'inset 0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'all 0.1s',
                    boxSizing: 'border-box',
                    cursor: field.disabled ? 'not-allowed' : 'text',
                  }}
                  onFocus={e => {
                    if (!field.disabled) {
                      e.currentTarget.style.borderColor = '#4a85d8';
                      e.currentTarget.style.background = '#f6faff';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(49,105,198,0.08), 0 0 0 2px rgba(74,133,216,0.12)';
                    }
                  }}
                  onBlur={e => {
                    if (!field.disabled) {
                      e.currentTarget.style.borderColor = '#c0d4ec';
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.06)';
                    }
                  }}
                />
                {field.showToggle && (
                  <button
                    type="button"
                    onClick={field.toggle}
                    style={{
                      position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#bbb', padding: 0, display: 'flex', alignItems: 'center',
                      transition: 'color 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#4a85d8'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#bbb'; }}
                  >
                    {field.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <p style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic', fontFamily: 'Segoe UI, Tahoma, sans-serif', margin: 0 }}>
            ✦ This is how you appear to your contacts.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 22px',
          background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
          borderTop: '1px solid #c0c0c0',
          display: 'flex', gap: 8, justifyContent: 'flex-end',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSave({ email: user.email, username, avatar, password: newPassword || confirmPassword, token: user.token })}
            style={{
              height: 30, paddingLeft: 20, paddingRight: 20,
              background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: '1px solid #1e4fa0', borderRadius: 5,
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#fff', cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(42,95,181,0.3)',
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)'; }}
          >
            ✓ Save Changes
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              height: 30, paddingLeft: 20, paddingRight: 20,
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
              border: '1px solid #c0c0c0', borderRadius: 5,
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#444', cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)'; e.currentTarget.style.borderColor = '#aaa'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)'; e.currentTarget.style.borderColor = '#c0c0c0'; }}
          >
            <X size={12} /> Cancel
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
</div>
  );
}


export default ProfileDialog