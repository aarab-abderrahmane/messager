import React, { useState, useRef, useEffect } from 'react';
import {
  User, Paperclip, Video, Mic,
  Gamepad2, Puzzle, Type, Smile,
  Gift, ImageIcon, Search, MoreHorizontal,
  Plus, Minus as MinusIcon, X, Reply,
  Calendar, Info, Globe, MessageSquare, Mail, Clock,
  Newspaper, ExternalLink, TrendingUp, Eye, EyeOff, FileText, Download
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Message, UserData, NewsItem } from '../../types';
import { MSN_LOGO_URL, ALL_EMOJIS, AVATARS, STICKERS, GIFS } from '../../constants';
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

export const ChatPage: React.FC<ChatPageProps> = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [offlineUsers, setOfflineUsers] = useState([])

  const [personalMessage, setPersonalMessage] = useState('Listening to: Linkin Park - In The End');
  const [status, setStatus] = useState<'Online' | 'Busy' | 'Away' | 'Offline'>('Online');
  const [messages, setMessages] = useState<Message[]>([
    { id: '2', sender: 'them', username: "data.username", text: "data.message", type: 'text', timestamp: new Date() }

  ]);


  console.log(messages)

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
  const [showAddNewsDialog, setShowAddNewsDialog] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      id: '1',
      type: 'breaking',
      headline: "MSN hits 100M users!",
      text: "MSN Messenger has officially surpassed 100 million active users worldwide! The service continues to grow as the premier destination for instant messaging and digital connection.",
      publicationTime: new Date('2026-02-25T10:00:00'),
      expirationDate: new Date('2026-03-10T10:00:00'),
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      attachments: [{ name: "Read Moore at MSN.com", url: "https://msn.com" }]
    },
    {
      id: '2',
      type: 'breaking',
      headline: "New 3D Emoticons!",
      text: "Express yourself like never before with our brand new pack of 3D animated emoticons. From dancing robots to spinning hearts, your conversations just got a lot more lively!",
      publicationTime: new Date('2026-02-28T14:30:00'),
      expirationDate: new Date('2026-03-05T14:30:00'),
    },
    {
      id: '3',
      type: 'regular',
      headline: "Vista Beta 2 out now",
      text: "Microsoft has released Windows Vista Beta 2 to the public. Experience the new Aero interface and enhanced security features of the next generation of Windows.",
      publicationTime: new Date('2026-03-01T08:00:00'),
      expirationDate: new Date('2026-03-15T08:00:00'),
      attachments: [{ name: "Download Beta", url: "#" }]
    },
    {
      id: '4',
      type: 'regular',
      headline: "Top 10 Pop Hits",
      text: "Check out this week's top 10 pop hits on MSN Music. From the latest chart-toppers to rising stars, we've got the soundtrack for your summer.",
      publicationTime: new Date('2026-02-27T12:00:00'),
      expirationDate: new Date('2026-03-06T12:00:00'),
    }
  ]);
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
  const pdfInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {


    if (!currentUser?.token) return


    const socket = new WebSocket("ws://localhost:5000");
    ws.current = socket;


    ws.current.onopen = () => {
      console.log("Connected to server");
      ws.current?.send(JSON.stringify({
        type: "AUTH",
        token: currentUser.token
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "USER_STATUS_UPDATE") {

        console.log(data)
        setOnlineUsers(data.online);
        setOfflineUsers(data.offline);
      }

      if (data.type === "HISTORY") {
        setMessages(data.messages);
        return;
      }

      if (data.type === "AUTH_ERROR") {
        alert("Authentication failed");
        onLogout();
        return;
      }



      if (data.type === "text") {
        setMessages((prev) => [...prev,
          {...data , sender: data.email === currentUser.email ? "me" : 'them'}
        ]);
      }

      if (data.type === "image") {
        setMessages((prev) => [...prev,
        { sender: 'them', username: data.username, imageUrl: data.imageUrl, type: 'image', timestamp: new Date() }
        ]);
      }
    };

    ws.current.onclose = (event) => {
      console.log("Disconnected", event.reason);
      if (ws.current === socket) {
        ws.current = null;
      }
    };


    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };

  }, [currentUser?.token]);



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

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message: WebSocket is not connected.");
      // Optional: Trigger a toast or reconnection logic here
      return;
    }

    const token = localStorage.getItem("chat_token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const msgData: Partial<Message> = { text: inputText, type: 'text', username: currentUser.username , email  : currentUser.email  };
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
      reader.onload = () => {
        const base64 = reader.result;

        setPendingPhotoUrl(base64 as string);
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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMessage({ text: `File: ${file.name}`, pdfUrl: url, fileName: file.name, type: 'pdf' });
    }
    if (e.target) e.target.value = '';
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
            lastMessageObj={messages.filter(m => m.email === selectedUser.email).slice(-1)[0]}
            onClose={() => setShowUserProfileDialog(false)}
          />
        )}
        {showNewsDialog && selectedNews && (
          <NewsDialog
            news={selectedNews}
            onClose={() => setShowNewsDialog(false)}
          />
        )}
        {showAddNewsDialog && (
          <AddNewsDialog
            onClose={() => setShowAddNewsDialog(false)}
            onAdd={(newNews) => {
              setNewsList(prev => [newNews, ...prev]);
              setShowAddNewsDialog(false);
            }}
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
              ws.current.send(JSON.stringify({
                type: "image",
                username: currentUser.email,
                imageUrl: url,
                timestamp: Date.now()
              }));
              setPendingPhotoUrl(null);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={windowControls}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TitleBar title={`Conversation - (${currentUser.username})`} />

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
          <div className="w-48 xl:w-72 flex flex-col gap-4 shrink-0 overflow-hidden">
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
                {onlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).map((onlineUser) => (
                
                <div
                    key={onlineUser.username}
                    onClick={() => {
                    if (onlineUser.email === currentUser.email) return; 

                    setSelectedUser(onlineUser);
                    setShowUserProfileDialog(true);
                  }}

                    className="flex items-center gap-2 p-1 hover:bg-[#316AC5]/10 rounded cursor-pointer group transition-colors"
                  >
                    <div className="relative">
                      <img src={onlineUser.avatar} className="w-8 h-8 xl:w-12 xl:h-12 rounded border border-[#ACA899]" alt={onlineUser.username} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full border border-white shadow-sm bg-green-500 `}></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] xl:text-[13px] font-bold truncate group-hover:text-[#3169C6]">{onlineUser.username}</span>
                      <span className="text-[9px] xl:text-[11px] opacity-60 leading-none">online</span>
                    </div>
                  </div>
                ))}

                {offlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).map((onlineUser) => (
                  <div
                    key={onlineUser.username}
                    onClick={() => {
                      setSelectedUser(onlineUser);
                      setShowUserProfileDialog(true);
                    }}
                    className="flex items-center gap-2 p-1 hover:bg-[#316AC5]/10 rounded cursor-pointer group transition-colors"
                  >
                    <div className="relative">
                      <img src={onlineUser.avatar} className="w-8 h-8 xl:w-12 xl:h-12 rounded border border-[#ACA899]" alt={onlineUser.username} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full border border-white shadow-sm bg-red-500
                        `}></div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] xl:text-[13px] font-bold truncate group-hover:text-[#3169C6]">{onlineUser.username}</span>
                      <span className="text-[9px] xl:text-[11px] opacity-60 leading-none">offline</span>
                    </div>
                  </div>
                ))}

                {onlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).length === 0 && (
                  <div className="text-[10px] text-gray-400 italic text-center py-4">No results found</div>
                )}
              </div>
            </div>
          </div>

          {/* Center Column (Chat Area) */}
          <div className="flex-1 flex flex-col gap-4 ">
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
            <div className="h-10 flex items-center px-2 gap-2 select-none shrink-0 rounded-md relative" style={{ backgroundColor: 'rgba(244, 242, 232, 0.4)' }}>
              <div className="relative">
                <FormatButton
                  icon={<Type size={18} />}
                  label='text'
                  onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')}
                />
                <AnimatePresence>
                  {activeDropdown === 'font' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full mb-2 left-0 bg-white border border-[#ACA899] rounded-md shadow-xl p-1 flex flex-col gap-1 z-30 w-32"
                    >
                      <button
                        onClick={() => { setFontSize(prev => Math.min(prev + 2, 24)); setActiveDropdown(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316AC5] hover:text-white text-[11px] font-bold transition-colors rounded-sm"
                      >
                        <Plus size={12} /> Enlarge Text
                      </button>
                      <button
                        onClick={() => { setFontSize(prev => Math.max(prev - 2, 10)); setActiveDropdown(null); }}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#316AC5] hover:text-white text-[11px] font-bold transition-colors rounded-sm"
                      >
                        <MinusIcon size={12} /> Reduce Text
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <FormatButton
                  icon={<Smile size={18} />}
                  label='emoji'
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
              <FormatButton icon={<Mic size={18} />} label="Voice Clip" onClick={() => voiceInputRef.current?.click()} />
              <FormatButton icon={<FileText size={18} />} label="PDF" onClick={() => pdfInputRef.current?.click()} />
              <FormatButton icon={<ImageIcon size={18} />} onClick={() => fileInputRef.current?.click()} />
              <FormatButton icon={<Gift size={18} />} onClick={() => setShowGiftDialog(true)} />
            </div>

            {/* Input Section */}

            <div className={`h-28 flex gap-3 ${replyingTo ? 'border-t-0 rounded-t-none' : ''}`}>
              <div className="flex flex-1 flex-col shrink-0 "  >

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



              </div>

              <div className="w-28 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  className="flex-1 bg-gradient-to-b flex justify-center items-center  from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-[16px] font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
                >
                  <span className="flex items-center gap-1 ">
                    Send
                    <img src="/assets/icons/up.png" className="w-6 h-6"></img>
                  </span>

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

          {/* Right Column (Avatars & News) */}
          <div className="w-48 xl:w-72 flex flex-col gap-4 shrink-0 overflow-hidden">
            {/* Breaking News Section */}
            <div className="flex-1 flex flex-col  bg-white/20 backdrop-blur-md border  border-[#ACA899] rounded-xl  overflow-hidden relative group/sidebar">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/5 pointer-events-none" />

              <div  style={{ background: 'linear-gradient(to bottom, #ffdd00, transparent)' }} className=" px-3 py-2 flex items-center gap-2  relative z-10">
                <Newspaper size={14} className="text-white drop-shadow-sm" />
                <span className="text-[11px] xl:text-[14px] font-bold text-gray-700 uppercase tracking-wider drop-shadow-sm">Breaking News</span>
              </div>

              <div className="flex-1 p-3 flex flex-col gap-4 overflow-y-auto scrollbar-thin bg-white/10 relative z-10">
          
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddNewsDialog(true)}
                  className="h-10 py-2 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-[12px] font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Add New News
                  <Plus size={14}  />
                </motion.button>

                {newsList
                  .filter(news => new Date(news.expirationDate) > new Date())
                  .map((news) => (
                    <motion.div
                      key={news.id}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedNews(news);
                        setShowNewsDialog(true);
                      }}
                      className="flex  gap-1 cursor-pointer group/item py-1 px-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                     
                        <span className={`text-[12px] xl:text-[13px] font-bold transition-all truncate hover:underline
                          ${news.type === 'breaking' ? 'text-[#8a8b26]' : 'text-[#3169C6]'}`}>
                          {news.headline}
                        </span>


                        {news.type === 'breaking' && (
                          <div className="w-2 h-2 rounded-full bg-[#b3a700] border border-white shadow-sm shrink-0 animate-pulse" />
                        )}

                        <ExternalLink size={10} className="shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2 ml-4 opacity-40">
                        <Clock size={8} />
                        <span className="text-[9px] font-bold uppercase">
                          {new Date(news.publicationTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                <div className="mt-auto pt-4 text-center border-t border-white/10">
                  <span className="text-[10px] text-[#FF6600] font-bold hover:underline cursor-pointer italic drop-shadow-sm">View all news on Dot.com</span>
                </div>
              </div>
            </div>

            {/* Bottom Display Picture (My Profile) */}
            <div className="relative group mt-auto xl:w-[200px] mx-auto shrink-0">
              <div className="w-full aspect-square bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-lg overflow-hidden transition-transform ">
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
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfUpload}
        accept=".pdf"
        className="hidden"
      />
    </div>
  );
};

function PendingPhotoDialog({ imageUrl, onClose, onSend }: { imageUrl: string, onClose: () => void, onSend: (url: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-[450px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
      >
        <TitleBar title="Preview Photo - Windows Photo Viewer" variant="live" icon="/assets/icons/user.png" />
        <div className="p-6 flex flex-col items-center gap-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <div className="relative group w-full flex justify-center">
            <div className="absolute -inset-1 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={imageUrl}
              className="max-w-full max-h-[350px] object-contain rounded-md border border-white/50 shadow-lg relative z-10"
              alt="Pending Photo"
            />
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="text-[15px] text-gray-800 font-semibold drop-shadow-sm">Send this photo to Dot Messenger?</div>
            <div className="text-[12px] text-gray-500 font-medium italic">Image will be sent as a high-quality attachment</div>
          </div>

          <div className="flex gap-4 w-full z-10">
            <button
              onClick={() => onSend(imageUrl)}
              className="flex-1 h-11 bg-gradient-to-b from-[#4BA1E8] via-[#3B8ED4] to-[#2B7BC0] text-white rounded-md text-sm font-bold shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:brightness-95 active:shadow-inner transition-all border border-[#1A5485] flex items-center justify-center gap-2"
            >
              <span>Send Photo</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-11 bg-gradient-to-b from-[#F2F2F2] via-[#E6E6E6] to-[#D9D9D9] border border-[#A6A6A6] rounded-md text-sm font-bold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:from-white hover:to-[#F0F0F0] active:brightness-95 transition-all"
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
  const [scale, setScale] = useState(0.9);

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-[200] p-4 " onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-[800px] max-h-[600px] h-[85vh] flex flex-col  bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg  shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <TitleBar title="Windows Photo Viewer" variant="live" icon="/assets/icons/image.png" onClose={onClose} />

        <div className="relative flex-1 flex items-center justify-center  overflow-hidden p-8 min-h-[400px] min-w-[500px]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className=" max-h-[75vh]  max-w-full rounded-lg  relative z-10 flex items-center justify-center">
            <motion.img
              src={imageUrl}
              animate={{ scale }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ transformOrigin: 'center' }}
              className="max-w-full max-h-full object-contain shadow-2xl border border-white/20"
              alt="Preview"
            />
          </div>
        </div>

        <div className="h-20  bg-gradient-to-b from-[#e6e4e4] to-[#c5c3ba]  border-t  border-gray-400 flex items-center justify-center gap-6 relative px-8">
          <div className="absolute inset-0   pointer-events-none" />

          <div className="flex items-center gap-4 p-2 rounded-full border border-gray-400">
            <button
              onClick={zoomOut}
              className="w-10 h-10 flex items-center justify-center  bg-gradient-to-b from-[#e84b4b] via-[#d43b3b] to-[#c02b2b] text-white hover:bg-white/20 transition-all rounded-full group cursor-pointer"
              title="Zoom Out"
            >
              <MinusIcon size={20} className="group-active:scale-90 transition-transform" />
            </button>
            <div className="w-16 text-center">
              <span className="text-black text-sm font-bold tabular-nums">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <button
              onClick={zoomIn}
              className="w-10 h-10 flex items-center  bg-gradient-to-b from-[#4BA1E8] via-[#3B8ED4] to-[#2B7BC0] justify-center text-white hover:bg-white/20 transition-all rounded-full group"
              title="Zoom In"
            >
              <Plus size={20} className="group-active:scale-110 transition-transform" />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-400 " />


          <a
            href={imageUrl}
            download="shared-photo.png" // This forces the download
            className="px-6 h-13  bg-gradient-to-b from-[#58e84b] via-[#4dd43b] to-[#4ec02b] hover:bg-red-500/80  text-white border border-white/20 rounded-full font-bold text-sm transition-all flex items-center gap-2 group cursor-pointer"
          >
               <span>Download Photo</span>
               <Download size={16} />
          </a>

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

function NewsDialog({ news, onClose }: { news: NewsItem, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[150] p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="w-[650px] max-h-[90vh] bg-white border border-[#A0A0A0] rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        

         <TitleBar title="Dot Messenger News Reader" variant="live" icon="/assets/icons/image.png" />

        <div className="flex-1 overflow-y-auto custom-scrollbar-modern bg-[#F8F9FA]">
          {news.coverImage ? (
            <div className="w-full h-64 relative overflow-hidden group">
              <img src={news.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] text-white uppercase border shadow-sm
                    ${news.type === 'breaking' ? 'bg-[#FF6600] border-[#FF6600]' : 'bg-[#3169C6] border-[#3169C6]'}`}>
                    {news.type}
                  </span>
                  <span className="text-[11px] font-bold text-white/80 drop-shadow-sm">
                    {new Date(news.publicationTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white leading-tight drop-shadow-xl tracking-tight">
                  {news.headline}
                </h2>
              </div>
            </div>
          ) : (
            <div className="p-10 pb-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-[0.2em] text-white uppercase border shadow-sm
                    ${news.type === 'breaking' ? 'bg-[#FF6600] border-[#FF6600]' : 'bg-[#3169C6] border-[#3169C6]'}`}>
                  {news.type}
                </span>
                <span className="text-[11px] font-bold text-gray-400">
                  {new Date(news.publicationTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                {news.headline}
              </h2>
            </div>
          )}

          <div className="p-10 pt-8 flex flex-col gap-8 bg-white/50 backdrop-blur-sm">
            <div className="text-lg text-gray-700 leading-relaxed font-serif space-y-6">
              {news.text.split('\n').map((para, i) => (
                <p key={i} className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[#3169C6] first-letter:mt-1">{para}</p>
              ))}
            </div>

            {news.attachments && news.attachments.length > 0 && (
              <div className="mt-4 p-8 bg-gradient-to-br from-[#F0F7FF] to-white border-2 border-[#3169C6]/10 rounded-2xl flex flex-col gap-4 shadow-inner">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#3169C6]" />
                  <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Discover More Content</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {news.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-3.5 bg-white hover:bg-[#3169C6] border border-gray-200 hover:border-[#3169C6] rounded-xl group transition-all hover:shadow-[0_10px_20px_rgba(49,105,198,0.15)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 group-hover:bg-white/20 rounded-lg transition-colors">
                          <ExternalLink size={16} className="text-[#3169C6] group-hover:text-white" />
                        </div>
                        <span className="text-[14px] font-bold text-gray-800 group-hover:text-white">{att.name}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-gray-100 group-hover:border-white/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                        <Plus size={12} className="text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <Clock size={14} className="text-[#3169C6]" />
            <span>Published on {new Date(news.publicationTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button
            onClick={onClose}
            className="px-10 h-11 bg-gradient-to-b from-[#3169C6] to-[#0055E5] border border-[#003399] rounded-xl text-sm font-black text-white shadow-[0_4px_12px_rgba(49,105,198,0.3)] hover:brightness-110 active:brightness-95 active:shadow-inner transition-all flex items-center gap-2"
          >
            <span>Close Article</span>
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

          <div className="h-[300px] overflow-y-auto p-2 grid grid-cols-3 gap-3 bg-gray-50 rounded border border-[#ACA899]/30">
            {filteredItems.length > 0 ? (
              filteredItems.map((url, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(url, tab === 'stickers' ? 'sticker' : 'gif')}
                  className="bg-white border border-[#ACA899]/70 rounded p-2 cursor-pointer hover:border-[#3169C6] hover:shadow-md transition-all flex items-center justify-center group"
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
  const formatDate = (timestamp: number) => {
  // Create the Date object here!
    const date = new Date(timestamp); 

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
        <TitleBar title={`User Profile - ${user.username}`} />
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white border-2 border-[#ACA899] rounded-xl p-1.5 shadow-md shrink-0">
              <img src={user.avatar} className="w-full h-full object-cover rounded-lg" alt={user.username} />
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <h2 className="text-2xl font-bold text-[#3169C6] truncate">{user.username}</h2>
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
                  <span className="text-sm font-medium">{formatDate(user.creationDate)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Globe size={16} className="text-[#3169C6]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-gray-400">IP Address</span>
                  <span className="text-sm font-medium font-mono">{user.ip}</span>
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
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [confirmPassword, setConfirmPassword] = useState(user.password || '');
  const [newPassword, setNewPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[450px] bg-white border border-[#ACA899] rounded-lg shadow-2xl  flex flex-col"
      >
        <TitleBar title="Edit Profile" icon="/assets/icons/user.png" />
        <div className="p-8 flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-3 relative">
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
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute top-[90px] mt-4 -left-36 bg-white border border-[#A0A0A0] rounded-xl shadow-2xl z-[110] w-96 overflow-hidden flex flex-col"
                  >
                    <div className="bg-[#F3F3F3] border-b border-[#E0E0E0] p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">Choose your dynamic picture</span>
                      <button onClick={() => setShowAvatars(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
                      <div className="grid grid-cols-5 gap-3">
                        {AVATARS.map((url, idx) => (
                          <motion.img
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            src={url}
                            className={`w-14 h-14 rounded-lg cursor-pointer border-2 transition-all object-cover ${avatar === url ? 'border-[#88C057] shadow-md' : 'border-transparent hover:border-gray-300'
                              }`}
                            onClick={() => {
                              setAvatar(url); // Fixed name
                              setShowAvatars(false); // Fixed name
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
            <div className="flex-1 flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Email</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
                  value={user.email}
                  // onChange={(e) => setEmail(e.target.value)}
                  disabled
                />

              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Display Name </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="w-full h-10 px-3 pr-10 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="None set"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full h-10 px-3 pr-10 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic">This is how you appear to your contacts.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onSave({ email: user.email, username, avatar, password: newPassword || confirmPassword, token: user.token })}
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
      className={`h-8 px-2 flex items-center gap-2 border border-transparent hover:border-[#ACA899] hover:bg-white/60 rounded-md cursor-pointer transition-all ${label ? 'pr-3' : ''}`}
    >
      <div className="text-[#3169C6] drop-shadow-sm ">{icon}</div>
      {(label === "Voice Clip" || label === "PDF") && <span className="text-[12px] font-medium text-gray-700">{label}</span>}
      {
        (label === "text" || label === "emoji") && (

          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500 ml-1"></div>

        )
      }
    </div>
  );
}

function AddNewsDialog({ onClose, onAdd }: { onClose: () => void, onAdd: (news: NewsItem) => void }) {
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState<'breaking' | 'regular'>('regular');
  const [expirationDate, setExpirationDate] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [attachments, setAttachments] = useState<{ name: string, url: string }[]>([]);

  const handleAddAttachment = () => {
    if (attachments.length < 2) {
      setAttachments([...attachments, { name: '', url: '' }]);
    }
  };

  const handleAttachmentChange = (index: number, field: 'name' | 'url', value: string) => {
    const newAttachments = [...attachments];
    newAttachments[index][field] = value;
    setAttachments(newAttachments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !text || !expirationDate) return;

    const newNews: NewsItem = {
      id: Date.now().toString(),
      type,
      headline,
      text,
      publicationTime: new Date(),
      expirationDate: new Date(expirationDate),
      coverImage: coverImage || undefined,
      attachments: attachments.filter(a => a.name && a.url).length > 0 ? attachments.filter(a => a.name && a.url) : undefined
    };

    onAdd(newNews);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-[500px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl shadow-[0_32px_64px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none" />
        <TitleBar title="Create News Item - MSN Today" variant="live" icon="/assets/icons/globe.png" />

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 relative z-10 overflow-y-auto custom-scrollbar max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Headline *</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 bg-white/50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] focus:ring-1 focus:ring-[#3169C6]/20 transition-all text-black"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Enter headline..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">News Type *</label>
              <select
                className="w-full h-10 px-3 bg-white/50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] text-black"
                value={type}
                onChange={(e) => setType(e.target.value as 'breaking' | 'regular')}
              >
                <option value="regular">Regular News</option>
                <option value="breaking">Breaking News</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Description *</label>
            <textarea
              required
              className="w-full h-24 p-3 bg-white/50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] focus:ring-1 focus:ring-[#3169C6]/20 transition-all resize-none text-black"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter news description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Expiration Date *</label>
              <input
                type="date"
                required
                className="w-full h-10 px-3 bg-white/50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] text-black"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Cover Image URL (Optional)</label>
              <input
                type="text"
                className="w-full h-10 px-3 bg-white/50 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#3169C6] text-black"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Attachments (Max 2)</label>
              <button
                type="button"
                onClick={handleAddAttachment}
                disabled={attachments.length >= 2}
                className="text-[10px] font-bold text-[#3169C6] hover:underline disabled:opacity-50"
              >
                + Add Attachment
              </button>
            </div>
            {attachments.map((att, i) => (
              <div key={i} className="flex gap-2 p-3 bg-black/5 rounded-lg border border-black/5">
                <input
                  type="text"
                  placeholder="Name (e.g. Read more)"
                  className="flex-1 h-8 px-2 bg-white/80 border border-[#ACA899] rounded text-[11px] focus:outline-none focus:border-[#3169C6] text-black"
                  value={att.name}
                  onChange={(e) => handleAttachmentChange(i, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="URL (https://...)"
                  className="flex-1 h-8 px-2 bg-white/80 border border-[#ACA899] rounded text-[11px] focus:outline-none focus:border-[#3169C6] text-black"
                  value={att.url}
                  onChange={(e) => handleAttachmentChange(i, 'url', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 h-11 bg-gradient-to-b from-[#4BA1E8] via-[#3B8ED4] to-[#2B7BC0] text-white rounded-lg text-sm font-bold shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:brightness-95 transition-all border border-[#1A5485]"
            >
              Post News
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-gradient-to-b from-white via-[#F0F0F0] to-[#E0E0E0] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:brightness-105 active:shadow-inner transition-all flex items-center justify-center gap-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
