import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Settings, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { UserData } from '../../types';
import { EXISTING_USERS, AVATARS, MSN_LOGO_URL } from '../../constants';
import { Toast } from '../common/Toast';
import { TitleBar } from '../common/TitleBar';


interface SignupPageProps {
  onSignup: (data: UserData) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isSignIn, setIsSignIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [serverLink, setServerLink] = useState(() => localStorage.getItem('server_link') || 'http://localhost');
  const [serverPort, setServerPort] = useState(() => localStorage.getItem('server_port') || '5000');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverLink}:${serverPort}/Dot/`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.status === "Online") {
          setConnectionStatus('success');
          localStorage.setItem('server_link', serverLink);
          localStorage.setItem('server_port', serverPort);
          setToast({ message: 'Messenger Server is Online!', type: 'success' });
        } else {
          throw new Error('Invalid server response');
        }
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      setConnectionStatus('error');
      setToast({ message: 'Could not reach server. Check link and port.', type: 'error' });
    } finally {
      setIsTestingConnection(false);
      // Removed the auto-close of settings dialog to allow user to see the status
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Please fill in all fields!', type: 'error' });
      return;
    }

    if (isSignIn) {
      // In a real app we'd verify credentials here.
      onSignup({ email, avatar: selectedAvatar });
    } else {
      if (!username) {
        setToast({ message: 'Please enter your name!', type: 'error' });
        return;
      }

      if (password !== confirmPassword) {
        setToast({ message: 'Passwords do not match!', type: 'error' });
        return;
      }

      console.log(selectedAvatar)

      const res = await fetch(`${serverLink}:${serverPort}/Dot/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, avatar: selectedAvatar, password, username })
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error, type: 'error' });
        return;
      }

      localStorage.setItem("chat_token", data.token);
      localStorage.setItem("chat_email", data.email);
      localStorage.setItem("chat_username", data.username);
      localStorage.setItem("chat_avatar", data.avatar);

      onSignup(data);

    }
  };

  return (
    <div
        className="w-full flex items-center justify-center p-4 font-sans h-[100vh]"
        style={{
          background: 'linear-gradient(180deg, #c0d8f0 0%, #ffffff 50%, #c0d8f0 100%)',
        }}
      >
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          {/* Settings Dialog */}
          {showSettings && (
            <div className="fixed inset-0 flex items-center justify-center z-[100] p-4"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  width: 420,
                  display: 'flex', flexDirection: 'column',
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                  border: '1px solid #b0b0b0',
                  borderRadius: 8,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                {/* Settings title bar */}
                <div style={{
                  height: 32,
                  background: 'linear-gradient(180deg, #1a6fd4 0%, #0d4a9e 100%)',
                  borderBottom: '1px solid #0a3a80',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingLeft: 10, paddingRight: 6,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Settings size={14} color="white" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'Segoe UI, Tahoma, sans-serif', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                      Server Configuration
                    </span>
                  </div>
                  <button onClick={() => setShowSettings(false)} style={{
                    width: 22, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)',
                    border: '1px solid #8a1a08', borderRadius: 3, color: 'white', cursor: 'pointer',
                  }}>
                    <X size={11} />
                  </button>
                </div>

                <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Server Address', placeholder: 'http://192.168.206.1', value: serverLink, onChange: (e: any) => setServerLink(e.target.value) },
                    { label: 'Port', placeholder: '5000', value: serverPort, onChange: (e: any) => setServerPort(e.target.value) },
                  ].map(field => (
                    <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 10, fontWeight: 800, color: '#7aaee0', fontFamily: 'Segoe UI, Tahoma, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        style={{
                          height: 30, paddingLeft: 10, paddingRight: 10,
                          background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
                          border: '1px solid #b0c8e8', borderRadius: 4,
                          fontSize: 12, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#333',
                          outline: 'none', boxShadow: 'inset 0 1px 2px rgba(49,105,198,0.08)',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#b0c8e8'; }}
                      />
                    </div>
                  ))}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                    <button
                      type="button"
                      onClick={testConnection}
                      disabled={isTestingConnection}
                      style={{
                        flex: 1, height: 30,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                        border: '1px solid #c0c0c0', borderRadius: 4,
                        fontSize: 12, fontWeight: 700, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#444',
                        cursor: isTestingConnection ? 'not-allowed' : 'pointer',
                        opacity: isTestingConnection ? 0.6 : 1,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                      }}
                    >
                      {isTestingConnection ? <><Loader2 size={13} className="animate-spin" /> Testing...</> : 'Test Connection'}
                    </button>

                    {connectionStatus === 'success' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'linear-gradient(180deg, #e8f8e0 0%, #cce8b8 100%)', border: '1px solid #80c060', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#3a8020', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
                        <CheckCircle2 size={13} /> Connected
                      </div>
                    )}
                    {connectionStatus === 'error' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'linear-gradient(180deg, #ffeaea 0%, #ffd0d0 100%)', border: '1px solid #e08080', borderRadius: 4, fontSize: 11, fontWeight: 700, color: '#cc2222', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
                        <XCircle size={13} /> Failed
                      </div>
                    )}
                  </div>
                </div>

                <div style={{
                  padding: '8px 18px',
                  background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
                  borderTop: '1px solid #c0c0c0',
                  display: 'flex', justifyContent: 'flex-end',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                }}>
                  <button onClick={() => setShowSettings(false)} style={{
                    height: 28, paddingLeft: 20, paddingRight: 20,
                    background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                    border: '1px solid #1e4fa0', borderRadius: 4,
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    fontFamily: 'Segoe UI, Tahoma, sans-serif', cursor: 'pointer',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}>
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main login window */}
        <div style={{
          width: 580,
          maxWidth: '98vw',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)',
          border: '1px solid #a8a8a8',
          borderRadius: 8,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 40px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}>
          <TitleBar title="Dot Messenger" variant="live" />

          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 300, color: '#1a3e7a', fontFamily: 'Segoe UI, Tahoma, sans-serif', letterSpacing: '-0.02em' }}>
                {isSignIn ? 'Sign in to' : 'Sign up to'}
              </span>
              <span style={{ fontSize: 28, fontWeight: 400, color: '#1a3e7a', fontFamily: 'Segoe UI, Tahoma, sans-serif', letterSpacing: '-0.02em' }}>
                Dot <strong style={{ fontWeight: 900 }}>Messenger</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

              {/* Avatar section */}
              {!isSignIn && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      onClick={() => setShowAvatarList(!showAvatarList)}
                      style={{
                        width: 140, height: 140,
                        background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                        border: '2px solid #7aaee0',
                        borderRadius: 14,
                        padding: 5,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 10px rgba(49,105,198,0.2)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#4a85d8';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 14px rgba(49,105,198,0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#7aaee0';
                        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 10px rgba(49,105,198,0.2)';
                      }}
                    >
                      <img src={selectedAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9, display: 'block' }} alt="Avatar" />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 9,
                        transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'Segoe UI, Tahoma, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.5)', opacity: 0 }}
                          className="group-hover:opacity-100"
                        >
                          Change Picture
                        </span>
                      </div>
                    </div>

                    {/* Avatar picker dropdown */}
                    <AnimatePresence>
                      {showAvatarList && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          style={{
                            position: 'absolute',
                            top: '100%', left: 0,
                            marginTop: 8,
                            width: 320,
                            background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                            border: '1px solid #b0b0b0',
                            borderRadius: 6,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 6px 20px rgba(0,0,0,0.2)',
                            zIndex: 20,
                            overflow: 'hidden',
                          }}
                        >
                          {/* Picker title bar */}
                          <div style={{
                            height: 28,
                            background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                            borderBottom: '1px solid #1e4fa0',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            paddingLeft: 10, paddingRight: 6,
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
                              Choose your display picture
                            </span>
                            <button onClick={() => setShowAvatarList(false)} style={{
                              width: 18, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'linear-gradient(180deg, #e05a38 0%, #b83018 100%)',
                              border: '1px solid #8a1a08', borderRadius: 2, color: 'white', cursor: 'pointer',
                            }}>
                              <X size={9} />
                            </button>
                          </div>

                          <div style={{ padding: 10, maxHeight: 220, overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                              {AVATARS.map((url, idx) => (
                                <motion.img
                                  key={idx}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  src={url}
                                  onClick={() => { setSelectedAvatar(url); setShowAvatarList(false); }}
                                  style={{
                                    width: '100%', aspectRatio: '1', objectFit: 'cover',
                                    borderRadius: 5, cursor: 'pointer',
                                    border: selectedAvatar === url ? '2px solid #4a85d8' : '2px solid transparent',
                                    boxShadow: selectedAvatar === url ? '0 0 0 1px #4a85d8, 0 2px 6px rgba(49,105,198,0.3)' : 'none',
                                  }}
                                  alt={`Avatar ${idx}`}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Help + Settings links */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <HelpCircle size={14} color="#2a5fb5" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#2a5fb5', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>Need help?</span>
                    </div>
                    <button type="button" onClick={() => setShowSettings(true)} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <Settings size={13} color="#2a5fb5" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#2a5fb5', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>Server Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

                {[
                  { label: 'Email address', type: 'email', placeholder: 'example555@hotmail.com', value: email, onChange: (e: any) => setEmail(e.target.value), show: true },
                  { label: 'Full Name', type: 'text', placeholder: 'Your Name', value: username, onChange: (e: any) => setUsername(e.target.value), show: !isSignIn },
                  { label: isSignIn ? 'Password' : 'Create password', type: 'password', placeholder: 'Password', value: password, onChange: (e: any) => setPassword(e.target.value), show: true },
                  { label: 'Confirm password', type: 'password', placeholder: 'Confirm Password', value: confirmPassword, onChange: (e: any) => setConfirmPassword(e.target.value), show: !isSignIn },
                ].filter(f => f.show).map(field => (
                  <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#555', fontFamily: 'Segoe UI, Tahoma, sans-serif', marginLeft: 2 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={field.onChange}
                      style={{
                        height: 32,
                        paddingLeft: 10, paddingRight: 10,
                        background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
                        border: '1px solid #b0c8e8',
                        borderRadius: 4,
                        fontSize: 13,
                        fontFamily: 'Segoe UI, Tahoma, sans-serif',
                        color: '#222',
                        outline: 'none',
                        boxShadow: 'inset 0 1px 2px rgba(49,105,198,0.08)',
                        transition: 'border-color 0.1s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(49,105,198,0.1), 0 0 0 2px rgba(74,133,216,0.1)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#b0c8e8'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(49,105,198,0.08)'; }}
                    />
                  </div>
                ))}

                {/* Remember me */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <input type="checkbox" id="remember" style={{ width: 14, height: 14, accentColor: '#2a5fb5', cursor: 'pointer' }} />
                  <label htmlFor="remember" style={{ fontSize: 12, color: '#555', fontFamily: 'Segoe UI, Tahoma, sans-serif', cursor: 'pointer' }}>
                    Remember my ID and password
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    style={{
                      flex: 1, height: 34,
                      background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                      border: '1px solid #1e4fa0', borderRadius: 5,
                      fontSize: 13, fontWeight: 700,
                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                      color: '#fff', cursor: 'pointer',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(42,95,181,0.3)',
                      textShadow: '0 1px 1px rgba(0,0,0,0.2)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)'; }}
                  >
                    {isSignIn ? 'Sign in' : 'Sign up'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    style={{
                      flex: 1, height: 34,
                      background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                      border: '1px solid #c0c0c0', borderRadius: 5,
                      fontSize: 13, fontWeight: 700,
                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                      color: '#444', cursor: 'pointer',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)'; e.currentTarget.style.borderColor = '#aaa'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)'; e.currentTarget.style.borderColor = '#c0c0c0'; }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Toggle sign in/up */}
            <div style={{ textAlign: 'center', fontSize: 12, color: '#666', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
              {isSignIn ? (
                <>Don't have a Dot Messenger ID?{' '}
                  <span onClick={() => setIsSignIn(false)} style={{ color: '#2a5fb5', fontWeight: 700, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                  >Sign up</span>
                </>
              ) : (
                <>Already have a Dot Messenger ID?{' '}
                  <span onClick={() => setIsSignIn(true)} style={{ color: '#2a5fb5', fontWeight: 700, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                  >Sign in</span>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            height: 40,
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
            borderTop: '1px solid #c0c0c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 24,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            {['Privacy statement', 'Terms of use', 'Server status', 'About'].map(link => (
              <span
                key={link}
                style={{ fontSize: 11, color: '#777', fontFamily: 'Segoe UI, Tahoma, sans-serif', cursor: 'pointer', transition: 'color 0.1s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.color = '#2a5fb5'; (e.currentTarget as HTMLSpanElement).style.textDecoration = 'underline'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.color = '#777'; (e.currentTarget as HTMLSpanElement).style.textDecoration = 'none'; }}
              >
                {link}
              </span>
            ))}
          </div>
        </div>
    </div>
  );
};
