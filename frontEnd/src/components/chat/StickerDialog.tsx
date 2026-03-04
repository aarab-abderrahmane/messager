
import React, { useState  ,useEffect} from 'react';
import { motion } from 'motion/react';
import { TitleBar } from '../common/TitleBar';
import {Search ,X} from 'lucide-react';
import {  STICKERS } from '../../constants';

function StickerDialog({ onSelect, onClose, fetchRandomGif }: { onSelect: (url: string, type: 'sticker' | 'gif') => void, onClose: () => void, fetchRandomGif: (q: string) => Promise<any> }) {
  const [tab, setTab] = useState<'stickers' | 'gifs'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');

  const [gifList, setGifList] = useState()

  useEffect(() => {
    // This timer makes sure we wait 500ms after you stop typing
    const delayDebounceFn = setTimeout(async () => {
      const data = await fetchRandomGif(searchQuery ? searchQuery : "funny");

      if (Array.isArray(data)) {
        setGifList(data);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn); // Clean up the timer
  }, [searchQuery]);


  const filteredItems = gifList?.filter(gif => {

    return gif.slug.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <div className="fixed inset-0 flex items-center justify-center z-[130] p-4"
  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    style={{
      width: 460,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      border: '1px solid #b0b0b0',
      borderRadius: 8,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(0,0,0,0.35)',
      overflow: 'hidden',
    }}
  >
    <TitleBar title="Select Sticker or GIF" />

    {/* Tab bar */}
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
      borderBottom: '1px solid #b0c8e8',
      paddingLeft: 10,
      paddingTop: 6,
      gap: 3,
      flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      {[
        { id: 'stickers', label: '✦ Stickers' },
        { id: 'gifs', label: '▶ GIFs' },
      ].map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          style={{
            height: 26,
            paddingLeft: 16, paddingRight: 16,
            fontSize: 11,
            fontWeight: 800,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            cursor: 'pointer',
            border: '1px solid',
            borderBottom: tab === t.id ? '1px solid transparent' : '1px solid #b0c8e8',
            borderColor: tab === t.id ? '#b0c8e8' : 'transparent',
            borderRadius: '4px 4px 0 0',
            background: tab === t.id
              ? 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)'
              : 'transparent',
            color: tab === t.id ? '#1a3e7a' : '#5a7fa8',
            marginBottom: tab === t.id ? -1 : 0,
            transition: 'all 0.1s',
            boxShadow: tab === t.id ? 'inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
          }}
          onMouseEnter={e => {
            if (tab !== t.id) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.color = '#1a3e7a';
            }
          }}
          onMouseLeave={e => {
            if (tab !== t.id) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#5a7fa8';
            }
          }}
        >
          {t.label}
        </button>
      ))}
    </div>

    {/* Body */}
    <div style={{
      padding: '10px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      background: 'linear-gradient(180deg, #f8f8f8 0%, #f4f4f4 100%)',
    }}>

      {/* GIF search */}
      {tab === 'gifs' && (
        <div style={{ position: 'relative' }}>
          <Search
            size={13}
            style={{
              position: 'absolute', left: 9,
              top: '50%', transform: 'translateY(-50%)',
              color: '#7aaee0',
            }}
          />
          <input
            type="text"
            placeholder="Search GIFs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 28,
              paddingLeft: 28, paddingRight: 10,
              background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
              border: '1px solid #b0c8e8',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#333',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: 'inset 0 1px 2px rgba(49,105,198,0.08)',
              transition: 'border-color 0.1s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#b0c8e8'; }}
          />
        </div>
      )}

      {/* Grid */}
      <div
        className="scrollbar-thin"
        style={{
          height: 320,
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f8ff 100%)',
          border: '1px solid #b0c8e8',
          borderRadius: 5,
          padding: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          boxShadow: 'inset 0 1px 3px rgba(49,105,198,0.07)',
          alignContent: 'start',
        }}
      >
        {tab === 'gifs' ? (
          filteredItems?.length > 0 ? (
            filteredItems.map((gif, i) => (
              <div
                key={i}
                onClick={() => onSelect(gif.images.fixed_height.url, 'gif')}
                style={{
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)',
                  border: '1px solid #c8c8c8',
                  borderRadius: 5,
                  padding: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c8e0ff 100%)';
                  e.currentTarget.style.borderColor = '#7aaee0';
                  e.currentTarget.style.transform = 'scale(1.06)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(49,105,198,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)';
                  e.currentTarget.style.borderColor = '#c8c8c8';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9)';
                }}
              >
                <img
                  src={gif.images.fixed_height.url}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 3 }}
                  alt="GIF"
                />
                {/* GIF badge */}
                <div style={{
                  position: 'absolute', bottom: 3, right: 3,
                  background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                  border: '1px solid #1e4fa0',
                  borderRadius: 3,
                  padding: '0px 4px',
                  fontSize: 7, fontWeight: 900, color: '#fff',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                }}>GIF</div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8, height: 200, color: '#aaa',
            }}>
              <Search size={28} style={{ opacity: 0.2 }} />
              <span style={{ fontSize: 11, fontFamily: 'Segoe UI, Tahoma, sans-serif', fontStyle: 'italic' }}>
                No results for "{searchQuery}"
              </span>
            </div>
          )
        ) : (
          STICKERS.length > 0 ? (
            STICKERS.map((url, i) => (
              <div
                key={i}
                onClick={() => onSelect(url, 'sticker')}
                style={{
                  background: 'linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)',
                  border: '1px solid #c8c8c8',
                  borderRadius: 5,
                  padding: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                  transition: 'all 0.12s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #fff8e0 0%, #fff0b0 100%)';
                  e.currentTarget.style.borderColor = '#d4a800';
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(180,140,0,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)';
                  e.currentTarget.style.borderColor = '#c8c8c8';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9)';
                }}
              >
                <img
                  src={url}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 3, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
                  alt="Sticker"
                />
                {/* Sticker badge */}
                <div style={{
                  position: 'absolute', bottom: 3, right: 3,
                  background: 'linear-gradient(180deg, #f0a020 0%, #c07010 100%)',
                  border: '1px solid #a06000',
                  borderRadius: 3,
                  padding: '0px 4px',
                  fontSize: 7, fontWeight: 900, color: '#fff',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                }}>✦</div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8, height: 200, color: '#aaa',
            }}>
              <Search size={28} style={{ opacity: 0.2 }} />
              <span style={{ fontSize: 11, fontFamily: 'Segoe UI, Tahoma, sans-serif', fontStyle: 'italic' }}>
                No stickers available
              </span>
            </div>
          )
        )}
      </div>
    </div>

    {/* Footer */}
    <div style={{
      padding: '8px 12px',
      background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
      borderTop: '1px solid #c0c0c0',
      display: 'flex',
      justifyContent: 'flex-end',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClose}
        style={{
          height: 28, paddingLeft: 20, paddingRight: 20,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          border: '1px solid #c0c0c0',
          borderRadius: 5,
          fontSize: 11, fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#444',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
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
        <X size={11} /> Cancel
      </motion.button>
    </div>
  </motion.div>
</div>
  );
}


export default StickerDialog