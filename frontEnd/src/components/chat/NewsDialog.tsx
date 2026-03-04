
import { motion } from "motion/react";
import {  NewsItem } from '../../types';
import { TitleBar } from '../common/TitleBar';
import {
  Plus,ExternalLink, TrendingUp ,Clock ,X
} from 'lucide-react';


function NewsDialog({ news, onClose }: { news: NewsItem, onClose: () => void }) {
  return (
<div
  className="fixed inset-0 flex items-center justify-center z-[150] p-4"
  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
  onClick={onClose}
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 40 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 40 }}
    onClick={e => e.stopPropagation()}
    style={{
      width: 720,
      maxWidth: '95vw',
      maxHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      border: '1px solid #b0b0b0',
      borderRadius: 8,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 40px rgba(0,0,0,0.4)',
      overflow: 'hidden',
    }}
  >
    <TitleBar title="Dot Messenger News Reader" variant="live" icon="/assets/icons/image.png" onClose={onClose} />

    {/* Toolbar strip */}
    <div style={{
      height: 34,
      background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
      borderBottom: '1px solid #c0c0c0',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      gap: 8,
      flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
    }}>
      {/* News type badge */}
      <div style={{
        height: 20,
        paddingLeft: 10, paddingRight: 10,
        display: 'flex', alignItems: 'center',
        background: news.type === 'breaking'
          ? 'linear-gradient(180deg, #ff5533 0%, #cc2200 100%)'
          : 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
        border: `1px solid ${news.type === 'breaking' ? '#aa1100' : '#1e4fa0'}`,
        borderRadius: 3,
        fontSize: 9, fontWeight: 900, color: '#fff',
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
        flexShrink: 0,
      }}>
        {news.type}
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 16, background: 'linear-gradient(180deg, transparent, #c0c0c0, transparent)' }} />

      {/* Headline preview */}
      <span style={{
        fontSize: 11, fontWeight: 700,
        fontFamily: 'Segoe UI, Tahoma, sans-serif',
        color: '#444',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        flex: 1,
      }}>
        {news.headline}
      </span>

      {/* Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <Clock size={11} color="#7aaee0" />
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#888',
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
        }}>
          {new Date(news.publicationTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>

    {/* Scrollable content */}
    <div
      className="flex-1 overflow-y-auto scrollbar-thin"
      style={{ background: '#f4f4f4' }}
    >
      {/* Cover image */}
      {news.coverImage ? (
        <div style={{ width: '100%', height: 280, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={news.coverImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            alt="Cover"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 20, left: 24, right: 24,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <h2 style={{
              fontSize: 26, fontWeight: 900,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {news.headline}
            </h2>
          </div>
        </div>
      ) : (
        /* No cover — headline panel */
        <div style={{
          padding: '24px 28px 18px',
          background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
          borderBottom: '1px solid #b0c8e8',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
        }}>
          <h2 style={{
            fontSize: 24, fontWeight: 900,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#1a3e7a',
            lineHeight: 1.25,
            margin: 0,
            textShadow: '0 1px 0 rgba(255,255,255,0.6)',
          }}>
            {news.headline}
          </h2>
        </div>
      )}

      {/* Article body */}
      <div style={{
        padding: '22px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f8ff 100%)',
        borderTop: news.coverImage ? '3px solid #3169C6' : 'none',
      }}>
        {/* Article text */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          {news.text.split('\n').map((para, i) => (
            para.trim() && (
              <p key={i} style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: '#333',
                fontFamily: 'Georgia, Segoe UI, serif',
                margin: 0,
              }}>
                {i === 0 && (
                  <span style={{
                    float: 'left',
                    fontSize: 52,
                    fontWeight: 900,
                    lineHeight: 0.85,
                    marginRight: 6,
                    marginTop: 4,
                    color: '#2a5fb5',
                    fontFamily: 'Georgia, serif',
                  }}>
                    {para[0]}
                  </span>
                )}
                {i === 0 ? para.slice(1) : para}
              </p>
            )
          ))}
        </div>

        {/* Attachments */}
        {news.attachments && news.attachments.length > 0 && (
          <div style={{
            background: 'linear-gradient(180deg, #f0f6ff 0%, #e4eeff 100%)',
            border: '1px solid #b0c8e8',
            borderRadius: 6,
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
              <div style={{
                width: 18, height: 18,
                background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                border: '1px solid #1e4fa0',
                borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
                <TrendingUp size={10} color="white" />
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800, color: '#1a3e7a',
                fontFamily: 'Segoe UI, Tahoma, sans-serif',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                Discover More Content
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {news.attachments.map((att, i) => (
               <a 
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
                    border: '1px solid #b0c8e8',
                    borderRadius: 4,
                    textDecoration: 'none',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#1e4fa0';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = '#b0c8e8';
                  }}
                >
                  <ExternalLink size={12} color="#3169C6" />
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    fontFamily: 'Segoe UI, Tahoma, sans-serif',
                    color: '#1a3e7a',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {att.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Footer */}
    <div style={{
      height: 48,
      background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
      borderTop: '1px solid #b0b0b0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 14,
      paddingRight: 14,
      flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      {/* Published info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Clock size={12} color="#7aaee0" />
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#777',
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Published {new Date(news.publicationTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        style={{
          height: 30, paddingLeft: 20, paddingRight: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          border: '1px solid #c0c0c0',
          borderRadius: 5,
          fontSize: 12, fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#444',
          cursor: 'pointer',
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
        <X size={12} /> Close Article
      </motion.button>
    </div>
  </motion.div>
</div>
  );
}

export default NewsDialog