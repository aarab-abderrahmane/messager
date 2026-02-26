import React, { useState, useRef, useEffect } from 'react';
import {
  User, Paperclip, Video, Mic,
  Gamepad2, Puzzle, Type, Smile,
  Gift, ImageIcon, Search, MoreHorizontal,
  Plus, Minus as MinusIcon, X, Reply,
  Calendar, Info, Globe, MessageSquare, Mail, Clock,
  Newspaper, ExternalLink, TrendingUp
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Message, UserData } from '../../types';
import { MSN_LOGO_URL, ALL_EMOJIS, ONLINE_USERS, AVATARS, STICKERS, GIFS } from '../../constants';
import { TitleBar } from '../common/TitleBar';

interface ChatPageProps {
  user: UserData;
}

const DEFAULT_THEME = {
  bgColor: '#ECE9D8',
  textColor: '#000000',
  appFontSize: 14,
  fontFamily: 'sans-serif'
};

export const ChatPage: React.FC<ChatPageProps> = ({ user }) => {
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [personalMessage, setPersonalMessage] = useState('Listening to: Linkin Park - In The End');
  const [status, setStatus] = useState<'Online' | 'Busy' | 'Away' | 'Offline'>('Online');
  const [messages, setMessages] = useState<Message[]>([
    { id: '2', sender: 'them',username: "data.username" , text: "data.message", type: 'text', timestamp: new Date() }

  ]);
  const ws = useRef(null);


    //       { id: '1', sender: 'them', text: 'you got any plans?', type: 'text', timestamp: new Date() },
    // { id: '2', sender: 'them', text: 'I miss you ☹️', type: 'text', timestamp: new Date() },
    // { id: '3', sender: 'me', text: 'You have just sent a Nudge!', type: 'nudge', timestamp: new Date() },
    // { id: '4', sender: 'them', text: 'Poops says: 🥺🫶', type: 'text', timestamp: new Date() }


  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [activeDropdown, setActiveDropdown] = useState<'font' | 'emoji' | null>(null);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [showUserProfileDialog, setShowUserProfileDialog] = useState(false);
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  const [showStickerDialog, setShowStickerDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);

  const [theme, setTheme] = useState(DEFAULT_THEME);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const windowControls = useAnimation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000"); // backend address
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "text") {
        setMessages((prev) => [...prev,
          { id: '2', sender: 'them',username: data.username , text: data.text, type: 'text', timestamp: new Date() }
        ]);
      }
    };
    return () => ws.current.close();
  }, []);

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
    const msgData: Partial<Message> = { text: inputText, type: 'text' ,username: currentUser.email || "abde"  };
    if (replyingTo) {
      msgData.replyTo = {
        id: replyingTo.id,
        text: replyingTo.text || (replyingTo.type === 'image' ? 'Photo' : replyingTo.type === 'voice' ? 'Voice Clip' : 'Gift'),
        sender: replyingTo.sender
      };
    }

    ws.current.send(JSON.stringify(msgData));
    // addMessage(msgData);
    setInputText('');
    setReplyingTo(null);
  };

  // const sendMessage = (msg) => {
  //   if (!msg) return;
  //   ws.current.send(JSON.stringify({ type: "CHAT", username: "Tester", message: msg }));
  // };


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
        setPendingPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMessage({ text: `Voice Clip: ${file.name}`, audioUrl: url, type: 'voice' });
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

  const handleSendSticker = (url: string, type: 'sticker' | 'gif') => {
    addMessage({ imageUrl: url, type: type });
    setShowStickerDialog(false);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };

        // If the same reaction is already there, remove it (toggle)
        if (reactions[reaction]) {
          delete reactions[reaction];
        } else {
          // Clear all other reactions and set the new one (only one allowed)
          Object.keys(reactions).forEach(key => delete reactions[key]);
          reactions[reaction] = 1;
        }

        return { ...msg, reactions };
      }
      return msg;
    }));
    setReactionMenuId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="h-screen w-full selection:bg-[#3169C6] selection:text-white flex flex-col overflow-hidden relative"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        fontSize: `${theme.appFontSize}px`
      }}
    >
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
        {showThemeDialog && (
          <ThemeDialog
            currentTheme={theme}
            onClose={() => setShowThemeDialog(false)}
            onSave={(newTheme) => {
              setTheme(newTheme);
              setShowThemeDialog(false);
            }}
          />
        )}
        {showUserProfileDialog && selectedUser && (
          <UserProfileDialog
            user={selectedUser}
            lastMessageObj={messages.filter(m => m.sender === 'them').slice(-1)[0]}
            onClose={() => setShowUserProfileDialog(false)}
          />
        )}
        {showNewsDialog && selectedNews && (
          <NewsDialog
            news={selectedNews}
            onClose={() => setShowNewsDialog(false)}
          />
        )}
        {showStickerDialog && (
          <StickerDialog
            onSelect={handleSendSticker}
            onClose={() => setShowStickerDialog(false)}
          />
        )}
        {previewImageUrl && (
          <PhotoPreviewDialog
            imageUrl={previewImageUrl}
            onClose={() => setPreviewImageUrl(null)}
          />
        )}
        {pendingPhotoUrl && (
          <PendingPhotoDialog
            imageUrl={pendingPhotoUrl}
            onClose={() => setPendingPhotoUrl(null)}
            onSend={(url) => {
              addMessage({ imageUrl: url, type: 'image' });
              setPendingPhotoUrl(null);
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
        <div className="h-7 border-b border-[#ACA899] flex items-center px-2 gap-5 text-[11px] select-none shrink-0" style={{ backgroundColor: theme.bgColor }}>
          {['File', 'Edit', 'Actions', 'Tools', 'Help'].map(item => (
            <div
              key={item}
              onClick={() => item === 'Edit' && setShowThemeDialog(true)}
              className="px-2 py-1 hover:bg-[#316AC5] hover:text-white cursor-default rounded-sm transition-colors"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">

          {/* Left Column (Online Users) */}
          <div className="w-48 xl:w-80 flex flex-col gap-4 shrink-0 overflow-hidden">
            {/* Online Users List */}
            <div className="flex-1 flex flex-col bg-white/50 border border-[#ACA899] rounded-md shadow-inner overflow-hidden">
              <div className="border-b border-[#ACA899] px-2 py-1 flex items-center gap-2" style={{ background: 'linear-gradient(to bottom, #F4F2E8, #D6D3C4)' }}>
                <User size={14} className="text-[#3169C6]" />
                <span className="text-[11px] xl:text-[13px] font-bold text-gray-700">People Online</span>
              </div>

              {/* Search Input */}
              <div className="p-2 border-b border-[#ACA899]/30 bg-white/30">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search people..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 xl:py-3 bg-white border border-[#ACA899] rounded text-[11px] xl:text-[12px] focus:outline-none focus:border-[#3169C6] transition-all placeholder:italic"
                  />
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 scrollbar-thin">
                {ONLINE_USERS.filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase())).map((onlineUser) => (
                  <div
                    key={onlineUser.name}
                    onClick={() => {
                      setSelectedUser(onlineUser);
                      setShowUserProfileDialog(true);
                    }}
                    className="flex items-center gap-2 p-1 hover:bg-[#316AC5]/10 rounded cursor-pointer group transition-colors"
                  >
                    <div className="relative">
                      <img src={onlineUser.avatar} className="w-8 h-8 xl:w-12 xl:h-12 rounded border border-[#ACA899]" alt={onlineUser.name} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full border border-white shadow-sm ${onlineUser.status === 'Online' ? 'bg-green-500' :
                        onlineUser.status === 'Busy' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] xl:text-[13px] font-bold truncate group-hover:text-[#3169C6]">{onlineUser.name}</span>
                      <span className="text-[9px] xl:text-[11px] opacity-60 leading-none">{onlineUser.status}</span>
                    </div>
                  </div>
                ))}
                {ONLINE_USERS.filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase())).length === 0 && (
                  <div className="text-[10px] text-gray-400 italic text-center py-4">No results found</div>
                )}
              </div>
            </div>
          </div>

          {/* Center Column (Chat Area) */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Conversation Panel */}
            <div className="flex-1 bg-white border-2 border-[#ACA899] rounded-md shadow-inner overflow-y-auto p-5 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#ACA899] scrollbar-track-[#F1F1F1]">
              <div className="text-[12px] font-bold border-b border-[#F1F1F1] pb-2 mb-2 flex items-center gap-2">
                <span className="text-[#3169C6]">To:</span> Poops
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`text-sm group relative ${msg.type === 'nudge' ? 'text-center my-3' : ''}`}>
                  {msg.type !== 'nudge' && (
                    <div className="absolute -right-2 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="relative">
                        <button
                          onClick={() => setReactionMenuId(reactionMenuId === msg.id ? null : msg.id)}
                          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#3169C6]"
                          title="React"
                        >
                          <Smile size={14} />
                        </button>
                        <AnimatePresence>
                          {reactionMenuId === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 5 }}
                              className="absolute bottom-full mb-1 right-0 bg-white border border-[#ACA899] rounded-full shadow-lg p-1 flex items-center gap-1 z-20"
                            >
                              {[
                                { emoji: '❤️', type: 'love' },
                                { emoji: '👍', type: 'like' },
                                { emoji: '👎', type: 'dislike' },
                                { emoji: '😂', type: 'fun' }
                              ].map(r => (
                                <button
                                  key={r.type}
                                  onClick={() => handleReaction(msg.id, r.emoji)}
                                  className="hover:scale-125 transition-transform p-1"
                                >
                                  {r.emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#3169C6]"
                        title="Reply"
                      >
                        <Reply size={14} />
                      </button>
                    </div>
                  )}

                  {msg.replyTo && (
                    <div className="ml-3 mb-1 p-2 bg-gray-50 border-l-4 border-[#3169C6]/30 rounded-r-md text-[11px] text-gray-500 italic max-w-[80%] truncate">
                      <span className="font-bold not-italic mr-1">
                        {msg.replyTo.sender === 'me' ? 'You' : 'Poops'}:
                      </span>
                      {msg.replyTo.text}
                    </div>
                  )}

                  {msg.type === 'text' && (
                    <div className="flex flex-col gap-0.5">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {/* {msg.sender === 'me' ? 'You say:' : 'Poops says:'} */}
                        {msg.username}
                      </span>
                      <span className="text-[14px] ml-3 leading-relaxed">{msg.text}</span>
                    </div>
                  )}
                  {msg.type === 'image' && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You sent a photo:' : 'Poops sent a photo:'}
                      </span>
                      <img
                        src={msg.imageUrl}
                        className="max-w-[200px] rounded-md border border-gray-200 shadow-sm ml-3 cursor-pointer hover:opacity-90 transition-opacity"
                        alt="Sent photo"
                        onClick={() => setPreviewImageUrl(msg.imageUrl || null)}
                      />
                    </div>
                  )}
                  {(msg.type === 'sticker' || msg.type === 'gif') && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? `You sent a ${msg.type}:` : `Poops sent a ${msg.type}:`}
                      </span>
                      <img src={msg.imageUrl} className="max-w-[150px] ml-3" alt={msg.type} />
                    </div>
                  )}
                  {msg.type === 'voice' && (
                    <div className="flex flex-col gap-1">
                      <span className={`font-bold text-[13px] ${msg.sender === 'me' ? 'text-[#3169C6]' : 'text-black'}`}>
                        {msg.sender === 'me' ? 'You sent:' : 'Poops sent:'}
                      </span>
                      <div className="ml-3 py-2 px-4 bg-[#F0F7FF] border border-[#3169C6]/20 rounded-md flex flex-col gap-2 text-[#3169C6] font-medium">
                        <div className="flex items-center gap-2">
                          <Mic size={16} />
                          {msg.text}
                        </div>
                        {msg.audioUrl && (
                          <audio controls src={msg.audioUrl} className="h-8 max-w-[200px] mt-1" />
                        )}
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

                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 ml-3">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <div
                          key={emoji}
                          className="flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full px-1.5 py-0.5 text-[10px] shadow-sm animate-in zoom-in duration-200"
                        >
                          <span>{emoji}</span>
                          <span className="font-bold text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Formatting Toolbar */}
            <div className="h-10 flex items-center px-2 gap-2 select-none shrink-0 rounded-md relative" style={{ backgroundColor: 'rgba(244, 242, 232, 0.3)' }}>
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
            <div className="flex flex-col shrink-0">
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#F0F7FF] border-x-2 border-t-2 border-[#ACA899] rounded-t-md p-2 flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-bold text-[#3169C6]">Replying to {replyingTo.sender === 'me' ? 'yourself' : 'Poops'}:</span>
                      <span className="text-[11px] text-gray-600 truncate italic">
                        {replyingTo.text || (replyingTo.type === 'image' ? 'Photo' : replyingTo.type === 'voice' ? 'Voice Clip' : 'Gift')}
                      </span>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="p-1 hover:bg-white/50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={`h-28 flex gap-3 ${replyingTo ? 'border-t-0 rounded-t-none' : ''}`}>
                <textarea
                  className={`flex-1 bg-white border-2 border-[#ACA899] p-3 focus:outline-none focus:border-[#0055E5] focus:ring-2 focus:ring-[#0055E5]/10 resize-none shadow-inner transition-all text-black ${replyingTo ? 'rounded-b-md border-t-0' : 'rounded-md'}`}
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
                    onClick={() => setShowStickerDialog(true)}
                    className="h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-[12px] font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all flex items-center justify-center gap-2"
                  >
                    <Smile size={14} /> Stickers
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Avatars & News) */}
          <div className="w-48 xl:w-72 flex flex-col gap-4 shrink-0 overflow-hidden">
            {/* Breaking News Section */}
            <div className="flex-1 flex flex-col bg-white border-2 border-[#ACA899] rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-b from-[#FF6600] to-[#CC5200] px-2 py-1 flex items-center gap-2 border-b border-[#ACA899]">
                <Newspaper size={12} className="text-white" />
                <span className="text-[10px] xl:text-[14px] font-bold text-white uppercase tracking-wider">Breaking News</span>
              </div>
              <div className="flex-1 p-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin bg-[#FFFBF0]">
                {[
                  {
                    title: "MSN hits 100M users!",
                    icon: <TrendingUp size={10} />,
                    content: "MSN Messenger has officially surpassed 100 million active users worldwide! The service continues to grow as the premier destination for instant messaging and digital connection."
                  },
                  {
                    title: "New 3D Emoticons!",
                    icon: <Smile size={10} />,
                    content: "Express yourself like never before with our brand new pack of 3D animated emoticons. From dancing robots to spinning hearts, your conversations just got a lot more lively!"
                  },
                  {
                    title: "Vista Beta 2 out now",
                    icon: <Globe size={10} />,
                    content: "Microsoft has released Windows Vista Beta 2 to the public. Experience the new Aero interface and enhanced security features of the next generation of Windows."
                  },
                  {
                    title: "Top 10 Pop Hits",
                    icon: <ExternalLink size={10} />,
                    content: "Check out this week's top 10 pop hits on MSN Music. From the latest chart-toppers to rising stars, we've got the soundtrack for your summer."
                  },
                  {
                    title: "Nudge etiquette 101",
                    icon: <Info size={10} />,
                    content: "Are you nudging too much? Learn the do's and don'ts of the Nudge feature in our latest guide. Remember: one nudge is a greeting, ten nudges is a problem!"
                  }
                ].map((news, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedNews(news);
                      setShowNewsDialog(true);
                    }}
                    className="flex flex-col gap-1 group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[#3169C6] group-hover:underline">
                      <span className="shrink-0">{news.icon}</span>
                      <span className="text-[10px] xl:text-[12px] font-bold leading-tight">{news.title}</span>
                    </div>
                    <div className="h-[1px] bg-gray-200 w-full"></div>
                  </div>
                ))}
                <div className="mt-auto pt-2 text-center">
                  <span className="text-[9px] text-[#FF6600] font-bold hover:underline cursor-pointer italic">More on MSN.com →</span>
                </div>
              </div>
            </div>

            {/* Bottom Display Picture (My Profile) */}
            <div className="relative group mt-auto xl:w-[200px] mx-auto shrink-0">
              <div className="w-full aspect-square bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="w-full h-full bg-[#F0F0F0] rounded-lg flex items-center justify-center overflow-hidden border border-black/5">
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Me" />
                </div>
              </div>
              <div
                onClick={() => setShowProfileDialog(true)}
                className="absolute -right-0 top-1/2 -translate-y-1/2 w-4 h-10 xl:w-6 xl:h-12 bg-[#D6D3C4] border border-[#ACA899] rounded-l-md flex items-center justify-center cursor-pointer hover:bg-[#ECE9D8] transition-colors shadow-sm"
              >
                <div className="w-1.5 h-5 xl:w-2 border-l border-r border-[#ACA899]"></div>
                {/* <div className="absolute right-0 bottom-0 w-3 h-3 border-l border-t border-[#ACA899] flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-gray-600"></div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        {/*<div className="h-8 border-t border-[#ACA899] px-4 flex items-center justify-between text-[11px] select-none shrink-0" style={{ backgroundColor: theme.bgColor }}>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#0055E5] cursor-pointer hover:underline transition-all">Click for new Emoticons and Theme Packs from Blue Mountain</span>
          </div>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="italic font-medium opacity-60"
            >
              Poops is typing...
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#0055E5] rounded-sm shadow-sm"></div>
            <div className="w-4 h-4 bg-[#ACA899] rounded-sm shadow-sm"></div>
          </div>
        </div> */}
      </motion.div>
    </div>
  );
};

function PendingPhotoDialog({ imageUrl, onClose, onSend }: { imageUrl: string, onClose: () => void, onSend: (url: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[400px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="h-8 bg-gradient-to-b from-[#0058E6] via-[#3C96FF] to-[#0058E6] flex items-center justify-between px-2">
          <span className="text-white font-bold text-xs">Preview Photo before Sending</span>
          <button onClick={onClose} className="text-white hover:bg-red-500 p-1 rounded transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-4 flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            className="max-w-full max-h-[300px] object-contain rounded-md border border-gray-200 shadow-sm"
            alt="Pending Photo"
          />
          <div className="text-sm text-gray-700 font-bold mb-2">Send this photo to Poops?</div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => onSend(imageUrl)}
              className="flex-1 h-10 bg-gradient-to-b from-[#316AC5] to-[#2B5CAE] text-white rounded-lg text-sm font-bold shadow-sm hover:brightness-110 active:shadow-inner transition-all border border-[#1A3D7A]"
            >
              Send
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

function PhotoPreviewDialog({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
  const [scale, setScale] = useState(1);

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 right-0 flex items-center gap-2 z-10">
          <button
            onClick={zoomOut}
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/80 rounded-full"
            title="Zoom Out"
          >
            <MinusIcon size={20} />
          </button>
          <span className="text-white text-sm font-bold bg-black/50 px-2 rounded-full hidden sm:block">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/80 rounded-full"
            title="Zoom In"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/80 rounded-full ml-4"
            title="Close Preview"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto max-h-[90vh] max-w-[90vw] rounded-lg custom-scrollbar">
          <img
            src={imageUrl}
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl border border-white/20 transition-transform duration-200"
            alt="Preview"
          />
        </div>
      </motion.div>
    </div>
  );
}

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

function NewsDialog({ news, onClose }: { news: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[120] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[400px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <TitleBar title="MSN Today - News Detail" />
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#FF6600]">
            <Newspaper size={24} />
            <h2 className="text-xl font-bold">{news.title}</h2>
          </div>

          <div className="bg-[#FFFBF0] border border-[#FF6600]/20 rounded-lg p-4 shadow-inner">
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {news.content}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2">
            <Clock size={12} />
            <span>Published: {new Date().toLocaleDateString()}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all mt-2"
          >
            Back to MSN Today
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StickerDialog({ onSelect, onClose }: { onSelect: (url: string, type: 'sticker' | 'gif') => void, onClose: () => void }) {
  const [tab, setTab] = useState<'stickers' | 'gifs'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = (tab === 'stickers' ? STICKERS : GIFS).filter(url => {
    // Since we don't have tags, we search within the URL string
    // This is a basic search based on the URL filename/path
    return url.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[130] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[450px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <TitleBar title="Select Sticker or GIF" />
        <div className="p-4 flex flex-col gap-4">
          <div className="flex border-b border-[#ACA899]">
            <button
              onClick={() => setTab('stickers')}
              className={`px-4 py-2 text-sm font-bold transition-all ${tab === 'stickers' ? 'text-[#3169C6] border-b-2 border-[#3169C6] bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Stickers
            </button>
            <button
              onClick={() => setTab('gifs')}
              className={`px-4 py-2 text-sm font-bold transition-all ${tab === 'gifs' ? 'text-[#3169C6] border-b-2 border-[#3169C6] bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              GIFs
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] focus:ring-1 focus:ring-[#3169C6]/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="h-[300px] overflow-y-auto p-2 grid grid-cols-2 gap-3 bg-gray-50 rounded border border-[#ACA899]/30">
            {filteredItems.length > 0 ? (
              filteredItems.map((url, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(url, tab === 'stickers' ? 'sticker' : 'gif')}
                  className="bg-white border border-[#ACA899]/20 rounded p-2 cursor-pointer hover:border-[#3169C6] hover:shadow-md transition-all flex items-center justify-center group"
                >
                  <img src={url} className="max-w-full max-h-full group-hover:scale-110 transition-transform" alt="Sticker/GIF" />
                </div>
              ))
            ) : (
              <div className="col-span-2 h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <Search size={32} className="opacity-20" />
                <span className="text-sm font-medium">No results found for "{searchQuery}"</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
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

function UserProfileDialog({ user, lastMessageObj, onClose }: { user: any, lastMessageObj: Message | undefined, onClose: () => void }) {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year} ${month} ${day} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[450px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <TitleBar title={`User Profile - ${user.name}`} />
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-md shrink-0">
              <img src={user.avatar} className="w-full h-full object-cover rounded-lg" alt={user.name} />
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h2 className="text-2xl font-bold text-[#3169C6] truncate">{user.name}</h2>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${user.status === 'Online' ? 'bg-green-500' :
                  user.status === 'Busy' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                <span className="text-sm font-medium text-gray-600">{user.status}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                <Mail size={12} />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#F8F8F8] border border-[#ACA899]/30 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={16} className="text-[#3169C6]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Account Created</span>
                  <span className="text-sm font-medium">{user.creationDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Globe size={16} className="text-[#3169C6]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-gray-400">IP Address</span>
                  <span className="text-sm font-medium font-mono">{user.ipAddress}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-[#ACA899]/20">
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageSquare size={16} className="text-[#3169C6]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Last Message Sent</span>
                    <span className="text-sm font-medium italic">
                      "{lastMessageObj?.text || 'No messages yet'}"
                    </span>
                  </div>
                </div>
                {lastMessageObj && (
                  <div className="flex items-center gap-3 text-gray-700 ml-7">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-[11px] text-gray-500">
                      {formatDate(lastMessageObj.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ThemeDialog({ currentTheme, onClose, onSave }: { currentTheme: any, onClose: () => void, onSave: (theme: any) => void }) {
  const [theme, setTheme] = useState(currentTheme);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[400px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <TitleBar title="Customize Theme" />
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Background Color</label>
              <input
                type="color"
                className="w-full h-10 border border-[#ACA899] rounded-md cursor-pointer"
                value={theme.bgColor}
                onChange={(e) => setTheme({ ...theme, bgColor: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600">Text Color</label>
              <input
                type="color"
                className="w-full h-10 border border-[#ACA899] rounded-md cursor-pointer"
                value={theme.textColor}
                onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Font Family</label>
            <select
              className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399] text-black"
              value={theme.fontFamily}
              onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">App Font Size ({theme.appFontSize}px)</label>
            <input
              type="range"
              min="10"
              max="24"
              step="1"
              className="w-full h-10"
              value={theme.appFontSize}
              onChange={(e) => setTheme({ ...theme, appFontSize: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-3">
              <button
                onClick={() => onSave(theme)}
                className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all"
              >
                Apply Theme
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 transition-all"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={() => setTheme(DEFAULT_THEME)}
              className="w-full h-10 bg-gradient-to-b from-[#F8F8F8] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-[#3169C6] shadow-sm hover:brightness-105 transition-all"
            >
              Reset to Default
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
