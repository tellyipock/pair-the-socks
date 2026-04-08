import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Play, Sparkles, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sock } from '@/components/Sock';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { ExitOverlay } from '@/components/ExitOverlay';
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
  const [isExiting, setIsExiting] = useState(false);
  const [pairCountInput, setPairCountInput] = useState('8');
  const handleStartGame = () => {
    const count = Math.min(Math.max(parseInt(pairCountInput) || 8, 1), 20);
    const initialSocks = generateInitialSocks(count);
    setSocks(initialSocks);
    setGameState('playing');
    setScore(0);
    setSelected([]);
    setStatus('idle');
    setIsLocked(false);
  };
  const handleRestart = () => {
    const count = socks.length / 2;
    const initialSocks = generateInitialSocks(count);
    setSocks(initialSocks);
    setGameState('playing');
    setScore(0);
    setSelected([]);
    setStatus('idle');
    setIsLocked(false);
  };
  const handleExit = () => {
    setIsLocked(true);
    setIsExiting(true);
    setTimeout(() => {
      setGameState('setup');
      setSocks([]);
      setSelected([]);
      setScore(0);
      setStatus('idle');
      setIsExiting(false);
      setIsLocked(false);
    }, 2000);
  };
  const validatePair = useCallback((s1: SockData, s2: SockData) => {
    setIsLocked(true);
    if (isPerfectPair(s1, s2)) {
      setStatus('correct');
      setTimeout(() => {
        setSocks(prev => {
          const nextSocks = prev.map(s =>
            (s.id === s1.id || s.id === s2.id) ? { ...s, isMatched: true } : s
          );
          const stillLeft = nextSocks.filter(s => !s.isMatched).length;
          if (stillLeft === 0) {
            setGameState('gameover');
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD93D', '#4D96FF', '#FF6B6B', '#6BCB77', '#9B72AA']
            });
          }
          return nextSocks;
        });
        setSelected([]);
        setScore(prev => prev + 2);
        setStatus('idle');
        setIsLocked(false);
      }, 800);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setSelected([]);
        setScore(prev => Math.max(0, prev - 1));
        setStatus('idle');
        setIsLocked(false);
      }, 800);
    }
  }, []);
  const handleSockClick = (sock: SockData) => {
    if (isLocked || isExiting || gameState !== 'playing' || sock.isMatched || selected.some(s => s.id === sock.id)) return;
    const newSelected = [...selected, sock];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      validatePair(newSelected[0], newSelected[1]);
    }
  };
  const matchedCount = socks.filter(s => s.isMatched).length;
  const totalSocks = socks.length;
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#1A1A1A] text-foreground font-sans overflow-x-hidden selection:bg-sock-yellow selection:text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-10 flex flex-col gap-6 md:gap-10 min-h-screen">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-display font-black text-[#1A1A1A] dark:text-white uppercase tracking-tighter">
                Pair <span className="text-sock-red">The</span> Socks
              </h1>
              <p className="text-muted-foreground font-bold text-sm md:text-base">Visual matching for super kids!</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle className="static" />
              {gameState !== 'setup' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    aria-label="Reset match"
                    className="border-4 border-[#1A1A1A] hover:bg-sock-yellow transition-colors font-black rounded-xl h-10 md:h-12 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-xs md:text-sm"
                  >
                    <RotateCcw className="mr-1 h-3 w-3 md:h-4 md:w-4" /> RESET
                  </Button>
                  <Button
                    onClick={handleExit}
                    variant="outline"
                    aria-label="Exit to menu"
                    className="border-4 border-[#1A1A1A] hover:bg-sock-red hover:text-white transition-colors font-black rounded-xl h-10 md:h-12 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-xs md:text-sm"
                  >
                    <LogOut className="mr-1 h-3 w-3 md:h-4 md:w-4" /> EXIT
                  </Button>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 flex flex-col relative">
            <AnimatePresence mode="wait">
              {gameState === 'setup' ? (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex items-center justify-center py-4"
                >
                  <Card className="max-w-md w-full p-6 md:p-10 border-4 border-[#1A1A1A] rounded-3xl md:rounded-4xl shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] bg-white space-y-6 md:space-y-8">
                    <div className="text-center space-y-2">
                      <div className="inline-flex p-3 md:p-4 bg-sock-yellow border-4 border-[#1A1A1A] rounded-2xl md:rounded-3xl mb-2 rotate-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                        <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-[#1A1A1A]" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A] uppercase italic">Ready to Play?</h2>
                      <p className="text-muted-foreground font-bold">How many pairs do you want to find?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pairs" className="text-sm font-black text-[#1A1A1A] uppercase">Number of Pairs (1-20)</Label>
                        <Input
                          id="pairs"
                          type="number"
                          min="1"
                          max="20"
                          value={pairCountInput}
                          onChange={(e) => setPairCountInput(e.target.value)}
                          className="text-xl md:text-2xl h-14 md:h-16 text-center font-black rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={handleStartGame}
                        aria-label="Start Game"
                        className="w-full h-16 md:h-20 text-xl md:text-2xl font-black bg-sock-blue hover:bg-sock-blue/90 text-white border-4 border-[#1A1A1A] rounded-xl md:rounded-2xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] active:translate-y-1 active:shadow-none transition-all uppercase"
                      >
                        <Play className="mr-2 fill-current w-5 h-5 md:w-6 md:h-6" /> Start Game
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="game"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col gap-6 md:gap-10"
                >
                  {/* Pairing Box */}
                  <section
                    aria-label="Current selections"
                    className="relative h-40 md:h-64 rounded-3xl md:rounded-4xl border-4 border-dashed border-[#1A1A1A]/20 bg-white/50 dark:bg-black/20 flex items-center justify-center gap-4 md:gap-8 px-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {selected.map((sock) => (
                        <motion.div
                          key={sock.id}
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="z-10"
                        >
                          <Sock {...sock} size="large" className="scale-75 md:scale-100" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {selected.length === 0 && (
                      <p className="text-lg md:text-2xl font-black text-muted-foreground/30 uppercase text-center italic">Choose a pair!</p>
                    )}
                    {selected.length === 1 && (
                      <div className="w-16 h-24 md:w-24 md:h-32 rounded-2xl md:rounded-3xl border-4 border-dashed border-[#1A1A1A]/10 animate-pulse bg-[#1A1A1A]/5" />
                    )}
                  </section>
                  {/* Pile Stage */}
                  <section
                    aria-label="Sock pile"
                    className="flex-1 relative bg-white dark:bg-zinc-900/40 rounded-3xl md:rounded-5xl border-4 border-[#1A1A1A] overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] min-h-[350px] md:min-h-[500px]"
                  >
                    <div className="absolute inset-0 p-4 md:p-10">
                      {socks.filter(s => !s.isMatched && !selected.some(sel => sel.id === s.id)).map((sock) => (
                        <motion.div
                          key={sock.id}
                          className="absolute cursor-pointer touch-none"
                          style={{
                            left: `${sock.x}%`,
                            top: `${sock.y}%`,
                          }}
                          whileHover={{ scale: 1.15, zIndex: 40 }}
                          animate={{ rotate: sock.rotation }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Sock
                            {...sock}
                            onClick={() => handleSockClick(sock)}
                            className="hover:shadow-xl rounded-full"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <AnimatePresence>
                      {gameState === 'gameover' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 z-50 bg-sock-yellow flex flex-col items-center justify-center p-6 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                          >
                            <Trophy className="w-24 h-24 md:w-32 md:h-32 text-[#1A1A1A] mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]" />
                          </motion.div>
                          <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] mb-2 md:mb-4 uppercase italic leading-none">Super Matcher!</h2>
                          <p className="text-lg md:text-2xl font-black text-[#1A1A1A]/70 mb-6 md:mb-8">Found all {totalSocks / 2} pairs with {score} points!</p>
                          <Button
                            size="lg"
                            onClick={handleExit}
                            className="bg-[#1A1A1A] text-white hover:bg-zinc-800 text-lg md:text-xl font-black px-8 md:px-12 py-6 md:py-8 rounded-2xl h-auto border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1"
                          >
                            WELL DONE!
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
            <footer className="flex justify-center pb-6 md:pb-8">
              <Card className="px-8 md:px-12 py-4 md:py-6 border-4 border-[#1A1A1A] bg-sock-blue text-white rounded-3xl md:rounded-4xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex items-center gap-6 md:gap-12">
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase opacity-80 tracking-widest">Score</p>
                    <p className="text-3xl md:text-5xl font-black tabular-nums">{score}</p>
                  </div>
                  <div className="h-10 md:h-12 w-1 bg-white/20 rounded-full" />
                  <div className="text-center">
                    <p className="text-[10px] md:text-xs font-black uppercase opacity-80 tracking-widest">Pairs</p>
                    <p className="text-3xl md:text-5xl font-black tabular-nums">{matchedCount / 2}/{totalSocks / 2}</p>
                  </div>
                </div>
              </Card>
            </footer>
          )}
        </div>
      </div>
      <FeedbackOverlay status={status} isExiting={isExiting} />
      <ExitOverlay isVisible={isExiting} />
    </div>
  );
}