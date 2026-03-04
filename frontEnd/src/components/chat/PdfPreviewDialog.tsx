import {Download ,X
} from 'lucide-react';
import { motion} from 'motion/react';
import { TitleBar } from '../common/TitleBar';

function PdfPreviewDialog({ pdf, onClose }: { pdf: { name: string, content: string }, onClose: () => void }) {
  return (
  <div
    className="fixed inset-0 flex items-center justify-center z-[250] p-4"
    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      onClick={e => e.stopPropagation()}
      style={{
        width: '90vw', maxWidth: 1000,
        height: '90vh', maxHeight: 700,
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #f8f8f8 0%, #ececec 100%)',
        border: '1px solid #b0b0b0',
        borderRadius: 8,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}
    >
      <TitleBar title={`PDF Preview — ${pdf.name}`} variant="live" icon="/assets/icons/image.png" onClose={onClose} />

    

      {/* PDF viewer area */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#606060',
        overflow: 'hidden',
      }}>
        {/* Inner shadow overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        <iframe
          src={pdf.content}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title={pdf.name}
        />
      </div>

      {/* Footer bar */}
      <div style={{
        height: 44, flexShrink: 0,
        background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
        borderTop: '1px solid #b0b0b0',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 14, paddingRight: 14,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
      }}>
        {/* Left — file info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 18,
            background: 'linear-gradient(180deg, #ff5555 0%, #cc1111 100%)',
            border: '1px solid #aa0000',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 6, fontWeight: 900, color: 'white', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>PDF</span>
          </div>
          <span style={{
            fontSize: 11, color: '#666',
            fontFamily: 'Segoe UI, Tahoma, sans-serif',
            fontStyle: 'italic',
          }}>
            {pdf.name}
          </span>
        </div>

        {/* Right — action buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={pdf.content}
            download={pdf.name}
            style={{
              height: 28, paddingLeft: 14, paddingRight: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(180deg, #4a85d8 0%, #2a5fb5 100%)',
              border: '1px solid #1e4fa0',
              borderRadius: 5,
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#fff', textDecoration: 'none',
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
            <Download size={13} /> Download
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              height: 28, paddingLeft: 14, paddingRight: 14,
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
              border: '1px solid #c0c0c0',
              borderRadius: 5,
              fontSize: 12, fontWeight: 700,
              fontFamily: 'Segoe UI, Tahoma, sans-serif',
              color: '#444',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95)',
              transition: 'all 0.1s',
              cursor: 'pointer',
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
            <X size={13} /> Close
          </motion.button>
        </div>
      </div>
    </motion.div>
  </div>
);
}


export default PdfPreviewDialog