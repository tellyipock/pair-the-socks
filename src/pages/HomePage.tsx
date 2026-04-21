import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Play, LogOut, Timer, Frown } from 'lucide-react';
import kidsgoflashLogoSquare from '@/assets/kidsGoflash_Logo_Square.jpg';
import pairTheSocksGame from '@/assets/pair_the_socks_game.png';
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
type GameOutcome = 'won' | 'lost' | null;

const BASE_PAIRS = 8;
const BASE_TIME = 30;
const SECONDS_PER_EXTRA_PAIR = 2;

function calcInitialTime(numPairs: number): number {
  return BASE_TIME + Math.max(0, numPairs - BASE_PAIRS) * SECONDS_PER_EXTRA_PAIR;
}
export function HomePage() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [socks, setSocks] = useState<SockData[]>([]);
  const [selected, setSelected] = useState<SockData[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isLocked, setIsLocked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [pairCountInput, setPairCountInput] = useState('8');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOutcome, setGameOutcome] = useState<GameOutcome>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = useCallback((seconds: number) => {
    setTimeLeft(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setGameState('gameover');
          setGameOutcome('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);
  const handleStartGame = () => {
    const count = Math.min(Math.max(parseInt(pairCountInput) || 8, 1), 20);
    const initialSocks = generateInitialSocks(count);
    setSocks(initialSocks);
    setGameState('playing');
    setScore(0);
    setSelected([]);
    setStatus('idle');
    setIsLocked(false);
    setGameOutcome(null);
    startCountdown(calcInitialTime(count));
  };
  const handleRestart = () => {
    if (isLocked) return;
    const count = socks.length / 2;
    const initialSocks = generateInitialSocks(count);
    setSocks(initialSocks);
    setGameState('playing');
    setScore(0);
    setSelected([]);
    setStatus('idle');
    setIsLocked(false);
    setGameOutcome(null);
    startCountdown(calcInitialTime(count));
  };
  const handleExit = () => {
    if (isExiting) return;
    setIsLocked(true);
    setIsExiting(true);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
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
      timerRef.current = setTimeout(() => {
        setSocks(prev => {
          const nextSocks = prev.map(s =>
            (s.id === s1.id || s.id === s2.id) ? { ...s, isMatched: true } : s
          );
          const stillLeft = nextSocks.filter(s => !s.isMatched).length;
          if (stillLeft === 0) {
            clearInterval(countdownRef.current!);
            setGameOutcome('won');
            setGameState('gameover');
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD93D', '#00B0F0', '#FF6B6B', '#d2ffd1', '#9B72AA']
            });
          }
          return nextSocks;
        });
        setSelected([]);
        setScore(prev => prev + 2);
        setStatus('idle');
        setIsLocked(false);
      }, 400);
    } else {
      setStatus('wrong');
      timerRef.current = setTimeout(() => {
        setSelected([]);
        setScore(prev => Math.max(0, prev - 1));
        setStatus('idle');
        setIsLocked(false);
      }, 400);
    }
  }, []);
  const handleSockClick = (sock: SockData) => {
    if (isLocked || isExiting || gameState !== 'playing') return;
    if (sock.isMatched || selected.some(s => s.id === sock.id)) return;
    const newSelected = [...selected, sock];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      validatePair(newSelected[0], newSelected[1]);
    }
  };
  const matchedCount = socks.filter(s => s.isMatched).length;
  const totalSocks = socks.length;
  const numPairs = Math.min(Math.max(parseInt(pairCountInput) || 8, 1), 20);
  const previewTime = calcInitialTime(numPairs);
  const isTimeLow = timeLeft <= 10 && timeLeft > 0;
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#1A1A1A] text-foreground font-sans overflow-x-hidden selection:bg-sock-yellow selection:text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="py-4 md:py-8 flex flex-col gap-4 md:gap-8 min-h-screen">
          <header className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 md:gap-4">
              <img src={kidsgoflashLogoSquare} alt="KidsGoFlash" className="h-12 md:h-16 w-12 md:w-16 object-cover shrink-0" />
              <div className="space-y-1">
              <h2 className="text-3xl md:text-5xl font-display font-black text-[#1A1A1A] dark:text-white uppercase tracking-tighter">
                Pair <span className="text-sock-red">The</span> Socks
              </h2>
              <p className="text-muted-foreground font-bold text-sm md:text-base">Visual matching for super kids!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle className="static" />
              {gameState !== 'setup' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleRestart}
                    disabled={isLocked}
                    className="bg-sock-yellow text-[#1A1A1A] border-4 border-[#1A1A1A] hover:bg-[#FACC15] transition-all font-black rounded-xl h-10 md:h-12 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-xs md:text-sm active:translate-y-0.5 active:shadow-none"
                  >
                    <RotateCcw className="mr-1 h-3 w-3 md:h-4 md:w-4" /> RESET
                  </Button>
                  <Button
                    onClick={handleExit}
                    disabled={isExiting}
                    className="bg-sock-red text-white border-4 border-[#1A1A1A] hover:bg-[#E55353] transition-all font-black rounded-xl h-10 md:h-12 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] text-xs md:text-sm active:translate-y-0.5 active:shadow-none"
                  >
                    <LogOut className="mr-1 h-3 w-3 md:h-4 md:w-4" /> EXIT
                  </Button>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 flex flex-col relative min-h-0">
            <AnimatePresence mode="wait">
              {gameState === 'setup' ? (
                <motion.div
                  key="setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex items-center justify-center py-4"
                >
                  <Card className="max-w-md w-full p-4 md:p-8 border-4 border-[#1A1A1A] rounded-3xl md:rounded-4xl shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] bg-white space-y-6 md:space-y-8">
                    <div className="text-center space-y-2">
                      <div className="inline-flex mb-2">
                        <img src={pairTheSocksGame} alt="Pair The Socks" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-[#1A1A1A] uppercase italic">Ready to Play?</h3>
                      <p className="text-muted-foreground font-bold">How many pairs of socks do you want to find?</p>
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
                      <div className="flex items-center justify-center gap-2 py-1 text-sm font-bold text-muted-foreground">
                        <Timer className="w-4 h-4" />
                        <span>You&apos;ll have <span className="text-[#1A1A1A] dark:text-white font-black">{previewTime}s</span> to find all pairs</span>
                      </div>
                      <Button
                        onClick={handleStartGame}
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
                  className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0"
                >
                  <div className="flex justify-center shrink-0">
                    <Card className="px-6 md:px-10 py-3 md:py-4 border-4 border-[#1A1A1A] bg-sock-blue text-white rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                      <div className="flex items-center gap-5 md:gap-10">
                        <div className="text-center">
                          <p className="text-[10px] md:text-xs font-black uppercase opacity-80 tracking-widest">Score</p>
                          <p className="text-2xl md:text-4xl font-black tabular-nums">{score}</p>
                        </div>
                        <div className="h-8 md:h-10 w-1 bg-white/20 rounded-full" />
                        <div className="text-center">
                          <p className="text-[10px] md:text-xs font-black uppercase opacity-80 tracking-widest">Pairs</p>
                          <p className="text-2xl md:text-4xl font-black tabular-nums">{matchedCount / 2}/{totalSocks / 2}</p>
                        </div>
                        <div className="h-8 md:h-10 w-1 bg-white/20 rounded-full" />
                        <motion.div
                          className="text-center"
                          animate={isTimeLow ? { scale: [1, 1.08, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                        >
                          <p className="text-[10px] md:text-xs font-black uppercase opacity-80 tracking-widest flex items-center gap-1 justify-center">
                            <Timer className="w-3 h-3" /> Time
                          </p>
                          <p className={`text-2xl md:text-4xl font-black tabular-nums ${isTimeLow ? 'text-sock-yellow' : ''}`}>
                            {timeLeft}s
                          </p>
                        </motion.div>
                      </div>
                    </Card>
                  </div>
                  <section
                    aria-label="Current selections"
                    className="relative shrink-0 h-40 md:h-64 rounded-3xl md:rounded-4xl border-4 border-dashed border-[#1A1A1A]/20 bg-white/50 dark:bg-black/20 flex items-center justify-center gap-4 md:gap-8 px-4"
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
                  <section
                    aria-label="Sock pile"
                    className="flex-1 relative bg-white dark:bg-zinc-900/40 rounded-3xl md:rounded-5xl border-4 border-[#1A1A1A] overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] min-h-[50vh]"
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
                      {gameState === 'gameover' && gameOutcome === 'won' && (
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
                          <h3 className="text-4xl md:text-6xl font-black text-[#1A1A1A] mb-2 md:mb-4 uppercase italic leading-none">Super Matcher!</h3>
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
                      {gameState === 'gameover' && gameOutcome === 'lost' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 z-50 bg-red-500 flex flex-col items-center justify-center p-6 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: 20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                          >
                            <Frown className="w-24 h-24 md:w-32 md:h-32 text-white mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]" />
                          </motion.div>
                          <h3 className="text-4xl md:text-6xl font-black text-white mb-2 md:mb-4 uppercase italic leading-none">Time&apos;s Up!</h3>
                          <p className="text-lg md:text-2xl font-black text-white/80 mb-6 md:mb-8">
                            You found {matchedCount / 2} of {totalSocks / 2} pairs. Try again!
                          </p>
                          <div className="flex gap-3 flex-wrap justify-center">
                            <Button
                              size="lg"
                              onClick={handleRestart}
                              className="bg-white text-red-500 hover:bg-white/90 text-lg md:text-xl font-black px-8 md:px-12 py-6 md:py-8 rounded-2xl h-auto border-4 border-white/30 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1"
                            >
                              <RotateCcw className="mr-2 w-5 h-5" /> TRY AGAIN
                            </Button>
                            <Button
                              size="lg"
                              onClick={handleExit}
                              className="bg-transparent text-white hover:bg-white/10 text-lg md:text-xl font-black px-8 md:px-12 py-6 md:py-8 rounded-2xl h-auto border-4 border-white/40 active:translate-y-1"
                            >
                              EXIT
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
      <FeedbackOverlay status={status} isExiting={isExiting} />
      <ExitOverlay isVisible={isExiting} />
    </div>
  );
}