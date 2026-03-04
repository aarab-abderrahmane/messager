import React, { useState } from 'react';
import { motion} from 'motion/react';
import {X} from "lucide-react"

function GiftDialog({ onClose, onSend }: { onClose: () => void, onSend: (msg: string, count: number) => void }) {
  const [msg, setMsg] = useState('');
  const [count, setCount] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-[400px] bg-white border border-[#ACA899] rounded-lg shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="h-8 bg-gradient-to-b from-[#0058E6] via-[#3C96FF] to-[#0058E6] flex items-center justify-between px-2">
          <span className="text-white font-bold text-xs">Send a Gift</span>
          <button onClick={onClose} className="text-white hover:bg-red-500 p-1 rounded transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Gift Message</label>
            <input
              type="text"
              className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
              placeholder="Enter your message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600">Number of people who can open it (Max 5)</label>
            <select
              className="w-full h-10 px-3 border border-[#ACA899] rounded-md text-sm focus:outline-none focus:border-[#003399]"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              disabled={count >= 5}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
            {count >= 5 && <p className="text-[10px] text-red-500 font-bold mt-1">Maximum limit reached (5). Deactivated automatically.</p>}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onSend(msg, count)}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
            >
              Send Gift
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-gradient-to-b from-[#F8F8F8] to-[#D6D3C4] border border-[#ACA899] rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:brightness-105 active:shadow-inner transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export default GiftDialog