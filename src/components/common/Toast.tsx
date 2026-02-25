import React from 'react';
import { motion } from 'motion/react';
import { Check, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 border ${
      type === 'success' 
        ? 'bg-[#88C057] border-[#6DA045] text-white' 
        : 'bg-[#E96E4C] border-[#C33E23] text-white'
    }`}
    style={{
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
    }}
  >
    {type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
    <span className="text-sm font-bold drop-shadow-sm">{message}</span>
    <button onClick={onClose} className="ml-2 hover:brightness-110 transition-all p-1 rounded-full hover:bg-white/20">
      <X size={16} />
    </button>
  </motion.div>
);
