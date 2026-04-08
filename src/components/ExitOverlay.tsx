import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
interface ExitOverlayProps {
  isVisible: boolean;
}
export function ExitOverlay({ isVisible }: ExitOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-sock-blue p-6"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="bg-white p-6 rounded-full border-8 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
              <Smile className="w-24 h-24 md:w-32 md:h-32 text-sock-yellow stroke-[3]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase italic tracking-tighter drop-shadow-[4px_4px_0px_rgba(26,26,26,1)] px-4">
              Good bye and <br /> come back soon!
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}