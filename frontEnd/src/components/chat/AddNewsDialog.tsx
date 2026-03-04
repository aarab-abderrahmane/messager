import React, { useState } from 'react';
import { TitleBar } from '../common/TitleBar';
import { motion  } from 'motion/react';
import {  NewsItem } from '../../types';
import {Type , Tag,Calendar,ImageIcon ,ExternalLink,Plus, X ,Newspaper} from "lucide-react"

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
  <div
  className="fixed inset-0 flex items-center justify-center z-[150] p-4"
  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
>
  <motion.div
    initial={{ scale: 0.95, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.95, opacity: 0, y: 20 }}
    style={{
      width: 600,
      maxWidth: '96vw',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
      border: '1px solid #b0b0b0',
      borderRadius: 8,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 40px rgba(0,0,0,0.35)',
      overflow: 'hidden',
    }}
  >
    <TitleBar title="Create News Item — MSN Today" variant="live" icon="/assets/icons/globe.png" />

    {/* Subheader strip */}
    <div style={{
      background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
      borderBottom: '1px solid #b0c8e8',
      padding: '10px 18px',
      display: 'flex', alignItems: 'center', gap: 10,
      flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      {/* Newspaper icon badge */}
      <div style={{
        width: 34, height: 34,
        background: 'linear-gradient(180deg, #ffe033 0%, #d4a800 100%)',
        border: '1px solid #b8900a',
        borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.15)',
        flexShrink: 0,
      }}>
        <Newspaper size={17} color="#7a5500" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#1a3e7a', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
          Post a News Article
        </span>
        <span style={{ fontSize: 11, color: '#5a7fa8', fontFamily: 'Segoe UI, Tahoma, sans-serif', fontStyle: 'italic' }}>
          Fill in the details below to publish to MSN Today
        </span>
      </div>

      {/* Breaking badge preview */}
      {type === 'breaking' && (
        <div style={{
          marginLeft: 'auto',
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'linear-gradient(180deg, #ff4444 0%, #cc1111 100%)',
          border: '1px solid #aa0000',
          borderRadius: 10, padding: '2px 10px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', fontFamily: 'Segoe UI, Tahoma, sans-serif', letterSpacing: '0.05em' }}>BREAKING</span>
        </div>
      )}
    </div>

    {/* Form body */}
    <form
      onSubmit={handleSubmit}
      className="scrollbar-thin"
      style={{
        padding: '18px 20px',
        display: 'flex', flexDirection: 'column', gap: 16,
        overflowY: 'auto',
        maxHeight: '70vh',
        background: 'linear-gradient(180deg, #f8f8f8 0%, #f4f4f4 100%)',
      }}
    >

      {/* Row 1 — Headline + Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{
            fontSize: 10, fontWeight: 800, color: '#5a7fa8',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Headline <span style={{ color: '#cc2222' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Type size={13} color="#7aaee0" />
            </div>
            <input
              type="text"
              required
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="Enter headline..."
              style={{
                width: '100%', height: 36,
                paddingLeft: 30, paddingRight: 10,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 5,
                fontSize: 13, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.1s', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(49,105,198,0.08), 0 0 0 2px rgba(74,133,216,0.12)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.06)'; }}
            />
          </div>
        </div>

        {/* News Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{
            fontSize: 10, fontWeight: 800, color: '#5a7fa8',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            News Type <span style={{ color: '#cc2222' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Tag size={13} color="#7aaee0" />
            </div>
            <select
              value={type}
              onChange={e => setType(e.target.value as 'breaking' | 'regular')}
              style={{
                width: '100%', height: 36,
                paddingLeft: 30, paddingRight: 10,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 5,
                fontSize: 13, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                appearance: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; }}
            >
              <option value="regular">Regular News</option>
              <option value="breaking">Breaking News</option>
            </select>
            {/* Custom dropdown arrow */}
            <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '5px solid #7aaee0' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{
          fontSize: 10, fontWeight: 800, color: '#5a7fa8',
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Description <span style={{ color: '#cc2222' }}>*</span>
        </label>
        <textarea
          required
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter news description..."
          style={{
            width: '100%', height: 100,
            padding: '10px 12px',
            background: '#fff',
            border: '1px solid #c0d4ec',
            borderRadius: 5,
            fontSize: 13, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
            outline: 'none', resize: 'none',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
            transition: 'all 0.1s', boxSizing: 'border-box',
            lineHeight: 1.6,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(49,105,198,0.08), 0 0 0 2px rgba(74,133,216,0.12)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.06)'; }}
        />
      </div>

      {/* Row 3 — Expiration + Cover Image */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Expiration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{
            fontSize: 10, fontWeight: 800, color: '#5a7fa8',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Expiration Date <span style={{ color: '#cc2222' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Calendar size={13} color="#7aaee0" />
            </div>
            <input
              type="date"
              required
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
              style={{
                width: '100%', height: 36,
                paddingLeft: 30, paddingRight: 10,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 5,
                fontSize: 13, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.1s', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; }}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{
            fontSize: 10, fontWeight: 800, color: '#5a7fa8',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Cover Image URL <span style={{ color: '#999', fontWeight: 600 }}>(optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <ImageIcon size={13} color="#7aaee0" />
            </div>
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              style={{
                width: '100%', height: 36,
                paddingLeft: 30, paddingRight: 10,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 5,
                fontSize: 13, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.1s', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; }}
            />
          </div>
        </div>
      </div>

      {/* Row 4 — Attachments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 6,
          borderBottom: '1px solid #d8e8f8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 16, height: 16,
              background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: '1px solid #1e4fa0', borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ExternalLink size={9} color="white" />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#5a7fa8', fontFamily: 'Segoe UI, Tahoma, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Attachments <span style={{ color: '#999', fontWeight: 600 }}>(Max 2)</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddAttachment}
            disabled={attachments.length >= 2}
            style={{
              height: 22, paddingLeft: 10, paddingRight: 10,
              display: 'flex', alignItems: 'center', gap: 4,
              background: attachments.length >= 2
                ? 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)'
                : 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: `1px solid ${attachments.length >= 2 ? '#c0c0c0' : '#1e4fa0'}`,
              borderRadius: 3,
              fontSize: 11, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: attachments.length >= 2 ? '#aaa' : '#fff',
              cursor: attachments.length >= 2 ? 'not-allowed' : 'pointer',
              boxShadow: attachments.length >= 2 ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.3)',
              transition: 'all 0.1s',
            }}
          >
            <Plus size={10} /> Add Link
          </button>
        </div>

        {/* Attachment rows */}
        {attachments.length === 0 && (
          <div style={{
            padding: '10px 14px',
            background: 'linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 100%)',
            border: '1px dashed #c0c8d8',
            borderRadius: 5,
            fontSize: 11, color: '#aaa', fontStyle: 'italic',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            textAlign: 'center',
          }}>
            No attachments added yet — click "Add Link" to include related URLs
          </div>
        )}

        {attachments.map((att, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px',
              background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
              border: '1px solid #b0c8e8',
              borderRadius: 5,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {/* Index badge */}
            <div style={{
              width: 20, height: 20, flexShrink: 0,
              background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: '1px solid #1e4fa0',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 900, color: '#fff',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
            }}>
              {i + 1}
            </div>

            <input
              type="text"
              placeholder="Label (e.g. Read more)"
              value={att.name}
              onChange={e => handleAttachmentChange(i, 'name', e.target.value)}
              style={{
                flex: 1, height: 30,
                paddingLeft: 9, paddingRight: 9,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 4,
                fontSize: 12, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'border-color 0.1s', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; }}
            />

            <input
              type="text"
              placeholder="https://..."
              value={att.url}
              onChange={e => handleAttachmentChange(i, 'url', e.target.value)}
              style={{
                flex: 2, height: 30,
                paddingLeft: 9, paddingRight: 9,
                background: '#fff',
                border: '1px solid #c0d4ec',
                borderRadius: 4,
                fontSize: 12, fontFamily: 'Segoe UI, Tahoma, sans-serif', color: '#222',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                transition: 'border-color 0.1s', boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4a85d8'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#c0d4ec'; }}
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
              style={{
                width: 22, height: 22, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid transparent',
                borderRadius: '50%', color: '#bbb', cursor: 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ffecec 0%, #ffd0d0 100%)';
                e.currentTarget.style.borderColor = '#e08080';
                e.currentTarget.style.color = '#cc2222';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#bbb';
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </form>

    {/* Footer */}
    <div style={{
      padding: '12px 20px',
      background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
      borderTop: '1px solid #c0c0c0',
      display: 'flex', gap: 8, justifyContent: 'flex-end',
      flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        form="news-form"
        onClick={handleSubmit}
        style={{
          height: 32, paddingLeft: 22, paddingRight: 22,
          background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
          border: '1px solid #1e4fa0', borderRadius: 5,
          fontSize: 13, fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#fff', cursor: 'pointer',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(42,95,181,0.3)',
          textShadow: '0 1px 1px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)'; }}
      >
        <Newspaper size={14} /> Post News
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onClose}
        style={{
          height: 32, paddingLeft: 22, paddingRight: 22,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          border: '1px solid #c0c0c0', borderRadius: 5,
          fontSize: 13, fontWeight: 700,
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          color: '#444', cursor: 'pointer',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)'; e.currentTarget.style.borderColor = '#aaa'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)'; e.currentTarget.style.borderColor = '#c0c0c0'; }}
      >
        <X size={13} /> Cancel
      </motion.button>
    </div>
  </motion.div>
</div>
  );
}


export default AddNewsDialog