import {
  User, Search
} from 'lucide-react';

import React from 'react';
import {UserData } from '../../types';


const PeopleOnlineContent: React.FC<{
  onlineUsers: any[];
  offlineUsers: any[];
  userSearchQuery: string;
  setUserSearchQuery: (val: string) => void;
  onUserClick: (user: any) => void;
  currentUser: UserData;
}> = ({ onlineUsers, offlineUsers, userSearchQuery, setUserSearchQuery, onUserClick, currentUser }) => (
  <div className="flex-1 flex flex-col border border-[#b0aca0] rounded-md overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #f2f0ec 0%, #e8e5df 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.1)' }}>

    {/* Header */}
    <div
      style={{
        background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
        borderBottom: '1px solid #1e4fa0',
        padding: '10px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 20, height: 20,
        background: 'linear-gradient(180deg, #7bc8ff 0%, #3a9aee 100%)',
        border: '1px solid #1a7acc',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
        flexShrink: 0,
      }}>
        <User size={11} color="white" />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, color: '#fff',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        flex: 1,
      }}>
        People Online
      </span>
      {/* online count badge */}
      <div style={{
        background: 'linear-gradient(180deg, #5ab840 0%, #3a9020 100%)',
        border: '1px solid #2a7010',
        borderRadius: 10,
        padding: '1px 6px',
        fontSize: 10, fontWeight: 800, color: '#fff',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      }}>
        {onlineUsers.length}
      </div>
    </div>

    {/* Search */}
    <div className="px-2 py-2 border-b border-[#b0aca0]/50"
      style={{ background: 'linear-gradient(180deg, #eeebe5 0%, #e4e1db 100%)' }}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search people..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: 28, paddingRight: 8, paddingTop: 5, paddingBottom: 5,
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ef 100%)',
            border: '1px solid #b0aca0',
            borderRadius: 3,
            fontSize: 12,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#3a3830',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
            outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#7a9abf'}
          onBlur={e => e.currentTarget.style.borderColor = '#b0aca0'}
        />
        <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#9a9690' }} />
      </div>
    </div>

    {/* User List */}
    <div className="flex-1 overflow-y-auto flex flex-col gap-1 p-2 scrollbar-thin">

      {/* Online Users */}
      {onlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).map((onlineUser) => (
        <div
          key={onlineUser.username}
          onClick={() => {
            if (onlineUser.email === currentUser.email) return;
            onUserClick({ ...onlineUser, status: "online" });
          }}
          style={{ borderRadius: 4, cursor: 'pointer', transition: 'all 0.1s' }}
          className="flex items-center gap-2 px-2 py-1.5 group"
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #deeaf8 0%, #ccddf0 100%)';
            e.currentTarget.style.border = '1px solid #9abbd8';
            e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.border = '1px solid transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="relative shrink-0">
            <img
              src={onlineUser.avatar}
              className="w-9 h-9 xl:w-11 xl:h-11 rounded"
              alt={onlineUser.username}
              style={{ border: '1px solid #b0aca0', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            />
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: 11, height: 11,
              background: 'linear-gradient(180deg, #60d840 0%, #30a810 100%)',
              border: '1.5px solid white',
              borderRadius: '50%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span style={{
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#2a2820',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
              className="group-hover:text-[#1a4a8a]"
            >{onlineUser.username}</span>
            <span style={{ fontSize: 10, color: '#3a9020', fontFamily: 'Segoe UI, Tahoma, sans-serif', fontWeight: 600 }}>● online</span>
          </div>
        </div>
      ))}

      {/* Divider if both lists have items */}
      {onlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).length > 0 &&
        offlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).length > 0 && (
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #b0aca0, transparent)', margin: '4px 0' }} />
        )}

      {/* Offline Users */}
      {offlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).map((offlineUser) => (
        <div
          key={offlineUser.username}
          onClick={() => {
            onUserClick({ ...offlineUser, status: "offline" });
          }}
          style={{ borderRadius: 4, cursor: 'pointer', transition: 'all 0.1s', opacity: 0.75 }}
          className="flex items-center gap-2 px-2 py-1.5 group"
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #eeebe5 0%, #e0ddd7 100%)';
            e.currentTarget.style.border = '1px solid #c0bdb5';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.border = '1px solid transparent';
            e.currentTarget.style.opacity = '0.75';
          }}
        >
          <div className="relative shrink-0">
            <img
              src={offlineUser.avatar}
              className="w-9 h-9 xl:w-11 xl:h-11 rounded"
              alt={offlineUser.username}
              style={{ border: '1px solid #b0aca0', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', filter: 'grayscale(30%)' }}
            />
            {/* Offline dot */}
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: 11, height: 11,
              background: 'linear-gradient(180deg, #c0bdb5 0%, #909088 100%)',
              border: '1.5px solid white',
              borderRadius: '50%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span style={{
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#6a6860',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{offlineUser.username}</span>
            <span style={{ fontSize: 10, color: '#9a9890', fontFamily: 'Segoe UI, Tahoma, sans-serif', fontWeight: 600 }}>● offline</span>
          </div>
        </div>
      ))}

      {onlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).length === 0 &&
        offlineUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase())).length === 0 && (
          <div style={{ fontSize: 11, color: '#9a9890', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
            No results found
          </div>
        )}
    </div>
  </div>
);

export default  PeopleOnlineContent