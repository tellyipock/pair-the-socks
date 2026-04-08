import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface FeedbackOverlayProps {
  status: 'idle' | 'correct' | 'wrong';
}
export function FeedbackOverlay({ status }: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
            status === 'correct' ? "bg-green-500/20" : "bg-red-500/20"
          )}
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1.2, rotate: 0 }}
            exit={{ scale: 0 }}
            className={cn(
              "w-48 h-48 rounded-full flex items-center justify-center border-8 border-white shadow-2xl",
              status === 'correct' ? "bg-green-500" : "bg-red-500"
            )}
          >
            {status === 'correct' ? (
              <Check className="w-32 h-32 text-white stroke-[4]" />
            ) : (
              <X className="w-32 h-32 text-white stroke-[4]" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}