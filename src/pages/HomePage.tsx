import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sock } from '@/components/Sock';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { generateInitialSocks, SockData, isPerfectPair } from '@/lib/game-logic';
import { ThemeToggle } from '@/components/ThemeToggle';
type GameState = 'setup' | 'playing' | 'gameover';
export function HomePage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [socks, setSocks] = useState<SockData[]>([]);
  const [selected, setSelected] = useState<SockData[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isLocked, setIsLocked] = useState(false);
  const [pairCountInput, setPairCountInput] = useState('8');
  const handleStartGame = () => {
    const count = parseInt(pairCountInput) || 8;
    const initialSocks = generateInitialSocks(count);
    setSocks(initialSocks);
    setGameState('playing');
    setScore(0);
    setSelected([]);
  };
  const handleReset = () => {
    setGameState('setup');
    setSocks([]);
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
        // Use updated state calculation for game win check
        const stillLeft = socks.filter(s => !s.isMatched && s.id !== s1.id && s.id !== s2.id).length;
        if (stillLeft === 0) {
          setGameState('gameover');
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
  const totalSocks = socks.length;
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
              <p className="text-muted-foreground font-medium">Visual matching for super kids!</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="relative top-0 right-0" />
              {gameState !== 'setup' && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-4 border-[#1A1A1A] hover:bg-[#FFD93D] transition-colors font-bold rounded-xl h-12"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> MENU
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 flex flex-col relative">
            <AnimatePresence mode="wait">
              {gameState === 'setup' ? (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <Card className="max-w-md w-full p-10 border-4 border-[#1A1A1A] rounded-4xl shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] bg-white space-y-8">
                    <div className="text-center space-y-2">
                      <div className="inline-flex p-4 bg-[#FFD93D] border-4 border-[#1A1A1A] rounded-3xl mb-4 rotate-3">
                        <Sparkles className="w-12 h-12 text-[#1A1A1A]" />
                      </div>
                      <h2 className="text-3xl font-black text-[#1A1A1A] uppercase italic">Ready to Play?</h2>
                      <p className="text-muted-foreground font-bold">How many pairs do you want to find?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pairs" className="text-lg font-black text-[#1A1A1A] dark:text-[#1A1A1A]">NUMBER OF PAIRS</Label>
                        <Input
                          id="pairs"
                          type="number"
                          min="1"
                          max="20"
                          value={pairCountInput}
                          onChange={(e) => setPairCountInput(e.target.value)}
                          placeholder="8"
                          className="text-2xl h-16 text-center font-black"
                        />
                      </div>
                      <Button
                        onClick={handleStartGame}
                        className="w-full h-20 text-2xl font-black bg-[#4D96FF] hover:bg-[#3d86ef] text-white border-4 border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
                      >
                        <Play className="mr-2 fill-current" /> Start Game
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col gap-12"
                >
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
                  <section className="flex-1 relative bg-white dark:bg-zinc-900/50 rounded-5xl border-4 border-[#1A1A1A] overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] min-h-[400px]">
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
                      {gameState === 'gameover' && (
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
                          <h2 className="text-6xl font-black text-[#1A1A1A] mb-4 uppercase italic">Super Matcher!</h2>
                          <p className="text-2xl font-bold text-[#1A1A1A]/80 mb-8">You found all {totalSocks / 2} pairs with {score} points!</p>
                          <Button
                            size="lg"
                            onClick={handleReset}
                            className="bg-[#1A1A1A] text-white hover:bg-zinc-800 text-xl font-bold px-12 py-8 rounded-2xl h-auto border-4 border-white shadow-xl"
                          >
                            PLAY AGAIN
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          {/* Scoreboard */}
          {gameState !== 'setup' && (
            <footer className="flex justify-center pb-8">
              <Card className="px-12 py-6 border-4 border-[#1A1A1A] bg-[#4D96FF] text-white rounded-4xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <p className="text-xs font-black uppercase opacity-80 tracking-wider">Score</p>
                    <p className="text-5xl font-black tabular-nums">{score}</p>
                  </div>
                  <div className="h-12 w-1 bg-white/20 rounded-full" />
                  <div className="text-center">
                    <p className="text-xs font-black uppercase opacity-80 tracking-wider">Pairs</p>
                    <p className="text-5xl font-black tabular-nums">{matchedCount / 2}/{totalSocks / 2}</p>
                  </div>
                </div>
              </Card>
            </footer>
          )}
        </div>
      </div>
      <FeedbackOverlay status={status} />
    </div>
  );
}