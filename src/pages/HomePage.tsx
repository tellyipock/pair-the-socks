import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sock } from '@/components/Sock';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { generateInitialSocks, SockData, isPerfectPair } from '@/lib/game-logic';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const [socks, setSocks] = useState<SockData[]>([]);
  const [selected, setSelected] = useState<SockData[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    setSocks(generateInitialSocks());
  }, []);
  const handleReset = () => {
    setSocks(generateInitialSocks());
    setSelected([]);
    setScore(0);
    setStatus('idle');
    setIsLocked(false);
  };
  const handleSockClick = (sock: SockData) => {
    if (isLocked || sock.isMatched || selected.find(s => s.id === sock.id)) return;
    const newSelected = [...selected, sock];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      validatePair(newSelected[0], newSelected[1]);
    }
  };
  const validatePair = (s1: SockData, s2: SockData) => {
    setIsLocked(true);
    if (isPerfectPair(s1, s2)) {
      setStatus('correct');
      setTimeout(() => {
        setSocks(prev => prev.map(s => 
          (s.id === s1.id || s.id === s2.id) ? { ...s, isMatched: true } : s
        ));
        setSelected([]);
        setScore(prev => prev + 2);
        setStatus('idle');
        setIsLocked(false);
        // Check game win
        const remaining = socks.filter(s => !s.isMatched && s.id !== s1.id && s.id !== s2.id);
        if (remaining.length === 0) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 1000);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setSelected([]);
        setScore(prev => Math.max(0, prev - 1));
        setStatus('idle');
        setIsLocked(false);
      }, 1000);
    }
  };
  const matchedCount = socks.filter(s => s.isMatched).length;
  const isGameOver = matchedCount === 12 && matchedCount > 0;
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#1A1A1A] text-foreground font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex flex-col gap-8 md:gap-12 min-h-screen">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-display font-black text-[#1A1A1A] dark:text-white uppercase tracking-tighter">
                Pair <span className="text-[#FF6B6B]">The</span> Socks
              </h1>
              <p className="text-muted-foreground font-medium">Find the perfect match!</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="relative top-0 right-0" />
              <Button 
                onClick={handleReset} 
                variant="outline" 
                className="border-4 border-[#1A1A1A] hover:bg-[#FFD93D] transition-colors font-bold rounded-xl h-12"
              >
                <RotateCcw className="mr-2 h-5 w-5" /> RESET
              </Button>
            </div>
          </header>
          {/* Interaction Area */}
          <main className="flex-1 flex flex-col gap-12 relative">
            {/* Pairing Box */}
            <section className="relative h-48 md:h-64 rounded-4xl border-4 border-dashed border-[#1A1A1A]/20 bg-white/50 dark:bg-black/20 flex items-center justify-center gap-8 px-8">
              <AnimatePresence mode="popLayout">
                {selected.map((sock) => (
                  <motion.div
                    key={sock.id}
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="z-10"
                  >
                    <Sock {...sock} size="large" />
                  </motion.div>
                ))}
              </AnimatePresence>
              {selected.length === 0 && (
                <p className="text-2xl font-bold text-muted-foreground/40 uppercase">Pick two socks!</p>
              )}
              {selected.length === 1 && (
                <div className="w-24 h-32 rounded-3xl border-4 border-dashed border-[#1A1A1A]/10 animate-pulse" />
              )}
            </section>
            {/* Pile Stage */}
            <section className="flex-1 relative bg-white dark:bg-zinc-900/50 rounded-5xl border-4 border-[#1A1A1A] overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
              <div className="absolute inset-0 p-8">
                {socks.filter(s => !s.isMatched && !selected.find(sel => sel.id === s.id)).map((sock) => (
                  <motion.div
                    key={sock.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${sock.x}%`,
                      top: `${sock.y}%`,
                    }}
                    whileHover={{ scale: 1.1, zIndex: 30 }}
                    animate={{ rotate: sock.rotation }}
                  >
                    <Sock 
                      {...sock} 
                      onClick={() => handleSockClick(sock)} 
                    />
                  </motion.div>
                ))}
              </div>
              {/* Game Over Screen Overlay */}
              <AnimatePresence>
                {isGameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-40 bg-[#FFD93D] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                    >
                      <Trophy className="w-32 h-32 text-[#1A1A1A] mb-6" />
                    </motion.div>
                    <h2 className="text-6xl font-black text-[#1A1A1A] mb-4 uppercase">Amazing!</h2>
                    <p className="text-2xl font-bold text-[#1A1A1A]/80 mb-8">You paired all the socks with {score} points!</p>
                    <Button 
                      size="lg" 
                      onClick={handleReset}
                      className="bg-[#1A1A1A] text-white hover:bg-zinc-800 text-xl font-bold px-12 py-8 rounded-2xl h-auto"
                    >
                      PLAY AGAIN
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </main>
          {/* Scoreboard */}
          <footer className="flex justify-center">
            <Card className="px-12 py-6 border-4 border-[#1A1A1A] bg-[#4D96FF] text-white rounded-4xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-xs font-black uppercase opacity-80">Score</p>
                  <p className="text-5xl font-black tabular-nums">{score}</p>
                </div>
                <div className="h-12 w-1 bg-white/20 rounded-full" />
                <div className="text-center">
                  <p className="text-xs font-black uppercase opacity-80">Pairs</p>
                  <p className="text-5xl font-black tabular-nums">{matchedCount / 2}/6</p>
                </div>
              </div>
            </Card>
          </footer>
        </div>
      </div>
      <FeedbackOverlay status={status} />
    </div>
  );
}