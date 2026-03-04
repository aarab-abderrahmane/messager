import {
  Plus, Minus as MinusIcon, Download ,  ZoomOut, ZoomIn, RotateCcw
} from 'lucide-react';
import React, { useState} from 'react';
import { motion } from 'motion/react';
import { TitleBar } from '../common/TitleBar';


function PhotoPreviewDialog({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
  const [scale, setScale] = useState(0.9);

  const zoomIn = (e: React.MouseEvent) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.25, 3)); };
  const zoomOut = (e: React.MouseEvent) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.25, 0.5)); };
  const reset = (e: React.MouseEvent) => { e.stopPropagation(); setScale(1); };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[200] p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 800,
          maxWidth: '95vw',
          height: '85vh',
          maxHeight: 640,
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          border: '1px solid #a0a0a0',
          borderRadius: 8,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <TitleBar title="Windows Photo Viewer" variant="live" icon="/assets/icons/image.png" onClose={onClose} />

        {/* Toolbar strip */}
        <div style={{
          height: 36,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          borderBottom: '1px solid #c0c0c0',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
          gap: 4,
          flexShrink: 0,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
        }}>
          {/* Zoom out toolbar btn */}
          {[
            { icon: <ZoomOut size={14} />, label: 'Zoom Out', action: zoomOut },
            { icon: <ZoomIn size={14} />, label: 'Zoom In', action: zoomIn },
            { icon: <RotateCcw size={14} />, label: 'Reset', action: reset },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              title={btn.label}
              style={{
                height: 24,
                paddingLeft: 8, paddingRight: 8,
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                border: '1px solid #c0c0c0',
                borderRadius: 3,
                fontSize: 11,
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
                e.currentTarget.style.color = '#1a4fa0';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                e.currentTarget.style.borderColor = '#c0c0c0';
                e.currentTarget.style.color = '#444';
              }}
            >
              {btn.icon} {btn.label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: 'linear-gradient(180deg, transparent, #c0c0c0, transparent)', margin: '0 4px' }} />

          {/* Zoom % display */}
          <div style={{
            height: 24, paddingLeft: 8, paddingRight: 8,
            display: 'flex', alignItems: 'center',
            background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
            border: '1px solid #c0c0c0',
            borderRadius: 3,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#333',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
            minWidth: 52,
            justifyContent: 'center',
          }}>
            {Math.round(scale * 100)}%
          </div>
        </div>

        {/* Image area — checkered background like a real photo viewer */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: `
              linear-gradient(45deg, #ddd 25%, transparent 25%),
              linear-gradient(-45deg, #ddd 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ddd 75%),
              linear-gradient(-45deg, transparent 75%, #ddd 75%)
            `,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            backgroundColor: '#eaeaea',
          }}
        >
          <motion.img
            src={imageUrl}
            animate={{ scale }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              transformOrigin: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              border: '1px solid #c0c0c0',
              borderRadius: 2,
            }}
            alt="Preview"
          />
        </div>

        {/* Bottom action bar */}
        <div
          style={{
            height: 62,
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
            borderTop: '1px solid #b0b0b0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexShrink: 0,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          {/* Zoom controls pill */}
          {/* <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
            border: '1px solid #c0c0c0',
            borderRadius: 20,
            padding: '4px 10px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
          }}>
            <button
              onClick={zoomOut}
              style={{
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                border: '1px solid #c0c0c0',
                borderRadius: '50%',
                color: '#555',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ffecec 0%, #ffd0d0 100%)';
                e.currentTarget.style.borderColor = '#e08080';
                e.currentTarget.style.color = '#cc2222';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                e.currentTarget.style.borderColor = '#c0c0c0';
                e.currentTarget.style.color = '#555';
              }}
            >
              <MinusIcon size={12} />
            </button>

            <span style={{
              fontSize: 12, fontWeight: 800, color: '#333',
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              minWidth: 40, textAlign: 'center',
              tabularNums: 'tabular-nums',
            }}>
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={zoomIn}
              style={{
                width: 22, height: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)',
                border: '1px solid #c0c0c0',
                borderRadius: '50%',
                color: '#555',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ddeeff 0%, #c2d8f5 100%)';
                e.currentTarget.style.borderColor = '#7aaee0';
                e.currentTarget.style.color = '#1a4fa0';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #f8f8f8 0%, #e4e4e4 100%)';
                e.currentTarget.style.borderColor = '#c0c0c0';
                e.currentTarget.style.color = '#555';
              }}
            >
              <Plus size={12} />
            </button>
          </div> */}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
            border: '1px solid #c0c0c0',
            borderRadius: 20,
            padding: '4px 6px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
          }}>

            {/* Zoom Out */}
            <button
              onClick={zoomOut}
              title="Zoom Out"
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #e05050 0%, #b83030 100%)',
                border: '1px solid #902020',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg, #f06060 0%, #c84040 100%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg, #e05050 0%, #b83030 100%)'}
            >
              <MinusIcon size={15} />
            </button>

            {/* Zoom track */}
            <div style={{
              width: 80,
              height: 4,
              background: '#222',
              borderRadius: 2,
              border: '1px solid #444',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${((scale - 0.25) / 2.75) * 100}%`,
                background: 'linear-gradient(90deg, #4a85d8, #7ab0f0)',
                borderRadius: 2,
                transition: 'width 0.2s',
              }} />
            </div>

            {/* Zoom In */}
            <button
              onClick={zoomIn}
              title="Zoom In"
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
                border: '1px solid #1e4fa0',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)'}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)'}
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'linear-gradient(180deg, transparent, #b0b0b0, transparent)' }} />

          {/* Download button */}
          <a
            href={imageUrl}
            download="shared-photo.png"
            style={{
              height: 38,
              paddingLeft: 14, paddingRight: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: '1px solid #1e4fa0',
              borderRadius: 5,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(42,95,181,0.3)',
              textShadow: '0 1px 1px rgba(0,0,0,0.2)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)';
            }}
          >
            <Download size={13} /> Save Photo
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default PhotoPreviewDialog