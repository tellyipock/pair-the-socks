import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface FeedbackOverlayProps {
  status: 'idle' | 'correct' | 'wrong';
  isExiting?: boolean;
}
export function FeedbackOverlay({ status, isExiting = false }: FeedbackOverlayProps) {
  // Hide feedback if we are in the exit sequence
  if (isExiting) return null;
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none backdrop-blur-[2px]",
            status === 'correct' ? "bg-green-500/20" : "bg-red-500/20"
          )}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 12,
              stiffness: 400,
              duration: 0.15
            }}
            className={cn(
              "w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
              status === 'correct' ? "bg-green-500" : "bg-red-500"
            )}
          >
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping opacity-20" />
            {status === 'correct' ? (
              <Check className="w-24 h-24 md:w-36 md:h-36 text-white stroke-[5] drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]" />
            ) : (
              <X className="w-24 h-24 md:w-36 md:h-36 text-white stroke-[5] drop-shadow-[0_4px_0_rgba(0,0,0,0.2)]" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}