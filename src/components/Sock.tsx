import React from 'react';
import { cn } from '@/lib/utils';
import { SockColor, SockPattern, SockSize, SockSide } from '@/lib/game-logic';
interface SockProps {
  id: string;
  color: SockColor;
  pattern: SockPattern;
  size: SockSize;
  side: SockSide;
  className?: string;
  onClick?: () => void;
}
export function Sock({ id, color, pattern, size, side, className, onClick }: SockProps) {
  const isLarge = size === 'large';
  const isRight = side === 'right';
  const ariaLabel = `${color.replace('#', '')} ${pattern} ${size} ${side} sock`;
  const clipId = `sock-clip-${id}`;
  return (
    <div
      onClick={onClick}
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      className={cn(
        "relative cursor-pointer transition-all duration-200 active:scale-95 select-none hover:brightness-105 active:brightness-90",
        isLarge ? "w-20 h-28 md:w-24 md:h-32" : "w-14 h-20 md:w-16 md:h-24",
        className
      )}
    >
      <svg
        viewBox="0 0 100 120"
        className={cn(
          "w-full h-full drop-shadow-[2px_4px_6px_rgba(0,0,0,0.2)]",
          isRight && "scale-x-[-1]"
        )}
      >
        <defs>
          <clipPath id={clipId}>
            <path d="M20,10 Q20,0 30,0 L70,0 Q80,0 80,10 L80,70 Q80,90 60,110 Q50,120 30,120 Q10,120 10,100 L10,30 Q10,10 20,10 Z" />
          </clipPath>
        </defs>
        {/* Sock Main Body */}
        <path
          d="M20,10 Q20,0 30,0 L70,0 Q80,0 80,10 L80,70 Q80,90 60,110 Q50,120 30,120 Q10,120 10,100 L10,30 Q10,10 20,10 Z"
          fill={color}
          stroke="#1A1A1A"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Pattern Implementation */}
        <g clipPath={`url(#${clipId})`}>
          {pattern === 'dots' && (
            <g fill="white" opacity="0.5">
              <circle cx="30" cy="25" r="6" />
              <circle cx="65" cy="15" r="6" />
              <circle cx="50" cy="45" r="6" />
              <circle cx="25" cy="70" r="6" />
              <circle cx="60" cy="85" r="6" />
              <circle cx="35" cy="100" r="6" />
              <circle cx="75" cy="60" r="6" />
            </g>
          )}
          {pattern === 'stripes' && (
            <g stroke="white" strokeWidth="8" opacity="0.4">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="40" x2="100" y2="40" />
              <line x1="0" y1="60" x2="100" y2="60" />
              <line x1="0" y1="80" x2="100" y2="80" />
              <line x1="0" y1="100" x2="100" y2="100" />
            </g>
          )}
          {pattern === 'stars' && (
            <g fill="white" opacity="0.5">
              <path d="M20,10 L24,18 L32,18 L26,24 L28,32 L20,27 L12,32 L14,24 L8,18 L16,18 Z" transform="translate(10, 5) scale(0.8)" />
              <path d="M20,10 L24,18 L32,18 L26,24 L28,32 L20,27 L12,32 L14,24 L8,18 L16,18 Z" transform="translate(45, 35) scale(0.8)" />
              <path d="M20,10 L24,18 L32,18 L26,24 L28,32 L20,27 L12,32 L14,24 L8,18 L16,18 Z" transform="translate(15, 75) scale(0.8)" />
              <path d="M20,10 L24,18 L32,18 L26,24 L28,32 L20,27 L12,32 L14,24 L8,18 L16,18 Z" transform="translate(50, 80) scale(0.6)" />
            </g>
          )}
          {pattern === 'waves' && (
            <g opacity="0.5">
              <path d="M-20,20 Q10,10 40,20 T100,20 T140,20" stroke="white" strokeWidth="6" fill="none" />
              <path d="M-20,50 Q10,40 40,50 T100,50 T140,50" stroke="white" strokeWidth="6" fill="none" />
              <path d="M-20,80 Q10,70 40,80 T100,80 T140,80" stroke="white" strokeWidth="6" fill="none" />
            </g>
          )}
          {pattern === 'zigzag' && (
            <g stroke="white" strokeWidth="5" fill="none" opacity="0.5">
              <polyline points="0,15 20,5 40,15 60,5 80,15 100,5" />
              <polyline points="0,40 20,30 40,40 60,30 80,40 100,30" />
              <polyline points="0,65 20,55 40,65 60,55 80,65 100,55" />
              <polyline points="0,90 20,80 40,90 60,80 80,90 100,80" />
              <polyline points="0,115 20,105 40,115 60,105 80,115 100,105" />
            </g>
          )}
          {pattern === 'hearts' && (
            <g fill="white" opacity="0.5">
              <path d="M30,18 C30,14 24,10 20,14 C16,10 10,14 10,18 C10,24 20,30 20,30 C20,30 30,24 30,18 Z" transform="translate(15, 5) scale(0.85)" />
              <path d="M30,18 C30,14 24,10 20,14 C16,10 10,14 10,18 C10,24 20,30 20,30 C20,30 30,24 30,18 Z" transform="translate(45, 35) scale(0.85)" />
              <path d="M30,18 C30,14 24,10 20,14 C16,10 10,14 10,18 C10,24 20,30 20,30 C20,30 30,24 30,18 Z" transform="translate(10, 65) scale(0.85)" />
              <path d="M30,18 C30,14 24,10 20,14 C16,10 10,14 10,18 C10,24 20,30 20,30 C20,30 30,24 30,18 Z" transform="translate(48, 85) scale(0.65)" />
            </g>
          )}
        </g>
        {/* Cuffs, Heel & Toe Highlights */}
        <path d="M20,5 L80,5" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        <path d="M15,95 Q25,110 45,110" stroke="black" strokeWidth="3" fill="none" opacity="0.15" />
      </svg>
    </div>
  );
}