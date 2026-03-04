import React from "react"
import {  NewsItem } from '../../types';
import {
  Plus, Clock,
  Newspaper, ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

const NewsContent: React.FC<{
  newsList: NewsItem[];
  onAddClick: () => void;
  onNewsClick: (news: NewsItem) => void;
}> = ({ newsList, onAddClick, onNewsClick }) => (
  <div
    className="flex-1 flex flex-col overflow-hidden"
    style={{
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      border: '1px solid #c0c0c0',
      borderRadius: 10,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.10)',
    }}
  >
    {/* Title bar */}
    <div
      style={{
        background: 'linear-gradient(180deg, #ffe033 0%, #d4a800 100%)',
        borderBottom: '1px solid #b8900a',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 22, height: 22,
        background: 'linear-gradient(180deg, #fff 0%, #ffe066 100%)',
        border: '1px solid #b8900a',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}>
        <Newspaper size={12} color="#8a6000" />
      </div>

      <span style={{
        fontSize: 12, fontWeight: 800,
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        color: '#5a3a00',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textShadow: '0 1px 0 rgba(255,255,255,0.4)',
        flex: 1,
      }}>
        Breaking News
      </span>

      {/* LIVE badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'linear-gradient(180deg, #ff4444 0%, #cc1111 100%)',
        border: '1px solid #aa0000',
        borderRadius: 10,
        padding: '1px 7px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#fff',
          animation: 'pulse 1.5s infinite',
        }} />
        <span style={{
          fontSize: 9, fontWeight: 900, color: '#fff',
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          letterSpacing: '0.05em',
        }}>LIVE</span>
      </div>
    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto scrollbar-thin" style={{
      padding: '8px 6px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>

      {/* Add News button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAddClick}
        style={{
          height: 30,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          border: '1px solid #c0c0c0',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#444',
          cursor: 'pointer',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 1px 2px rgba(0,0,0,0.08)',
          marginBottom: 4,
          flexShrink: 0,
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
        <Plus size={12} color="#666" /> Add News
      </motion.button>

      {/* News items */}
      {newsList
        .filter(news => new Date(news.expirationDate) > new Date())
        .map((news) => (
          <motion.div
            key={news.id}
            whileHover={{ x: 2 }}
            onClick={() => onNewsClick(news)}
            className="group/item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              padding: '5px 8px',
              borderRadius: 5,
              cursor: 'pointer',
              borderLeft: news.type === 'breaking' ? '3px solid #d4a800' : '3px solid #b0b0b0',
              background: 'transparent',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #e0e0e0 100%)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Headline row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden' }}>
              {news.type === 'breaking' && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(180deg, #ffdd00 0%, #cc9900 100%)',
                  border: '1px solid #aa7700',
                  boxShadow: '0 0 4px rgba(200,150,0,0.5)',
                  animation: 'pulse 1.5s infinite',
                }} />
              )}
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                color: news.type === 'breaking' ? '#7a5500' : '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}>
                {news.headline}
              </span>
              <ExternalLink
                size={9}
                style={{ flexShrink: 0, color: '#aaa', opacity: 0, transition: 'opacity 0.1s' }}
                className="group-hover/item:opacity-100"
              />
            </div>

            {/* Time row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 11 }}>
              <Clock size={8} color="#999" />
              <span style={{
                fontSize: 9, fontWeight: 700, color: '#999',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {new Date(news.publicationTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </motion.div>
        ))}

      {/* Divider */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 8,
        borderTop: '1px solid #d0d0d0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Dot Digital Network
        </span>
      </div>
    </div>
  </div>
);


export default NewsContent