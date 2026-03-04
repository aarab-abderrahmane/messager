import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  User, Mic, Type, Smile,
  Gift, ImageIcon,
  Plus, Minus as MinusIcon, X, Reply,
  Newspaper, Eye, FileText, Download,
  Search, ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Message, UserData, NewsItem } from '../../types';
import { ALL_EMOJIS } from '../../constants';


import { TitleBar } from '../common/TitleBar';


import PeopleOnlineContent from "./peopleOnlineContent"
import PendingPhotoDialog from "./PendingPhotoDialog"
import NewsContent from "./NewsContent"
import PhotoPreviewDialog from "./PhotoPreviewDialog"
import NewsDialog from "./NewsDialog"
import StickerDialog from "./StickerDialog"
import UserProfileDialog from "./UserProfileDialog"
import ThemeDialog from "./ThemeDialog"
import ProfileDialog from "./ProfileDialog"
import PdfPreviewDialog from "./PdfPreviewDialog"
import FormatButton from "./FormatButton"
import AddNewsDialog from "./AddNewsDialog"
import PendingPdfDialog from "./PendingPdfDialog"
import GiftDialog from "./GiftDialog"

const DEFAULT_THEME = {
  bgColor: '#ECE9D8',
  textColor: '#000000',
  appFontSize: 14,
  fontFamily: 'sans-serif'
};


interface ChatPageProps {
  user: UserData;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<UserData>(user);
  const [onlineUsers, setOnlineUsers] = useState([])
  const [offlineUsers, setOfflineUsers] = useState([])

  const [personalMessage, setPersonalMessage] = useState('Listening to: Linkin Park - In The End');
  const [status, setStatus] = useState<'Online' | 'Busy' | 'Away' | 'Offline'>('Online');
  const [messages, setMessages] = useState<Message[]>([
    { id: '2', sender: 'them', username: "data.username", text: "data.message", type: 'text', timestamp: new Date() }

  ]);

  const ws = useRef(null);

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
  const [newsList, setNewsList] = useState<NewsItem[]>(
    [
      {
        "id": "1",
        "type": "breaking",
        "headline": "Dot hits 100M users!",
        "text": "Dot Messenger now has 100 million users! More and more people are using Dot to talk to friends every day.",
        "publicationTime": "2026-02-25T10:00:00",
        "expirationDate": "2026-03-10T10:00:00",
        "coverImage": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        "attachments": [{ "name": "Read more at Dot.com", "url": "https://Dot.com" }]
      },
      {
        "id": "2",
        "type": "breaking",
        "headline": "New 3D Faces!",
        "text": "Show how you feel with our new 3D moving faces. We have dancing robots and spinning hearts to make your chats fun!",
        "publicationTime": "2026-02-28T14:30:00",
        "expirationDate": "2026-03-05T14:30:00"
      },
      {
        "id": "3",
        "type": "regular",
        "headline": "Dot Desktop Beta is out",
        "text": "The new version of Dot for your computer is ready. Try the new beautiful look and better safety features today.",
        "publicationTime": "2026-03-01T08:00:00",
        "expirationDate": "2026-03-15T08:00:00",
        "attachments": [{ "name": "Download now", "url": "#" }]
      },
      {
        "id": "4",
        "type": "regular",
        "headline": "Top 10 Music Hits",
        "text": "Listen to the best 10 songs this week on Dot Music. We have all the popular songs and new singers for you.",
        "publicationTime": "2026-02-27T12:00:00",
        "expirationDate": "2026-03-06T12:00:00"
      }
    ]

  );
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);
  const [pendingPdfs, setPendingPdfs] = useState<File[]>([]);
  const [showPendingPdfDialog, setShowPendingPdfDialog] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<{ name: string, content: string } | null>(null);
  const [showPdfPreviewDialog, setShowPdfPreviewDialog] = useState(false);

  const [theme, setTheme] = useState(DEFAULT_THEME);

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // ── Chat Search ──────────────────────────────────────────────────────────
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatSearchIndex, setChatSearchIndex] = useState(0);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /** IDs of text messages that contain the search query */
  const searchMatches = useMemo(() => {
    if (!chatSearchQuery.trim()) return [];
    const q = chatSearchQuery.toLowerCase();
    return messages
      .filter(m => m.type === 'text' && m.content?.toLowerCase().includes(q))
      .map(m => m.id);
  }, [chatSearchQuery, messages]);

  /** Scroll to the currently focused match whenever the index / matches change */
  useEffect(() => {
    if (searchMatches.length === 0) return;
    const safeIdx = ((chatSearchIndex % searchMatches.length) + searchMatches.length) % searchMatches.length;
    const el = messageRefs.current[searchMatches[safeIdx]];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [chatSearchIndex, searchMatches]);

  const handleSearchNext = () => setChatSearchIndex(i => (i + 1) % Math.max(searchMatches.length, 1));
  const handleSearchPrev = () => setChatSearchIndex(i => (i - 1 + Math.max(searchMatches.length, 1)) % Math.max(searchMatches.length, 1));
  const safeSearchIndex = searchMatches.length > 0 ? ((chatSearchIndex % searchMatches.length) + searchMatches.length) % searchMatches.length : 0;
  // ─────────────────────────────────────────────────────────────────────────

  const chatEndRef = useRef<HTMLDivElement>(null);
  const windowControls = useAnimation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  console.log(replyingTo)

  useEffect(() => {


    if (!currentUser?.token) return


    const storedLink = localStorage.getItem('server_link') || 'http://localhost';
    const storedPort = localStorage.getItem('server_port') || '5000';
    // Convert http/https to ws/wss and use the host:port
    const wsProtocol = storedLink.startsWith('https') ? 'wss' : 'ws';
    const host = storedLink.replace(/^https?:\/\//, '');
    const socket = new WebSocket(`${wsProtocol}://${host}:${storedPort}`);
    ws.current = socket;


    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: "AUTH",
        token: currentUser.token
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "USER_STATUS_UPDATE") {

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

      if (data.type === "error") {
        alert(data.message);

      }



      if (["text", "image", "voice", "pdf", "sticker", "gif"].includes(data.type)) {
        setMessages(prev => [
          ...prev, data
        ])
      }


      if (data.type === "update_message") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, reactions: data.reactions }
              : msg
          )
        );
      }

    };

    ws.current.onclose = (event) => {
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


  function cleanIP(ip) {
    if (ip.includes('::ffff:')) {
      return ip.split('::ffff:')[1];

    }



    return ip;
  }

  console.log(messages)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (msg: Partial<Message>) => {
    const newMessage: Message = {
      ...msg,
      username: currentUser.username,
      email: currentUser.email,
      replyTo: replyingTo ? replyingTo : null
    } as Message;


    ws.current.send(JSON.stringify(newMessage));
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



    addMessage({ type: "text", content: inputText })

    setInputText('');
    setReplyingTo(null);
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
      reader.onload = () => {
        const base64 = reader.result;

        setPendingPhotoUrl({ url: base64, text: "pdf name" });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Voice = reader.result as string;
        addMessage({ text: `Voice Clip: ${file.name}`, content: base64Voice, type: 'voice' });

      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to max 3 files as requested
      const selectedFiles = files.slice(0, 3);
      setPendingPdfs(selectedFiles);
      setShowPendingPdfDialog(true);
    }
    if (e.target) e.target.value = '';
  };


  const handleOpenGift = (id: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isOpened: true } : msg
    ));
  };

  const handleSendSticker = (url: string, type: 'sticker' | 'gif') => {
    addMessage({ content: url, type: type });
    setShowStickerDialog(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    const reactionData = {
      type: "reaction",
      messageId: messageId,
      emoji: emoji,
      token: currentUser.token // Always send the token for safety!
    };

    ws.current.send(JSON.stringify(reactionData));
    setReactionMenuId(null); // Close the menu
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fetchRandomGif = async (query) => {
    try {
      // Call your own server
      const response = await fetch(`http://localhost:5000/get-gif?q=${query}&limit=10`);
      const data = await response.json();

      console.log("Here is your GIF:", data);

      return data
    } catch (error) {
      console.error("Error fetching GIF:", error);
      return []
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
            IP={cleanIP(selectedUser.ip)}
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
            fetchRandomGif={fetchRandomGif}
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
            imageData={pendingPhotoUrl}
            onClose={() => setPendingPhotoUrl(null)}
            onSend={(url, text) => {
              addMessage({ type: "image", content: url, text: text })
              setPendingPhotoUrl(null);
            }}
          />
        )}
        {showPendingPdfDialog && (
          <PendingPdfDialog
            files={pendingPdfs}
            onClose={() => setShowPendingPdfDialog(false)}
            onSend={(filesToSend) => {
              const attachments: { name: string; content: string }[] = [];
              let processedCount = 0;

              filesToSend.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  attachments.push({
                    name: file.name,
                    content: reader.result as string
                  });
                  processedCount++;

                  if (processedCount === filesToSend.length) {
                    addMessage({
                      text: filesToSend.length > 1
                        ? `${filesToSend.length} PDF Files: ${filesToSend.map(f => f.name).join(', ')}`
                        : filesToSend[0].name,
                      attachments,
                      type: 'pdf'
                    });
                    setShowPendingPdfDialog(false);
                    setPendingPdfs([]);
                  }
                };
                reader.readAsDataURL(file);
              });
            }}
          />
        )}
        {showPdfPreviewDialog && previewPdf && (
          <PdfPreviewDialog
            pdf={previewPdf}
            onClose={() => {
              setShowPdfPreviewDialog(false);
              setPreviewPdf(null);
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
        <div
          style={{
            height: 26,
            background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
            borderBottom: '1px solid #c0c0c0',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 6,
            paddingRight: 6,
            gap: 1,
            flexShrink: 0,
            userSelect: 'none',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          {/* Menu items */}
          {[
            { label: 'File' },
            { label: 'Edit', action: () => setShowThemeDialog(true) },
            { label: 'Actions' },
            { label: 'Tools' },
            { label: 'Help' },
          ].map(item => (
            <div
              key={item.label}
              onClick={item.action}
              style={{
                height: 20,
                paddingLeft: 8,
                paddingRight: 8,
                display: 'flex',
                alignItems: 'center',
                fontSize: 11,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                fontWeight: 600,
                color: '#222',
                borderRadius: 3,
                cursor: 'default',
                border: '1px solid transparent',
                transition: 'all 0.1s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                e.currentTarget.style.borderColor = '#7aaee0';
                e.currentTarget.style.color = '#1a3e7a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#222';
              }}
              onMouseDown={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #c2d8f5 0%, #a8c8f0 100%)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';
              }}
              onMouseUp={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Underline first letter — WLM keyboard shortcut style */}
              <span>
                <span style={{ textDecoration: 'underline' }}>{item.label[0]}</span>
                {item.label.slice(1)}
              </span>
            </div>
          ))}

          {/* Separator */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 4,
          }}>
            {/* Mobile toggle buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsLeftSidebarOpen(true)}
                style={{
                  height: 20,
                  paddingLeft: 8, paddingRight: 8,
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                  border: '1px solid #c0c0c0',
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  color: '#444',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                  e.currentTarget.style.borderColor = '#7aaee0';
                  e.currentTarget.style.color = '#1a3e7a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                  e.currentTarget.style.borderColor = '#c0c0c0';
                  e.currentTarget.style.color = '#444';
                }}
                onMouseDown={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.12)'; }}
                onMouseUp={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9)'; }}
              >
                <User size={10} /> Contacts
              </button>

              <button
                onClick={() => setIsRightSidebarOpen(true)}
                style={{
                  height: 20,
                  paddingLeft: 8, paddingRight: 8,
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                  border: '1px solid #c0c0c0',
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  color: '#444',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                  e.currentTarget.style.borderColor = '#7aaee0';
                  e.currentTarget.style.color = '#1a3e7a';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                  e.currentTarget.style.borderColor = '#c0c0c0';
                  e.currentTarget.style.color = '#444';
                }}
                onMouseDown={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.12)'; }}
                onMouseUp={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9)'; }}
              >
                <Newspaper size={10} /> News
              </button>
            </div>
          </div>
        </div>


        {/* Main Content Area */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden relative">

          {/* Left Column (Online Users) - Mobile Overlay */}
          <AnimatePresence>
            {isLeftSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsLeftSidebarOpen(false)}
                  className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[2px]"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-[280px] z-50 md:hidden flex flex-col p-4"
                  style={{ backgroundColor: theme.bgColor }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold">Contacts</span>
                    <button onClick={() => setIsLeftSidebarOpen(false)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <PeopleOnlineContent
                      onlineUsers={onlineUsers}
                      offlineUsers={offlineUsers}
                      userSearchQuery={userSearchQuery}
                      setUserSearchQuery={setUserSearchQuery}
                      onUserClick={(user) => {
                        setSelectedUser(user);
                        setShowUserProfileDialog(true);
                        setIsLeftSidebarOpen(false);
                      }}
                      currentUser={currentUser}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Right Column (Profile & News) - Mobile Overlay */}
          <AnimatePresence>
            {isRightSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[2px]"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-[280px] z-50 md:hidden flex flex-col p-4"
                  style={{ backgroundColor: theme.bgColor }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setIsRightSidebarOpen(false)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                    <span className="text-sm font-bold text-right">Profile & News</span>
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Simplified Profile Section for Mobile Menu */}
                    <div className="mb-4 flex flex-col items-center gap-2 p-3 border border-[#ACA899] rounded-md bg-white/50">
                      <img src={currentUser.avatar} className="w-16 h-16 rounded-md border-2 border-white shadow-md" alt="Me" />
                      <div className="text-center">
                        <div className="font-bold text-sm tracking-tight">{currentUser.username}</div>
                        <div className="text-[11px] text-[#666]">{status}</div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                      <NewsContent
                        newsList={newsList}
                        onAddClick={() => {
                          setShowAddNewsDialog(true);
                          setIsRightSidebarOpen(false);
                        }}
                        onNewsClick={(news) => {
                          setSelectedNews(news);
                          setShowNewsDialog(true);
                          setIsRightSidebarOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Left Column (Online Users) - Desktop */}
          <div className="hidden md:flex w-48 xl:w-72 flex-col gap-4 shrink-0 overflow-hidden">
            <PeopleOnlineContent
              onlineUsers={onlineUsers}
              offlineUsers={offlineUsers}
              userSearchQuery={userSearchQuery}
              setUserSearchQuery={setUserSearchQuery}
              onUserClick={(user) => {
                setSelectedUser(user);
                setShowUserProfileDialog(true);
              }}
              currentUser={currentUser}
            />
          </div>

          {/* Center Column (Chat Area) */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Conversation Panel */}
            <div
              className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#c0c0c0] scrollbar-track-[#f0f0f0]"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8f8ff 100%)',
                border: '1px solid #b0c8e8',
                borderRadius: 6,
                boxShadow: 'inset 0 2px 6px rgba(49,105,198,0.06)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* "To:" header bar */}
              <div
                style={{
                  flexShrink: 0,
                  background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
                  borderBottom: '1px solid #b0c8e8',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 5,
                }}
              >
                {/* "To:" label badge */}
                <div style={{
                  background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                  border: '1px solid #1e4fa0',
                  borderRadius: 3,
                  padding: '1px 7px',
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  color: '#fff',
                  letterSpacing: '0.04em',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
                  flexShrink: 0,
                }}>
                  To:
                </div>


                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  color: '#1a3e7a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  all contacts
                </span>
              </div>

              {/* Messages area */}
              <div
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  overflowY: 'auto',
                }}
              >
                {/* Date separator — shown once per day */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: '4px 0',
                }}>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #c8d8ee)' }} />
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: '#7aaee0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '1px 8px',
                    background: 'linear-gradient(180deg, #f0f6ff 0%, #e4eeff 100%)',
                    border: '1px solid #b0c8e8',
                    borderRadius: 10,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}>
                    Today
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #c8d8ee, transparent)' }} />
                </div>

                {
                  messages.map((msg) => {
                    const isMe = msg.email === currentUser.email;

                    return (
                      <div
                        key={msg.id}
                        ref={el => { messageRefs.current[msg.id] = el; }}
                        className={`text-sm group relative my-1 ${msg.type === 'nudge' ? 'text-center my-3' : ''}`}
                      >

                        {msg.type !== 'nudge' && (
                          <div
                            className="absolute -right-2 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            {/* Toolbar pill */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                                border: '1px solid #c0c0c0',
                                borderRadius: 20,
                                padding: '2px 5px',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 5px rgba(0,0,0,0.12)',
                              }}
                            >
                              {/* Reaction button */}
                              <div className="relative">
                                <button
                                  onClick={() => setReactionMenuId(reactionMenuId === msg.id ? null : msg.id)}
                                  title="React"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: reactionMenuId === msg.id
                                      ? 'linear-gradient(180deg, #888 0%, #666 100%)'
                                      : 'transparent',
                                    color: reactionMenuId === msg.id ? '#fff' : '#999',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                  }}
                                  onMouseEnter={e => {
                                    if (reactionMenuId !== msg.id) {
                                      e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                                      e.currentTarget.style.color = '#555';
                                    }
                                  }}
                                  onMouseLeave={e => {
                                    if (reactionMenuId !== msg.id) {
                                      e.currentTarget.style.background = 'transparent';
                                      e.currentTarget.style.color = '#999';
                                    }
                                  }}
                                >
                                  <Smile size={14} />
                                </button>

                                {/* Reaction picker */}
                                <AnimatePresence>
                                  {reactionMenuId === msg.id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.8, y: 6 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.8, y: 6 }}
                                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                      style={{
                                        position: 'absolute',
                                        bottom: '110%',
                                        right: 0,
                                        background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                                        border: '1px solid #c0c0c0',
                                        borderRadius: 20,
                                        padding: '4px 6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.15)',
                                        whiteSpace: 'nowrap',
                                        zIndex: 20,
                                      }}
                                    >
                                      {/* Pointer arrow */}
                                      <div style={{
                                        position: 'absolute',
                                        bottom: -5,
                                        right: 10,
                                        width: 0, height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid #c0c0c0',
                                      }} />
                                      <div style={{
                                        position: 'absolute',
                                        bottom: -4,
                                        right: 10,
                                        width: 0, height: 0,
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid #ececec',
                                      }} />

                                      {[
                                        { emoji: '❤️', type: 'love', label: 'Love' },
                                        { emoji: '👍', type: 'like', label: 'Like' },
                                        { emoji: '👎', type: 'dislike', label: 'Dislike' },
                                        { emoji: '😂', type: 'fun', label: 'Funny' },
                                      ].map(r => (
                                        <button
                                          key={r.type}
                                          onClick={() => handleReaction(msg.id, r.emoji)}
                                          title={r.label}
                                          style={{
                                            fontSize: 18,
                                            width: 32,
                                            height: 32,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            border: '1px solid transparent',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.12s',
                                            lineHeight: 1,
                                          }}
                                          onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.35)';
                                            e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                                            e.currentTarget.style.borderColor = '#b0b0b0';
                                          }}
                                          onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.borderColor = 'transparent';
                                          }}
                                        >
                                          {r.emoji}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Divider */}
                              <div style={{
                                width: 1, height: 14,
                                background: 'linear-gradient(180deg, transparent, #b0b0b0, transparent)',
                                margin: '0 2px',
                              }} />

                              {/* Reply button */}
                              <button
                                onClick={() => setReplyingTo(msg)}
                                title="Reply"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#999',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                                  e.currentTarget.style.color = '#555';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#999';
                                }}
                              >
                                <Reply size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          {/* Avatar */}
                          <img
                            src={isMe ? currentUser.avatar : msg.avatar}
                            alt={isMe ? 'You' : msg.username}
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 3,
                              border: `1px solid ${isMe ? '#7aaee0' : '#c0c0c0'}`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                              flexShrink: 0,
                            }}
                          />

                          {/* Name */}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              fontFamily: 'Segoe UI, Tahoma, sans-serif',
                              color: isMe ? '#2a5fb5' : '#222',
                              letterSpacing: '0.01em',
                              textShadow: isMe ? '0 1px 0 rgba(255,255,255,0.6)' : 'none',
                            }}
                          >
                            {isMe ? 'You' : msg.username}
                          </span>

                          {/* Em dash */}
                          <span style={{
                            fontSize: 11,
                            color: '#b0b0b0',
                            fontFamily: 'Segoe UI, Tahoma, sans-serif',
                            fontWeight: 600,
                            marginLeft: -3,
                          }}>
                            —
                          </span>

                          {/* Timestamp — right after the dash */}
                          <span style={{
                            fontSize: 10,
                            color: '#aaa',
                            fontFamily: 'Segoe UI, Tahoma, sans-serif',
                            fontWeight: 600,
                            marginLeft: -2,
                          }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {msg.replyTo && (
                          <div className="ml-3 mb-2" style={{ maxWidth: '80%' }}>
                            <div
                              style={{
                                background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                                border: '1px solid #c8c8c8',
                                borderLeft: '3px solid #888888',
                                borderRadius: '0 5px 5px 0',
                                padding: '5px 10px',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.10)',
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                            >
                              {/* Subtle left watermark stripe */}
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 0, left: 0, bottom: 0,
                                  width: 28,
                                  background: 'linear-gradient(90deg, rgba(0,0,0,0.04), transparent)',
                                  pointerEvents: 'none',
                                }}
                              />

                              {/* Reply-to label */}
                              <div className="flex items-center gap-1 mb-0.5">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M4 2L1 5L4 8M1 5h6a2 2 0 0 1 2 2v1" stroke="#666666" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#444444',
                                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                    letterSpacing: '0.01em',
                                  }}
                                >
                                  {msg.replyTo.email === currentUser.email ? 'You' : msg.replyTo.username}
                                </span>
                              </div>

                              {/* Reply content */}
                              <div
                                style={{
                                  fontSize: 11,
                                  color: '#777777',
                                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                  fontStyle: 'italic',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  paddingLeft: 14,
                                }}
                              >
                                {msg.replyTo.type === "text" ? msg.replyTo.content : ["image", "pdf", "voice"].includes(msg.replyTo.type) ? msg.replyTo.text : msg.replyTo.type}
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.type === 'text' && (() => {
                          const content = msg.content ?? '';
                          const isMatchedMsg = searchMatches.includes(msg.id);
                          const isFocused = isMatchedMsg && searchMatches[safeSearchIndex] === msg.id;

                          if (!isMatchedMsg || !chatSearchQuery.trim()) {
                            return (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[14px] ml-3 leading-relaxed">{content}</span>
                              </div>
                            );
                          }

                          // Render with highlighted matches
                          const q = chatSearchQuery.toLowerCase();
                          const parts: React.ReactNode[] = [];
                          let cursor = 0;
                          let lower = content.toLowerCase();
                          let matchCount = 0;
                          while (cursor < content.length) {
                            const idx = lower.indexOf(q, cursor);
                            if (idx === -1) {
                              parts.push(content.slice(cursor));
                              break;
                            }
                            if (idx > cursor) parts.push(content.slice(cursor, idx));
                            const isCurrentFocus = isFocused && matchCount === 0; // highlight first occurrence in focused msg more strongly
                            parts.push(
                              <mark
                                key={idx}
                                style={{
                                  backgroundColor: isCurrentFocus ? '#FF9800' : '#FFE082',
                                  color: isCurrentFocus ? '#fff' : '#333',
                                  borderRadius: 2,
                                  padding: '0 1px',
                                  fontWeight: 700,
                                  boxShadow: isCurrentFocus ? '0 0 0 2px rgba(255,152,0,0.5)' : 'none',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {content.slice(idx, idx + q.length)}
                              </mark>
                            );
                            matchCount++;
                            cursor = idx + q.length;
                          }

                          return (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[14px] ml-3 leading-relaxed">{parts}</span>
                            </div>
                          );
                        })()}
                        {msg.type === 'image' && (
                          <div className="flex flex-col gap-1">
                            {/* <span className={`font-bold text-[13px] ${isMe ? 'text-[#3169C6]' : 'text-black'}`}>
                                      {isMe ? 'You sent a photo:' : 'Poops sent a photo:'}
                                    </span> */}
                            <img
                              src={msg.content}
                              className="max-w-[200px] rounded-md border border-gray-200 shadow-sm ml-3 cursor-pointer hover:opacity-90 transition-opacity"
                              alt="Sent photo"
                              onClick={() => setPreviewImageUrl(msg.content || null)}
                            />
                          </div>
                        )}

                        {(msg.type === 'sticker' || msg.type === 'gif') && (
                          <div className="flex flex-col gap-1 w-fit">
                            <div
                              style={{
                                marginLeft: 12,
                                display: 'inline-flex',
                                flexDirection: 'column',
                                gap: 4,
                              }}
                            >
                              {/* Sticker frame */}
                              <div
                                style={{
                                  position: 'relative',
                                  display: 'inline-block',
                                  padding: 5,
                                  background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                                  border: '1px solid #c0c0c0',
                                  borderRadius: 8,
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.12)',
                                }}
                              >
                                {/* GIF badge — only for gif type */}
                                {msg.type === 'gif' && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: -7,
                                      right: -7,
                                      background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                                      border: '1px solid #1e4fa0',
                                      borderRadius: 4,
                                      padding: '1px 5px',
                                      fontSize: 9,
                                      fontWeight: 900,
                                      color: '#fff',
                                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                      letterSpacing: '0.05em',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                      zIndex: 1,
                                    }}
                                  >
                                    GIF
                                  </div>
                                )}

                                {/* Sticker badge — only for sticker type */}
                                {msg.type === 'sticker' && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: -7,
                                      right: -7,
                                      background: 'linear-gradient(180deg, #f0a020 0%, #c07010 100%)',
                                      border: '1px solid #a06000',
                                      borderRadius: 4,
                                      padding: '1px 5px',
                                      fontSize: 9,
                                      fontWeight: 900,
                                      color: '#fff',
                                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                      letterSpacing: '0.05em',
                                      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                                      zIndex: 1,
                                    }}
                                  >
                                    ✦ Sticker
                                  </div>
                                )}

                                {/* Image */}
                                <img
                                  src={msg.content}
                                  alt={msg.type}
                                  style={{
                                    maxWidth: 140,
                                    maxHeight: 140,
                                    borderRadius: 5,
                                    display: 'block',
                                    filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
                                  }}
                                />

                                {/* Bottom shine strip */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: 5,
                                    left: 5,
                                    right: 5,
                                    height: 10,
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.18) 100%)',
                                    borderRadius: '0 0 4px 4px',
                                    pointerEvents: 'none',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.type === 'voice' && (
                          <div className="flex flex-col gap-1">
                            {/* <span className={`font-bold text-[13px] ${isMe ? 'text-[#3169C6]' : 'text-black'}`}>
                                        {isMe ? 'You sent:' : msg.username}
                                      </span> */}

                            <div
                              className="ml-3 flex flex-col gap-2"
                              style={{
                                background: 'linear-gradient(180deg, #f5f9ff 0%, #ddeeff 100%)',
                                border: '1px solid #aac8e8',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                maxWidth: '260px',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.1)',
                              }}
                            >
                              {/* Header row */}
                              <div className="flex items-center gap-2">
                                {/* Animated mic icon bubble */}
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(180deg, #5b9bd5 0%, #2a6ab5 100%)',
                                    border: '1px solid #1a5aa5',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <Mic size={16} color="white" />
                                </div>

                                <div className="flex flex-col">
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a5aa5', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
                                    Voice Message
                                  </span>
                                  <span style={{ fontSize: 11, color: '#5a7fa8', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
                                    {msg.text}
                                  </span>
                                </div>
                              </div>

                              {/* Divider */}
                              <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #aac8e8, transparent)' }} />

                              {/* Audio player */}
                              {msg.content && (
                                <div className="flex flex-col gap-1">
                                  <audio
                                    controls
                                    src={msg.content}
                                    style={{
                                      width: '100%',
                                      height: 28,
                                      accentColor: '#3169C6',
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {msg.type === 'gift' && (
                          <div className="flex flex-col gap-1">
                            <span className={`font-bold text-[13px] ${isMe ? 'text-[#3169C6]' : 'text-black'}`}>
                              {isMe ? 'You sent a gift:' : 'Poops sent a gift:'}
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

                        {msg.type === 'pdf' && (
                          <div className="flex flex-col gap-2 ml-3" style={{ maxWidth: 300 }}>
                            {(msg.attachments && msg.attachments.length > 0
                              ? msg.attachments
                              : [{ name: msg.text, content: msg.content }]
                            ).map((att, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                                  border: '1px solid #c0c0c0',
                                  borderRadius: 6,
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 3px rgba(0,0,0,0.12)',
                                  overflow: 'hidden',
                                }}
                              >
                                {/* Top header bar - WLM style title bar */}
                                <div
                                  style={{
                                    background: 'linear-gradient(180deg, #dcdcdc 0%, #c8c8c8 100%)',
                                    borderBottom: '1px solid #b0b0b0',
                                    padding: '4px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                  }}
                                >
                                  {/* PDF icon badge */}
                                  <div
                                    style={{
                                      width: 28,
                                      height: 28,
                                      background: 'linear-gradient(180deg, #e84040 0%, #b82020 100%)',
                                      border: '1px solid #901010',
                                      borderRadius: 4,
                                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <span style={{ color: 'white', fontSize: 9, fontWeight: 900, fontFamily: 'Segoe UI, Tahoma, sans-serif', letterSpacing: '-0.5px' }}>PDF</span>
                                  </div>

                                  {/* Filename */}
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: '#333',
                                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1,
                                    }}
                                  >
                                    {att.name}
                                  </span>
                                </div>

                                {/* Body */}
                                <div
                                  style={{
                                    padding: '7px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                  }}
                                >
                                  <span style={{ fontSize: 11, color: '#888', fontFamily: 'Segoe UI, Tahoma, sans-serif', fontStyle: 'italic' }}>
                                    PDF Document
                                  </span>

                                  {/* Action buttons - WLM toolbar button style */}
                                  <div style={{ display: 'flex', gap: 5 }}>
                                    <button
                                      onClick={() => { setPreviewPdf(att); setShowPdfPreviewDialog(true); }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '3px 8px',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                        color: '#333',
                                        background: 'linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 100%)',
                                        border: '1px solid #aaa',
                                        borderRadius: 3,
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                                        cursor: 'pointer',
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg, #e8f0ff 0%, #ccd8f0 100%)'}
                                      onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 100%)'}
                                    >
                                      <Eye size={11} /> Preview
                                    </button>

                                    <a
                                      href={att.content}
                                      download={att.name}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '3px 8px',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                        color: '#333',
                                        background: 'linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 100%)',
                                        border: '1px solid #aaa',
                                        borderRadius: 3,
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                                        textDecoration: 'none',
                                      }}
                                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #e8f0ff 0%, #ccd8f0 100%)'}
                                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #f5f5f5 0%, #dcdcdc 100%)'}
                                    >
                                      <Download size={11} /> Save
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4, marginLeft: 12 }}>
                            {Object.entries(msg.reactions).map(([emoji, users]) => {
                              const count = (users as string[]).length;
                              if (count === 0) return null;

                              const iMReacted = (users as string[]).includes(currentUser.email);

                              return (
                                <div
                                  key={emoji}
                                  title={`${count} reaction${count > 1 ? 's' : ''}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '6px',
                                    background: iMReacted
                                      ? 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)'
                                      : 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                                    border: iMReacted ? '1px solid #7aaee0' : '1px solid #c0c0c0',
                                    borderRadius: 20,
                                    boxShadow: iMReacted
                                      ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(49,105,198,0.15)'
                                      : 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    transition: 'all 0.12s',
                                    animation: 'zoomIn 0.2s ease',
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.background = iMReacted
                                      ? 'linear-gradient(180deg, #c8e0ff 0%, #aacef5 100%)'
                                      : 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                                    e.currentTarget.style.transform = 'scale(1.08)';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.background = iMReacted
                                      ? 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)'
                                      : 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  {/* Emoji */}
                                  <span style={{ fontSize: 13, lineHeight: 1 }}>{emoji}</span>

                                  {/* Divider */}
                                  <div style={{
                                    width: 1,
                                    height: 10,
                                    background: iMReacted
                                      ? 'linear-gradient(180deg, transparent, #7aaee0, transparent)'
                                      : 'linear-gradient(180deg, transparent, #c0c0c0, transparent)',
                                  }} />

                                  {/* Count */}
                                  <span className="" style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                                    color: iMReacted ? '#1a4fa0' : '#666',
                                    lineHeight: 1,
                                    minWidth: 8,
                                    textAlign: 'center',
                                  }}>
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}


                      </div>
                    )
                  })
                }

                <div ref={chatEndRef} />
              </div>
            </div>


            {/* Formatting Toolbar */}
            <div
              style={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                gap: 3,
                flexShrink: 0,
                borderRadius: '6px 6px 0 0',
                background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
                borderBottom: '1px solid #b0b0b0',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                userSelect: 'none',
                position: 'relative',
              }}
            >
              {/* Font button */}
              <div className="relative">
                <FormatButton
                  icon={<Type size={17} />}
                  label="text"
                  active={activeDropdown === 'font'}
                  onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')}
                />
                <AnimatePresence>
                  {activeDropdown === 'font' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.12 }}
                      style={{
                        position: 'absolute',
                        bottom: '110%',
                        left: 0,
                        background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                        border: '1px solid #c0c0c0',
                        borderRadius: 4,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.15)',
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        zIndex: 30,
                        minWidth: 130,
                      }}
                    >
                      {[
                        { label: 'Enlarge Text', icon: <Plus size={11} />, action: () => { setFontSize(prev => Math.min(prev + 2, 24)); setActiveDropdown(null); } },
                        { label: 'Reduce Text', icon: <MinusIcon size={11} />, action: () => { setFontSize(prev => Math.max(prev - 2, 10)); setActiveDropdown(null); } },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            padding: '5px 10px',
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: 'Segoe UI, Tahoma, sans-serif',
                            color: '#333',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 3,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.1s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#333';
                          }}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Emoji button */}
              <div className="relative">
                <FormatButton
                  icon={<Smile size={17} />}
                  label="emoji"
                  active={activeDropdown === 'emoji'}
                  onClick={() => setActiveDropdown(activeDropdown === 'emoji' ? null : 'emoji')}
                />
                <AnimatePresence>
                  {activeDropdown === 'emoji' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.12 }}
                      style={{
                        position: 'absolute',
                        bottom: '110%',
                        left: 0,
                        background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
                        border: '1px solid #c0c0c0',
                        borderRadius: 4,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 12px rgba(0,0,0,0.15)',
                        padding: 6,
                        zIndex: 30,
                        width: 192,
                      }}
                    >
                      {/* Header */}
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: 'Segoe UI, Tahoma, sans-serif',
                        color: '#888',
                        marginBottom: 5,
                        paddingBottom: 4,
                        borderBottom: '1px solid #d0d0d0',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        Emoticons
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
                        {ALL_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleEmoji(emoji)}
                            style={{
                              fontSize: 18,
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 3,
                              border: '1px solid transparent',
                              background: 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.1s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                              e.currentTarget.style.borderColor = '#c0c0c0';
                              e.currentTarget.style.transform = 'scale(1.2)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div style={{
                width: 2, height: 20, margin: '0 3px',
                background: 'linear-gradient(180deg, transparent, #b0b0b0, transparent)',
              }} />

              {/* Action buttons */}
              <FormatButton icon={<Mic size={17} />} label="Voice Clip" onClick={() => voiceInputRef.current?.click()} />
              <FormatButton icon={<FileText size={17} />} label="PDF" onClick={() => pdfInputRef.current?.click()} />

              {/* Divider */}
              <div style={{
                width: 1, height: 20, margin: '0 3px',
                background: 'linear-gradient(180deg, transparent, #b0b0b0, transparent)',
              }} />

              <FormatButton icon={<ImageIcon size={17} />} onClick={() => fileInputRef.current?.click()} />
              <FormatButton icon={<Gift size={17} />} onClick={() => setShowGiftDialog(true)} />

              {/* ── Chat Search ─────────────────────────────────────────── */}
              {/* Spacer pushes search to the right */}
              <div style={{ flex: 1 }} />

              {/* Divider */}
              <div style={{
                width: 1, height: 20, margin: '0 3px',
                background: 'linear-gradient(180deg, transparent, #b0b0b0, transparent)',
              }} />

              {/* Search toggle button */}
              <FormatButton
                icon={<Search size={15} />}
                label="Search"
                active={chatSearchOpen}
                onClick={() => {
                  setChatSearchOpen(o => !o);
                  if (chatSearchOpen) {
                    setChatSearchQuery('');
                    setChatSearchIndex(0);
                  }
                }}
              />

              {/* Animated search bar */}
              <AnimatePresence>
                {chatSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    {/* Input */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'linear-gradient(180deg, #fff 0%, #f8f8f8 100%)',
                      border: '1px solid #a0b8d8',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(49,105,198,0.08)',
                    }}>
                      <input
                        autoFocus
                        value={chatSearchQuery}
                        onChange={e => { setChatSearchQuery(e.target.value); setChatSearchIndex(0); }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.shiftKey ? handleSearchPrev() : handleSearchNext(); }
                          if (e.key === 'Escape') { setChatSearchOpen(false); setChatSearchQuery(''); setChatSearchIndex(0); }
                        }}
                        placeholder="Search messages…"
                        style={{
                          width: 148,
                          padding: '3px 6px',
                          fontSize: 11,
                          fontFamily: 'Segoe UI, Tahoma, sans-serif',
                          fontWeight: 600,
                          color: '#222',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                        }}
                      />
                      {chatSearchQuery && (
                        <button
                          onClick={() => { setChatSearchQuery(''); setChatSearchIndex(0); }}
                          title="Clear"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 18, height: 18, marginRight: 2,
                            borderRadius: '50%', border: 'none',
                            background: 'transparent', color: '#aaa',
                            cursor: 'pointer', flexShrink: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; e.currentTarget.style.color = '#555'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    {/* Match counter */}
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: 'Segoe UI, Tahoma, sans-serif',
                      color: searchMatches.length > 0 ? '#2a5fb5' : '#aaa',
                      minWidth: 36,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                      {chatSearchQuery.trim()
                        ? searchMatches.length > 0
                          ? `${safeSearchIndex + 1} / ${searchMatches.length}`
                          : 'No match'
                        : ''}
                    </span>

                    {/* Prev / Next */}
                    {(['prev', 'next'] as const).map(dir => (
                      <button
                        key={dir}
                        onClick={dir === 'prev' ? handleSearchPrev : handleSearchNext}
                        title={dir === 'prev' ? 'Previous (Shift+Enter)' : 'Next (Enter)'}
                        disabled={searchMatches.length === 0}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 22, height: 22,
                          border: '1px solid #c0c0c0',
                          borderRadius: 3,
                          background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                          color: searchMatches.length === 0 ? '#ccc' : '#555',
                          cursor: searchMatches.length === 0 ? 'default' : 'pointer',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={e => {
                          if (searchMatches.length > 0) {
                            e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                            e.currentTarget.style.borderColor = '#7aaee0';
                            e.currentTarget.style.color = '#1a3e7a';
                          }
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                          e.currentTarget.style.borderColor = '#c0c0c0';
                          e.currentTarget.style.color = searchMatches.length === 0 ? '#ccc' : '#555';
                        }}
                      >
                        {dir === 'prev' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ──────────────────────────────────────────────────────────── */}
            </div>

            {/* Input Section */}

            <div className={`flex gap-3 ${replyingTo ? 'border-t-0 rounded-t-none' : ''}`} style={{ minHeight: 112 }}>
              <div className="flex flex-1 flex-col shrink-0">

                {/* Reply banner */}
                <AnimatePresence>
                  {replyingTo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{
                        background: 'linear-gradient(180deg, #e8f2ff 0%, #d8eaff 100%)',
                        border: '1px solid #7aaee0',
                        borderBottom: 'none',
                        borderRadius: '8px 8px 0 0',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, overflow: 'hidden', flex: 1 }}>
                        {/* Reply icon */}
                        <div style={{
                          width: 18, height: 18, flexShrink: 0,
                          background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                          border: '1px solid #1e4fa0',
                          borderRadius: 3,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M4 2L1 5L4 8M1 5h6a2 2 0 0 1 2 2v1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#2a5fb5',
                            fontFamily: 'Segoe UI, Tahoma, sans-serif',
                          }}>
                            Replying to {replyingTo.email === currentUser.email ? 'yourself' : replyingTo.username}
                          </span>
                          <span style={{
                            fontSize: 11, color: '#5a7fa8',
                            fontFamily: 'Segoe UI, Tahoma, sans-serif',
                            fontStyle: 'italic',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {replyingTo.type === "text" ? replyingTo.content : ["image", "pdf", "voice"].includes(replyingTo.type) ? replyingTo.text : replyingTo.type}

                          </span>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={() => setReplyingTo(null)}
                        style={{
                          width: 18, height: 18, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '50%',
                          border: '1px solid transparent',
                          background: 'transparent',
                          color: '#7aaee0',
                          cursor: 'pointer',
                          transition: 'all 0.1s',
                          marginLeft: 6,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'linear-gradient(180deg, #ffecec 0%, #ffd8d8 100%)';
                          e.currentTarget.style.borderColor = '#e08080';
                          e.currentTarget.style.color = '#cc3333';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.color = '#7aaee0';
                        }}
                      >
                        <X size={11} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Textarea */}
                <textarea
                  style={{
                    flex: 1,
                    background: 'linear-gradient(180deg, #ffffff 0%, #f8f8ff 100%)',
                    border: '1px solid #b0c8e8',
                    borderTop: replyingTo ? 'none' : '1px solid #b0c8e8',
                    borderRadius: replyingTo ? '0 0 8px 8px' : '8px',
                    padding: '10px 12px',
                    fontSize: `${fontSize}px`,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: '#222',
                    resize: 'none',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 4px rgba(49,105,198,0.06)',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 3000);
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#4a85d8';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(49,105,198,0.08), 0 0 0 2px rgba(74,133,216,0.12)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#b0c8e8';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(49,105,198,0.06)';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                />
              </div>

              {/* Right buttons */}
              <div style={{ width: 110, display: 'flex', flexDirection: 'column', gap: 6 }}>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSend}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                    border: '1px solid #1e4fa0',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(42,95,181,0.3)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)';
                  }}
                >
                  Send
                  <img src="/assets/icons/up.png" className="w-5 h-5" />
                </motion.button>

                {/* Stickers button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowStickerDialog(true)}
                  style={{
                    height: 46,
                    background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                    border: '1px solid #c0c0c0',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: '#444',
                    cursor: 'pointer',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.1)',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)';
                    e.currentTarget.style.borderColor = '#aaa';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)';
                    e.currentTarget.style.borderColor = '#c0c0c0';
                  }}
                >
                  <Smile size={13} /> Stickers
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column (Avatars & News) - Desktop */}
          <div className="hidden md:flex w-48 xl:w-72 flex-col gap-4 shrink-0 overflow-hidden">

            {/* Breaking News Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <NewsContent
                newsList={newsList}
                onAddClick={() => setShowAddNewsDialog(true)}
                onNewsClick={(news) => {
                  setSelectedNews(news);
                  setShowNewsDialog(true);
                }}
              />
            </div>


            {/* My Profile Section */}
            <div className="relative group xl:w-[200px] mx-auto shrink-0">
              {/* Avatar frame */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                  border: '1px solid #b0b0b0',
                  borderRadius: 12,
                  padding: 5,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 14px rgba(49,105,198,0.2)';
                  e.currentTarget.style.borderColor = '#7aaee0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = '#b0b0b0';
                }}
              >
                {/* Inner mat */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #d0d0d0',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
                    background: '#e8e8e8',
                    position: 'relative',
                  }}
                >
                  <img
                    src={currentUser.avatar}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    alt="Me"
                  />

                  {/* Bottom shine */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: '30%',
                    background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12))',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>

              {/* Side pull tab */}
              <div
                onClick={() => setShowProfileDialog(true)}
                style={{
                  position: 'absolute',
                  right: -1,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 16,
                  height: 44,
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #d8d8d8 100%)',
                  border: '1px solid #b0b0b0',
                  borderLeft: 'none',
                  borderRadius: '0 5px 5px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 1px 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                  e.currentTarget.style.borderColor = '#7aaee0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #d8d8d8 100%)';
                  e.currentTarget.style.borderColor = '#b0b0b0';
                }}
              >
                {/* Grip dots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 3, height: 3,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #aaa 0%, #888 100%)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.6)',
                    }} />
                  ))}
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Footer Bar */}
        <div
          className="shrink-0 select-none"
          style={{
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
            borderTop: '1px solid #b0b0b0',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >


          {/* Bottom strip — developer credit */}
          <div style={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 10,
            paddingRight: 10,
          }}>
            {/* Left — WLM branding dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                { color1: '#4a85d8', color2: '#2a5fb5', border: '#1e4fa0' },
                { color1: '#5ab840', color2: '#3a9020', border: '#2a7010' },
                { color1: '#ffe033', color2: '#d4a800', border: '#b8900a' },
                { color1: '#e84040', color2: '#c02020', border: '#a01010' },
              ].map((c, i) => (
                <div key={i} style={{
                  width: 12, height: 12,
                  background: `linear-gradient(180deg, ${c.color1} 0%, ${c.color2} 100%)`,
                  border: `1px solid ${c.border}`,
                  borderRadius: 2,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                }} />
              ))}
              <span style={{
                fontSize: 12, fontWeight: 700, color: '#888',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                marginLeft: 4, letterSpacing: '0.02em',
              }}>
                Dot Messenger
              </span>
            </div>

            {/* Center — developer name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 16, height: 16,
                background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                border: '1px solid #1e4fa0',
                borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                flexShrink: 0,
              }}>
                {/* code icon */}
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M2.5 2L1 4.5L2.5 7M6.5 2L8 4.5L6.5 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: '#555',
              }}>
                Built by
              </span>
              <span style={{
                fontSize: 11, fontWeight: 800,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: '#2a5fb5',
                letterSpacing: '0.01em',
              }}>
                Aarab Abderrahmane
              </span>
            </div>

            {/* Right — GitHub + LinkedIn icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* GitHub */}
              <a
                href="https://github.com/aarab-abderrahmane"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                  border: '1px solid #c0c0c0',
                  borderRadius: 3,
                  color: '#333',
                  textDecoration: 'none',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #333 0%, #111 100%)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#000';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c0c0c0';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#333';
                }}
              >
                {/* GitHub SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/aarab-abderrahmane-2b9509336"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                  border: '1px solid #c0c0c0',
                  borderRadius: 3,
                  color: '#0077b5',
                  textDecoration: 'none',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #0077b5 0%, #005a8e 100%)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#004a7c';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c0c0c0';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#0077b5';
                }}
              >
                {/* LinkedIn SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Version badge */}
              <div style={{
                height: 28,
                paddingLeft: 6, paddingRight: 6,
                display: 'flex', alignItems: 'center',
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                border: '1px solid #c0c0c0',
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 800,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: '#888',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                letterSpacing: '0.04em',
              }}>
                v1.0
              </div>
            </div>
          </div>
        </div>



      </motion.div >
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfUpload}
        accept=".pdf"
        multiple
        className="hidden"
      />
    </div >

  );
};



// function ToolbarButton({ icon, label }: { icon: React.ReactNode, label: string }) {
//   return (
//     <motion.div
//       whileHover={{ y: -2 }}
//       whileTap={{ y: 0 }}
//       className="flex flex-col items-center gap-1.5 cursor-pointer group"
//     >
//       <div className="w-12 h-12 bg-gradient-to-b from-white to-[#E8E8E8] border border-[#ACA899] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-active:shadow-inner transition-all overflow-hidden relative">
//         <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent h-1/2 rounded-t-xl"></div>
//         <div className="text-[#3169C6] z-10 drop-shadow-sm">{icon}</div>
//       </div>
//       <span className="text-[11px] font-bold text-gray-700 group-hover:text-[#0055E5] group-hover:underline transition-colors">{label}</span>
//     </motion.div>
//   );
// }