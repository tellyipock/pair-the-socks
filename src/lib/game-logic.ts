import { v4 as uuidv4 } from 'uuid';
export type SockColor = '#FFD93D' | '#4D96FF' | '#FF6B6B' | '#6BCB77' | '#9B72AA';
export type SockPattern = 'dots' | 'stripes' | 'stars' | 'waves';
export type SockSize = 'small' | 'large';
export type SockSide = 'left' | 'right';
export interface SockData {
  id: string;
  color: SockColor;
  pattern: SockPattern;
  size: SockSize;
  side: SockSide;
  isMatched: boolean;
  x: number;
  y: number;
  rotation: number;
}
const COLORS: SockColor[] = ['#FFD93D', '#4D96FF', '#FF6B6B', '#6BCB77', '#9B72AA'];
const PATTERNS: SockPattern[] = ['dots', 'stripes', 'stars', 'waves'];
const SIZES: SockSize[] = ['small', 'large'];
export function generateInitialSocks(): SockData[] {
  const socks: SockData[] = [];
  // Generate 6 pairs (12 socks total)
  for (let i = 0; i < 6; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const size = SIZES[Math.floor(Math.random() * SIZES.length)];
    // Create Left and Right pair
    ['left', 'right'].forEach((side) => {
      socks.push({
        id: uuidv4(),
        color,
        pattern,
        size,
        side: side as SockSide,
        isMatched: false,
        x: 10 + Math.random() * 80, // % within container
        y: 10 + Math.random() * 80, // % within container
        rotation: Math.random() * 360,
      });
    });
  }
  // Shuffle the socks
  return socks.sort(() => Math.random() - 0.5);
}
export function isPerfectPair(sock1: SockData, sock2: SockData): boolean {
  return (
    sock1.color === sock2.color &&
    sock1.pattern === sock2.pattern &&
    sock1.size === sock2.size &&
    sock1.side !== sock2.side
  );
}