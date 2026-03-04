import { TitleBar } from '../common/TitleBar';
import { motion} from 'motion/react';

function PendingPhotoDialog({ imageData, onClose, onSend }: { imageData: { url: string, text: string }, onClose: () => void, onSend: (url: string, text: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-[450px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
      >
        <TitleBar title="Preview Photo - Windows Photo Viewer" variant="live" icon="/assets/icons/user.png" />
        <div className="p-6 flex flex-col items-center gap-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <div className="relative group w-full flex justify-center">
            <div className="absolute -inset-1 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={imageData.url}
              className="max-w-full max-h-[350px] object-contain rounded-md border border-white/50 shadow-lg relative z-10"
              alt="Pending Photo"
            />
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <div className="text-[15px] text-gray-800 font-semibold drop-shadow-sm">Send this photo to Dot Messenger?</div>
            <div className="text-[12px] text-gray-500 font-medium italic">Image will be sent as a high-quality attachment</div>
          </div>

          <div className="flex gap-4 w-full z-10">
            <button
              onClick={() => onSend(imageData.url, imageData.text)}
              className="flex-1 h-11 bg-gradient-to-b from-[#4BA1E8] via-[#3B8ED4] to-[#2B7BC0] text-white rounded-md text-sm font-bold shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:brightness-95 active:shadow-inner transition-all border border-[#1A5485] flex items-center justify-center gap-2"
            >
              <span>Send Photo</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-11 bg-gradient-to-b from-[#F2F2F2] via-[#E6E6E6] to-[#D9D9D9] border border-[#A6A6A6] rounded-md text-sm font-bold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] hover:from-white hover:to-[#F0F0F0] active:brightness-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export default PendingPhotoDialog