import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Paperclip, Video, Mic, 
  Gamepad2, Puzzle, Type, Smile, 
  Gift, ImageIcon, Search, MoreHorizontal,
  Plus, Minus as MinusIcon, X
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Message, UserData } from '../../types';
import { MSN_LOGO_URL, ALL_EMOJIS, ONLINE_USERS, AVATARS } from '../../constants';
import { TitleBar } from '../common/TitleBar';

interface ChatPageProps {
  user: UserData;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'them', text: 'you got any plans?', type: 'text', timestamp: new Date() },
    { id: '2', sender: 'them', text: 'I miss you ☹️', type: 'text', timestamp: new Date() },
    { id: '3', sender: 'me', text: 'You have just sent a Nudge!', type: 'nudge', timestamp: new Date() },
    { id: '4', sender: 'them', text: 'Poops says: 🥺🫶', type: 'text', timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [activeDropdown, setActiveDropdown] = useState<'font' | 'emoji' | null>(null);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const windowControls = useAnimation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (msg: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      timestamp: new Date(),
      type: 'text',
      ...msg
    } as Message;
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage({ text: inputText, type: 'text' });
    setInputText('');
  };

  const handleNudge = () => {
    addMessage({ text: 'You have just sent a Nudge!', type: 'nudge' });
    windowControls.start({
      x: [0, -15, 15, -15, 15, 0],
      transition: { duration: 0.4 }
    });
  };

  const handleEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setActiveDropdown(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        addMessage({ imageUrl: event.target?.result as string, type: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addMessage({ text: `Voice Clip: ${file.name} (0:12)`, type: 'voice' });
    }
  };

  const handleGift = () => {
    setShowGiftDialog(true);
  };

  const handleOpenGift = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isOpened: true } : msg
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen w-full bg-[#ECE9D8] font-sans selection:bg-[#3169C6] selection:text-white flex flex-col overflow-hidden relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload} 
      />
      <input 
        type="file" 
        ref={voiceInputRef} 
        className="hidden" 
        accept="audio/*" 
        onChange={handleVoiceUpload} 
      />

      <AnimatePresence>
        {showGiftDialog && (
          <GiftDialog 
            onClose={() => setShowGiftDialog(false)} 
            onSend={(msg, count) => {
              addMessage({ 
                text: msg, 
                type: 'gift', 
                isOpened: false 
              });
              setShowGiftDialog(false);
            }} 
          />
        )}
        {showProfileDialog && (
          <ProfileDialog 
            user={currentUser}
            onClose={() => setShowProfileDialog(false)}
            onSave={(updatedUser) => {
              setCurrentUser(updatedUser);
              setShowProfileDialog(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        animate={windowControls}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TitleBar title={`Conversation - Poops (${currentUser.email})`} />

        {/* Menu Bar */}
        <div className="h-7 bg-[#ECE9D8] border-b border-[#ACA899] flex items-center px-2 gap-5 text-[11px] text-black select-none shrink-0">
          {['File', 'Edit', 'Actions', 'Tools', 'Help'].map(item => (
            <div key={item} className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default rounded-sm transition-colors">
              {item}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">
          
          {/* Left Column (Online Users) */}
          <div className="w-48 flex flex-col gap-4 shrink-0 overflow-hidden">
            {/* Online Users List */}
            <div className="flex-1 flex flex-col bg-white/50 border border-[#ACA899] rounded-md shadow-inner overflow-hidden">
              <div className="bg-gradient-to-b from-[#F4F2E8] to-[#D6D3C4] border-b border-[#ACA899] px-2 py-1 flex items-center gap-2">
                <User size={12} className="text-[#3169C6]" />
                <span className="text-[11px] font-bold text-gray-700">People Online</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollbar-thin">
                {ONLINE_USERS.map((onlineUser) => (
                  <div key={onlineUser.name} className="flex items-center gap-2 p-1 hover:bg-[#316AC5]/10 rounded cursor-pointer group transition-colors">
                    <div className="relative">
                      <img src={onlineUser.avatar} className="w-8 h-8 rounded border border-[#ACA899]" alt={onlineUser.name} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white shadow-sm ${
                        onlineUser.status === 'Online' ? 'bg-green-500' : 
                        onlineUser.status === 'Busy' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] font-bold text-gray-800 truncate group-hover:text-[#3169C6]">{onlineUser.name}</span>
                      <span className="text-[9px] text-gray-500 leading-none">{onlineUser.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column (Chat Area) */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Conversation Panel */}
            <div className="flex-1 bg-white border-2 border-[#ACA899] rounded-md shadow-inner overflow-y-auto p-5 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#ACA899] scrollbar-track-[#F1F1F1]">
              <div className="text-[12px] text-[#808080] font-bold border-b border-[#F1F1F1] pb-2 mb-2 flex items-center gap-2">
                <span className="text-[#3169C6]">To:</span> Poops
              </div>
              
              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm ${msg.type === 'nudge' ? 'text-center my-3' : ''}`}>
                  {msg.type === 'text' && (
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You say:' : 'Poops says:'}
                      </span>
                      <span className="text-[14px] ml-3 leading-relaxed">{msg.text}</span>
                    </div>
                  )}
                  {msg.type === 'image' && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You sent a photo:' : 'Poops sent a photo:'}
                      </span>
                      <img src={msg.imageUrl} className="max-w-[200px] rounded-md border border-gray-200 shadow-sm ml-3" alt="Sent photo" />
                    </div>
                  )}
                  {msg.type === 'voice' && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You sent:' : 'Poops sent:'}
                      </span>
                      <div className="ml-3 py-2 px-4 bg-[#F0F7FF] border border-[#3169C6]/20 rounded-md flex items-center gap-2 text-[#3169C6] font-medium">
                        <Mic size={16} />
                        {msg.text}
                      </div>
                    </div>
                  )}
                  {msg.type === 'gift' && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You sent a gift:' : 'Poops sent a gift:'}
                      </span>
                      <div className="ml-3 py-2 px-4 bg-[#FFF0F5] border border-[#E96E4C]/20 rounded-md flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[#E96E4C] font-bold">
                          <Gift size={16} />
                          {msg.isOpened ? 'Gift Opened!' : 'You have a new gift!'}
                        </div>
                        {msg.isOpened ? (
                          <div className="text-sm text-gray-700 italic bg-white/50 p-2 rounded border border-[#E96E4C]/10">
                            "{msg.text}"
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleOpenGift(msg.id)}
                            className="text-[11px] font-bold text-white bg-[#E96E4C] px-3 py-1 rounded hover:brightness-110 transition-all self-start shadow-sm"
                          >
                            View Action
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {msg.type === 'nudge' && (
                    <div className="py-2 px-6 bg-[#F8F8F8] border-y border-[#ACA899] inline-block mx-auto rounded-md italic text-[#666] text-[13px] shadow-sm">
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Formatting Toolbar */}
            <div className="h-10 flex items-center px-2 gap-2 select-none shrink-0 bg-[#F4F2E8]/30 rounded-md relative">
              <div className="relative">
                <FormatButton 
                  icon={<Type size={16} />} 
                  onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')} 
                />
                <AnimatePresence>
                  {activeDropdown === 'font' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full mb-2 left-0 bg-white border border-[#ACA899] rounded-md shadow-xl p-1 flex flex-col gap-1 z-30 w-24"
                    >
                      <button 
                        onClick={() => { setFontSize(prev => Math.min(prev + 2, 24)); setActiveDropdown(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316AC5] hover:text-white text-[11px] font-bold transition-colors rounded-sm"
                      >
                        <Plus size={12} /> +inc
                      </button>
                      <button 
                        onClick={() => { setFontSize(prev => Math.max(prev - 2, 10)); setActiveDropdown(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316AC5] hover:text-white text-[11px] font-bold transition-colors rounded-sm"
                      >
                        <MinusIcon size={12} /> -dec
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <FormatButton 
                  icon={<Smile size={16} />} 
                  onClick={() => setActiveDropdown(activeDropdown === 'emoji' ? null : 'emoji')} 
                />
                <AnimatePresence>
                  {activeDropdown === 'emoji' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full mb-2 left-0 bg-white border border-[#ACA899] rounded-md shadow-xl p-2 z-30 w-48"
                    >
                      <div className="text-[10px] font-bold text-gray-500 mb-2 border-b pb-1">Show all emojis</div>
                      <div className="grid grid-cols-6 gap-1">
                        {ALL_EMOJIS.map(emoji => (
                          <button 
                            key={emoji}
                            onClick={() => handleEmoji(emoji)}
                            className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-5 w-[1px] bg-[#ACA899] mx-1"></div>
              <FormatButton icon={<Mic size={16} />} label="Voice Clip" onClick={() => voiceInputRef.current?.click()} />
              <FormatButton icon={<ImageIcon size={16} />} onClick={() => fileInputRef.current?.click()} />
              <FormatButton icon={<Gift size={16} />} onClick={() => setShowGiftDialog(true)} />
            </div>

            {/* Input Section */}
            <div className="h-28 flex gap-3 shrink-0">
              <textarea 
                className="flex-1 bg-white border-2 border-[#ACA899] rounded-md p-3 focus:outline-none focus:border-[#0055E5] focus:ring-2 focus:ring-[#0055E5]/10 resize-none shadow-inner transition-all"
                style={{ fontSize: `${fontSize}px` }}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setIsTyping(true);
                  setTimeout(() => setIsTyping(false), 3000);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <div className="w-28 flex flex-col gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  className="flex-1 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
                >
                  Send
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNudge}
                  className="h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-[12px] font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all flex items-center justify-center gap-2"
                >
                  <Search size={14} /> Search
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column (Avatars) */}
          <div className="w-40 flex flex-col gap-6 shrink-0">
            {/* Top Display Picture */}
            <div className="relative group">
              <div className="w-full aspect-square bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="w-full h-full bg-[#F0F0F0] rounded-lg flex items-center justify-center overflow-hidden border border-black/5">
                  <img src="https://picsum.photos/seed/poops/300/300" className="w-full h-full object-cover" alt="Poops" />
                </div>
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-10 bg-[#D6D3C4] border border-[#ACA899] rounded-l-md flex items-center justify-center cursor-pointer hover:bg-[#ECE9D8] transition-colors shadow-sm">
                <div className="w-1.5 h-5 border-l border-r border-[#ACA899]"></div>
                <div className="absolute right-0 bottom-0 w-3 h-3 border-l border-t border-[#ACA899] flex items-center justify-center">
                   <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-gray-600"></div>
                </div>
              </div>
            </div>

            {/* Bottom Display Picture */}
            <div className="relative group mt-auto">
              <div className="w-full aspect-square bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="w-full h-full bg-[#F0F0F0] rounded-lg flex items-center justify-center overflow-hidden border border-black/5">
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Me" />
                </div>
              </div>
              <div 
                onClick={() => setShowProfileDialog(true)}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-10 bg-[#D6D3C4] border border-[#ACA899] rounded-l-md flex items-center justify-center cursor-pointer hover:bg-[#ECE9D8] transition-colors shadow-sm"
              >
                <div className="w-1.5 h-5 border-l border-r border-[#ACA899]"></div>
                <div className="absolute right-0 bottom-0 w-3 h-3 border-l border-t border-[#ACA899] flex items-center justify-center">
                   <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-gray-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="h-8 bg-[#ECE9D8] border-t border-[#ACA899] px-4 flex items-center justify-between text-[11px] text-black select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#0055E5] cursor-pointer hover:underline transition-all">Click for new Emoticons and Theme Packs from Blue Mountain</span>
          </div>
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="italic text-[#666] font-medium"
            >
              Poops is typing...
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#0055E5] rounded-sm shadow-sm"></div>
            <div className="w-4 h-4 bg-[#ACA899] rounded-sm shadow-sm"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function GiftDialog({ onClose, onSend }: { onClose: () => void, onSend: (msg: string, count: number) => void }) {
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[400px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="h-8 bg-gradient-to-b from-[#0058E6] via-[#3C96FF] to-[#0058E6] flex items-center justify-between px-2">
          <span className="text-white font-bold text-xs">Send a Gift</span>
          <button onClick={onClose} className="text-white hover:bg-red-500 p-1 rounded transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Gift Message</label>
            <input 
              type="text" 
              className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
              placeholder="Enter your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Number of people who can open it (Max 5)</label>
            <select 
              className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              disabled={count >= 5}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
            {count >= 5 && <p className="text-[10px] text-red-500 font-bold mt-1">Maximum limit reached (5). Deactivated automatically.</p>}
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => onSend(msg, count)}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
            >
              Send Gift
            </button>
            <button 
              onClick={onClose}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProfileDialog({ user, onClose, onSave }: { user: UserData, onClose: () => void, onSave: (user: UserData) => void }) {
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [showAvatars, setShowAvatars] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[450px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <TitleBar title="Edit Profile" />
        <div className="p-8 flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => setShowAvatars(!showAvatars)}>
                <div className="w-24 h-24 bg-white border-4 border-[#88C057] rounded-xl p-1 shadow-md overflow-hidden flex items-center justify-center">
                  <img src={avatar} className="w-full h-full object-cover rounded-lg" alt="Avatar" />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white text-[10px] font-bold">Change</span>
                </div>
              </div>
              <AnimatePresence>
                {showAvatars && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute mt-28 bg-white border border-[#ACA899] rounded-lg shadow-xl p-2 grid grid-cols-3 gap-2 z-50 w-40"
                  >
                    {AVATARS.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        className="w-10 h-10 rounded cursor-pointer hover:border-2 hover:border-[#88C057]"
                        onClick={() => { setAvatar(url); setShowAvatars(false); }}
                        alt="Avatar"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Display Name / Email</label>
                <input 
                  type="text" 
                  className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-gray-500 italic">This is how you appear to your contacts.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => onSave({ email, avatar })}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all"
            >
              Save Changes
            </button>
            <button 
              onClick={onClose}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
    >
      <div className="w-12 h-12 bg-gradient-to-b from-white to-[#E8E8E8] border border-[#ACA899] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-active:shadow-inner transition-all overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent h-1/2 rounded-t-xl"></div>
        <div className="text-[#3169C6] z-10 drop-shadow-sm">{icon}</div>
      </div>
      <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#0055E5] group-hover:underline transition-colors">{label}</span>
    </motion.div>
  );
}

function FormatButton({ icon, label, onClick }: { icon: React.ReactNode, label?: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`h-7 px-2 flex items-center gap-2 border border-transparent hover:border-[#ACA899] hover:bg-white/60 rounded-md cursor-pointer transition-all ${label ? 'pr-3' : ''}`}
    >
      <div className="text-[#3169C6] drop-shadow-sm">{icon}</div>
      {label && <span className="text-[11px] font-medium text-gray-700">{label}</span>}
      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500 ml-1"></div>
    </div>
  );
}
