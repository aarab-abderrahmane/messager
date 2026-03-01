import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';
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


  console.log(selectedAvatar)

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
      // if (EXISTING_USERS.includes(email)) {
      //   setToast({ message: 'Email already exists!', type: 'error' });
      //   return;
      // }
      if (password !== confirmPassword) {
        setToast({ message: 'Passwords do not match!', type: 'error' });
        return;
      }

      console.log(selectedAvatar)

      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email ,avatar :  selectedAvatar , password , username })
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
    <div className=" w-full bg-gradient-to-b from-[#C9E0F7] via-[#FFFFFF] to-[#C9E0F7] flex items-center justify-center p-4 font-sans">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="w-[640px] bg-white border border-[#A0A0A0] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <TitleBar title="Windows Live Messenger" variant="live" />

        <div className="p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-[#003399] font-light tracking-tight">{isSignIn ? 'Sign in to' : 'Sign up to'}</h1>
            <h2 className="text-4xl text-[#003399] font-medium tracking-tight">Windows Live <span className="font-bold">Messenger</span></h2>
          </div>

          <div className="flex gap-10">
            {/* Avatar Section */}
            {
              !isSignIn && (
                <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div
                  className="w-36 h-36 bg-white border-4 border-[#88C057] rounded-2xl p-1 shadow-lg overflow-hidden flex items-center justify-center group cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setShowAvatarList(!showAvatarList)}
                >
                  <img src={selectedAvatar} className="w-full h-full object-cover rounded-xl" alt="Selected Avatar" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="text-white text-sm font-bold drop-shadow-md">Change Picture</span>
                  </div>
                </div>

                <AnimatePresence>
                  {showAvatarList && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-full mt-4 left-0 bg-white border border-[#A0A0A0] rounded-xl shadow-2xl z-20 w-96 overflow-hidden flex flex-col"
                    >
                      <div className="bg-[#F3F3F3] border-b border-[#E0E0E0] p-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700">Choose your dynamic picture</span>
                        <button 
                          onClick={() => setShowAvatarList(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-5 gap-3">
                          {AVATARS.map((url, idx) => (
                            <motion.img
                              key={idx}
                              whileHover={{ scale: 1.1, zIndex: 10 }}
                              whileTap={{ scale: 0.95 }}
                              src={url}
                              className={`w-14 h-14 rounded-lg cursor-pointer border-2 transition-all object-cover ${selectedAvatar === url ? 'border-[#88C057] shadow-md ring-2 ring-[#88C057]/20' : 'border-transparent hover:border-gray-300'
                                }`}
                              onClick={() => {
                                setSelectedAvatar(url);
                                setShowAvatarList(false);
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
              <div className="flex items-center gap-2 text-[#003399] cursor-pointer hover:underline">
                <HelpCircle size={18} />
                <span className="text-xs font-medium">Need help?</span>
              </div>
            </div>
              )
            }

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center gap-4 max-w-[60%] mx-auto">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 ml-1">Email address</label>
                <input
                  type="email"
                  placeholder="example555@hotmail.com"
                  className="w-full h-10 px-3 border border-[#A0A0A0] rounded-md text-sm focus:outline-none focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 transition-all shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {!isSignIn && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full h-10 px-3 border border-[#A0A0A0] rounded-md text-sm focus:outline-none focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 transition-all shadow-inner"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 ml-1">{isSignIn ? 'Password' : 'Create password'}</label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-10 px-3 border border-[#A0A0A0] rounded-md text-sm focus:outline-none focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isSignIn && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 ml-1">Confirm password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full h-10 px-3 border border-[#A0A0A0] rounded-md text-sm focus:outline-none focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20 transition-all shadow-inner"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#003399] focus:ring-[#003399]" />
                  <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer group-hover:text-black transition-colors">Remember my ID and password</label>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <input type="checkbox" id="auto" className="w-4 h-4 rounded border-gray-300 text-[#003399] focus:ring-[#003399]" />
                  <label htmlFor="auto" className="text-xs text-gray-600 cursor-pointer group-hover:text-black transition-colors">Sign me in automatically</label>
                  <span className="text-xs text-[#003399] font-medium cursor-pointer hover:underline ml-auto">Options</span>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#A0A0A0] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
                >
                  {isSignIn ? 'Sign in' : 'Sign up'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#A0A0A0] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>

          <div className="text-xs text-center text-gray-500 mt-6">
            {isSignIn ? (
              <>Don't have a Windows Live ID? <span onClick={() => setIsSignIn(false)} className="text-[#003399] font-bold cursor-pointer hover:underline">Sign up</span></>
            ) : (
              <>Already have a Windows Live ID? <span onClick={() => setIsSignIn(true)} className="text-[#003399] font-bold cursor-pointer hover:underline">Sign in</span></>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-auto h-14 border-t border-[#E0E0E0] flex items-center justify-center gap-8 text-[11px] text-gray-500 bg-[#FBFBFB]">
          {['Privacy statement', 'Terms of use', 'Server status', 'About'].map(link => (
            <span key={link} className="cursor-pointer hover:text-[#003399] hover:underline transition-colors">{link}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
