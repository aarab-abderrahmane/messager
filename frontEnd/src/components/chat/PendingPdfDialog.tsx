import React, { useState } from 'react';
import { TitleBar } from '../common/TitleBar';
import { motion } from 'motion/react';
import { X, FileText
} from 'lucide-react';

function PendingPdfDialog({ files, onClose, onSend }: { files: File[], onClose: () => void, onSend: (files: File[]) => void }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(files);

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    if (newFiles.length === 0) {
      onClose();
    }
  };

return (
  <div className="fixed inset-0 flex items-center justify-center z-[200] p-4"
    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      style={{
        width: 440,
        background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
        border: '1px solid #b0b0b0',
        borderRadius: 8,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 32px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TitleBar title="Send PDF Files" variant="live" icon="/assets/icons/user.png" onClose={onClose} />

      {/* Subheader */}
      <div style={{
        background: 'linear-gradient(180deg, #f0f6ff 0%, #ddeeff 100%)',
        borderBottom: '1px solid #b0c8e8',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
      }}>
        {/* PDF icon badge */}
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(180deg, #ff5555 0%, #cc1111 100%)',
          border: '1px solid #aa0000',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}>
          <FileText size={18} color="white" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{
            fontSize: 13, fontWeight: 800, color: '#1a3e7a',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
          }}>
            Attached PDF Files
          </span>
          <span style={{
            fontSize: 11, color: '#5a7fa8',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            fontStyle: 'italic',
          }}>
            You can select up to 3 files at once
          </span>
        </div>

        {/* File count badge */}
        <div style={{
          marginLeft: 'auto',
          background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
          border: '1px solid #1e4fa0',
          borderRadius: 10,
          padding: '2px 10px',
          fontSize: 11, fontWeight: 800, color: '#fff',
          fontFamily: 'Segoe UI, Tahoma, sans-serif',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          {selectedFiles.length} / 3
        </div>
      </div>

      {/* File list */}
      <div
        className="scrollbar-thin"
        style={{
          minHeight: 100,
          maxHeight: 240,
          overflowY: 'auto',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          background: 'linear-gradient(180deg, #f8f8f8 0%, #f4f4f4 100%)',
        }}
      >
        {selectedFiles.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 10px',
              background: 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)',
              border: '1px solid #b0c8e8',
              borderRadius: 5,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(49,105,198,0.08)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #eaf2ff 0%, #ddeeff 100%)';
              e.currentTarget.style.borderColor = '#7aaee0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(180deg, #ffffff 0%, #f4f8ff 100%)';
              e.currentTarget.style.borderColor = '#b0c8e8';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
              {/* PDF type badge */}
              <div style={{
                width: 32, height: 30,
                background: 'linear-gradient(180deg, #ff5555 0%, #cc1111 100%)',
                border: '1px solid #aa0000',
                borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 900, color: 'white',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  letterSpacing: '-0.5px',
                }}>PDF</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                  color: '#222',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {file.name}
                </span>
                <span style={{
                  fontSize: 10, color: '#888',
                  fontFamily: 'Segoe UI, Tahoma, sans-serif',
                }}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFile(index)}
              title="Remove"
              style={{
                width: 20, height: 20, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid transparent',
                background: 'transparent',
                color: '#aaa',
                cursor: 'pointer',
                transition: 'all 0.1s',
                marginLeft: 8,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #ffecec 0%, #ffd0d0 100%)';
                e.currentTarget.style.borderColor = '#e08080';
                e.currentTarget.style.color = '#cc2222';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = '#aaa';
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer buttons */}
      <div style={{
        padding: '10px 12px',
        background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
        borderTop: '1px solid #c0c0c0',
        display: 'flex',
        gap: 8,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
      }}>
        {/* Send button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSend(selectedFiles)}
          style={{
            flex: 1, height: 34,
            background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
            border: '1px solid #1e4fa0',
            borderRadius: 5,
            fontSize: 12, fontWeight: 700,
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(42,95,181,0.3)',
            textShadow: '0 1px 1px rgba(0,0,0,0.2)',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #5a95e8 0%, #3a6fc5 100%)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)';
          }}
        >
          <FileText size={13} />
          Send {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
        </motion.button>

        {/* Cancel button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          style={{
            flex: 1, height: 34,
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
          <X size={13} /> Cancel
        </motion.button>
      </div>
    </motion.div>
  </div>
);
}

export default PendingPdfDialog