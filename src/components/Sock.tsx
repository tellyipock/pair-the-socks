import React from 'react';
import { cn } from '@/lib/utils';
import { SockColor, SockPattern, SockSize, SockSide } from '@/lib/game-logic';
interface SockProps {
  color: SockColor;
  pattern: SockPattern;
  size: SockSize;
  side: SockSide;
  className?: string;
  onClick?: () => void;
}
export function Sock({ color, pattern, size, side, className, onClick }: SockProps) {
  const isLarge = size === 'large';
  const isRight = side === 'right';
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-transform duration-200 active:scale-90 select-none",
        isLarge ? "w-24 h-32" : "w-16 h-24",
        className
      )}
    >
      <svg
        viewBox="0 0 100 120"
        className={cn(
          "w-full h-full drop-shadow-lg",
          isRight && "scale-x-[-1]"
        )}
      >
        <defs>
          <clipPath id={`sock-clip-${pattern}-${color}`}>
            <path d="M20,10 Q20,0 30,0 L70,0 Q80,0 80,10 L80,70 Q80,90 60,110 Q50,120 30,120 Q10,120 10,100 L10,30 Q10,10 20,10 Z" />
          </clipPath>
        </defs>
        {/* Sock Main Body */}
        <path
          d="M20,10 Q20,0 30,0 L70,0 Q80,0 80,10 L80,70 Q80,90 60,110 Q50,120 30,120 Q10,120 10,100 L10,30 Q10,10 20,10 Z"
          fill={color}
          stroke="#1A1A1A"
          strokeWidth="4"
        />
        {/* Pattern Implementation */}
        <g clipPath={`url(#sock-clip-${pattern}-${color})`}>
          {pattern === 'dots' && (
            <g fill="white" opacity="0.4">
              <circle cx="30" cy="30" r="5" />
              <circle cx="60" cy="20" r="5" />
              <circle cx="45" cy="50" r="5" />
              <circle cx="25" cy="75" r="5" />
              <circle cx="55" cy="85" r="5" />
              <circle cx="40" cy="100" r="5" />
            </g>
          )}
          {pattern === 'stripes' && (
            <g stroke="white" strokeWidth="6" opacity="0.4">
              <line x1="0" y1="20" x2="100" y2="20" />
              <line x1="0" y1="40" x2="100" y2="40" />
              <line x1="0" y1="60" x2="100" y2="60" />
              <line x1="0" y1="80" x2="100" y2="80" />
              <line x1="0" y1="100" x2="100" y2="100" />
            </g>
          )}
          {pattern === 'stars' && (
            <g fill="white" opacity="0.4" transform="scale(0.8) translate(10, 10)">
              <path d="M20,10 L25,25 L40,25 L30,35 L35,50 L20,40 L5,50 L10,35 L0,25 L15,25 Z" transform="translate(10, 10)" />
              <path d="M20,10 L25,25 L40,25 L30,35 L35,50 L20,40 L5,50 L10,35 L0,25 L15,25 Z" transform="translate(50, 40)" />
              <path d="M20,10 L25,25 L40,25 L30,35 L35,50 L20,40 L5,50 L10,35 L0,25 L15,25 Z" transform="translate(15, 80)" />
            </g>
          )}
          {pattern === 'waves' && (
            <path
              d="M0,20 Q25,10 50,20 T100,20 M0,50 Q25,40 50,50 T100,50 M0,80 Q25,70 50,80 T100,80"
              stroke="white"
              strokeWidth="4"
              fill="none"
              opacity="0.4"
            />
          )}
        </g>
        {/* Sock Heel & Toe Accents */}
        <path d="M10,90 Q15,115 35,115" stroke="black" strokeWidth="2" fill="none" opacity="0.2" />
        <path d="M70,0 L70,20" stroke="black" strokeWidth="2" fill="none" opacity="0.2" />
      </svg>
    </div>
  );
}