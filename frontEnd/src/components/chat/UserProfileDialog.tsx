import React from 'react';
import { motion } from 'motion/react';
import { TitleBar } from '../common/TitleBar';
import {
  Calendar,  Globe, MessageSquare, Mail, Clock,X
 
} from 'lucide-react';
import { Message } from '../../types';




function UserProfileDialog({ user, IP, lastMessageObj, onClose }: { user: any, IP: string, lastMessageObj: Message | undefined, onClose: () => void }) {
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
    <div
  className="fixed inset-0 flex items-center justify-center z-[110] p-4"
  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    style={{
      width: 440,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      border: '1px solid #b0b0b0',
      borderRadius: 8,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(0,0,0,0.35)',
      overflow: 'hidden',
    }}
  >
    <TitleBar title={`User Profile — ${user.username}`} />

    {/* Profile header banner */}
    <div style={{
      background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
      borderBottom: '1px solid #1e4fa0',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Gloss sweep */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Avatar */}
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
        border: '2px solid rgba(255,255,255,0.6)',
        borderRadius: 10,
        padding: 3,
        boxShadow: '0 3px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9)',
        position: 'relative',
      }}>
        <img
          src={user.avatar}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7, display: 'block' }}
          alt={user.username}
        />
        {/* Status dot */}
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 14, height: 14, borderRadius: '50%',
          background: user.status === 'online'
            ? 'linear-gradient(180deg, #6dd84a 0%, #3aaa18 100%)'
            : 'linear-gradient(180deg, #cccccc 0%, #999999 100%)',
          border: '2px solid white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </div>

      {/* Name + status + email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden', flex: 1 }}>
        <span style={{
          fontSize: 18, fontWeight: 900,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#ffffff',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user.username}
        </span>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: user.status === 'online'
            ? 'linear-gradient(180deg, #5ab840 0%, #3a9020 100%)'
            : 'linear-gradient(180deg, #aaa 0%, #888 100%)',
          border: `1px solid ${user.status === 'online' ? '#2a7010' : '#666'}`,
          borderRadius: 10,
          padding: '1px 8px',
          width: 'fit-content',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: '#fff',
            animation: user.status === 'online' ? 'pulse 1.5s infinite' : 'none',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 800, color: '#fff',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textTransform: 'capitalize',
          }}>
            {user.status}
          </span>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Mail size={11} color="rgba(255,255,255,0.7)" />
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,0.8)',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user.email}
          </span>
        </div>
      </div>
    </div>

    {/* Info rows */}
    <div style={{
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: 'linear-gradient(180deg, #f8f8f8 0%, #f4f4f4 100%)',
      flex: 1,
    }}>
      {/* Info card */}
      <div style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
        border: '1px solid #b0c8e8',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
      }}>

        {/* Row — Account Created */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px',
          borderBottom: '1px solid #ddeeff',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            <Calendar size={13} color="#2a5fb5" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, color: '#7aaee0',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>Account Created</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: '#333',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
            }}>
              {formatDate(user.creationDate)}
            </span>
          </div>
        </div>

        {/* Row — IP Address */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px',
          borderBottom: '1px solid #ddeeff',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            <Globe size={13} color="#2a5fb5" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, color: '#7aaee0',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>IP Address</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: '#333',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {IP}
            </span>
          </div>
        </div>

        {/* Row — Last Message */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '9px 12px',
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0,
            background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            <MessageSquare size={13} color="#2a5fb5" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'hidden' }}>
            <span style={{
              fontSize: 9, fontWeight: 800, color: '#7aaee0',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>Last Message Sent</span>
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#444',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {!lastMessageObj ? 'No messages yet' : lastMessageObj.type === 'text' ? lastMessageObj.content : lastMessageObj.text}
            </span>
            {lastMessageObj && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={9} color="#b0b0b0" />
                <span style={{
                  fontSize: 10, color: '#aaa',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                }}>
                  {formatDate(new Date(lastMessageObj.timestamp).getTime())}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      padding: '10px 14px',
      background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
      borderTop: '1px solid #c0c0c0',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        style={{
          width: '100%', height: 32,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          border: '1px solid #c0c0c0',
          borderRadius: 5,
          fontSize: 12, fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#444',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
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
        <X size={12} /> Close Profile
      </motion.button>
    </div>
  </motion.div>
</div>
  );
}

export default UserProfileDialog